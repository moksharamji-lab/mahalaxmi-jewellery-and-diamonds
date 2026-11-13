import { NextResponse } from "next/server";



import { Readable } from "stream";



import { ID, Query } from "node-appwrite";



import { getAuthenticatedAdminClient } from "@/lib/admin-pocketbase";



import { getAdminResource } from "@/lib/admin-resources";



import {
  APPWRITE_DATABASE_ID,
  tablesDB,
} from "@/lib/appwrite";

import {
  APPWRITE_GALLERY_TABLE_ID,
  APPWRITE_PRODUCT_SETTINGS_TABLE_ID,
} from "@/lib/appwrite-tables";



import {
  drive,
  getDriveFolder,
} from "@/lib/google-drive";

import {
  detectSupportedMimeType,
} from "@/lib/file-signature";



/* =========================================================
   TYPES
========================================================= */



type DriveUploadResult = {
  fileId: string;
  name: string;
};



/* =========================================================
   APPWRITE TABLE MAPPING
========================================================= */



function getAppwriteTableId(
  resource: string
): string | null {

  switch (resource) {

    case "Categories":

      return "categories";



    case "Collections":

      return "collections";



    case "Stores":

      return "stores";



    case "Rates":

      return "rates";



    case "HeroSliders":

      return "herosliders";



    case "Products":

      return "products";



    case "OurStory":

      return "ourstory";

    case "ProductSettings":

       return APPWRITE_PRODUCT_SETTINGS_TABLE_ID;

    case "Enquiries":

      return "enquiries";



    case "Gallery":

      return APPWRITE_GALLERY_TABLE_ID;



    default:

      return null;

  }

}



/* =========================================================
   GOOGLE DRIVE FOLDER MAPPING
========================================================= */



function getDriveFolderName(
  resource: string,
  formData: FormData
): string | null {

  if (resource === "Products") {

    const collectionValue = String(
      formData.get("collection") ??
        formData.get("collectionId") ??
        ""
    )
      .trim()
      .toLowerCase();



    if (
      collectionValue === "diamond" ||
      collectionValue.includes("diamond")
    ) {

      return "Diamonds";

    }



    return "Gold";

  }



  if (resource === "HeroSliders") {

    return "Hero";

  }



  if (resource === "Categories") {

    return "Categories";

  }



  if (resource === "Collections") {

    return "Categories";

  }



  if (resource === "Stores") {

    return "Categories";

  }



  if (resource === "Gallery") {

    return "Gallery";

  }



  return null;

}



/* =========================================================
   GOOGLE DRIVE UPLOAD SECURITY
========================================================= */



function isFile(
  value: FormDataEntryValue | null
): value is File {

  return (
    value !== null &&
    typeof value !== "string" &&
    typeof value.arrayBuffer === "function"
  );

}

const IMAGE_MIME_TYPES =
  new Set<string>([
    "image/jpeg",
    "image/png",
    "image/webp",
  ]);

const VIDEO_MIME_TYPES =
  new Set<string>([
    "video/mp4",
    "video/webm",
  ]);

const MAX_IMAGE_SIZE =
  10 * 1024 * 1024;

const MAX_VIDEO_SIZE =
  100 * 1024 * 1024;



/* =========================================================
   FILE NAME SANITIZER
========================================================= */



function sanitizeFileName(
  fileName: string
): string {

  return fileName
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, "")
    .replace(/\s+/g, "-")
    .trim();

}



/* =========================================================
   UPLOAD FILE TO GOOGLE DRIVE
========================================================= */



async function uploadFileToDrive(
  file: File,
  folderName: string,
  allowedMimeTypes: Set<string>,
  maxSizeBytes: number
): Promise<DriveUploadResult> {

  if (file.size <= 0) {
    throw new Error(
      "The uploaded file is empty."
    );
  }

  if (file.size > maxSizeBytes) {
    throw new Error(
      `File "${file.name}" exceeds the allowed size.`
    );
  }

  const detectedMimeType =
    await detectSupportedMimeType(file);

  if (
    !detectedMimeType ||
    !allowedMimeTypes.has(detectedMimeType)
  ) {
    throw new Error(
      `File "${file.name}" has an unsupported file type.`
    );
  }

  const folder = await getDriveFolder(
    folderName
  );



  if (!folder?.id) {

    throw new Error(
      `Google Drive folder "${folderName}" was not found.`
    );

  }



  const arrayBuffer =
    await file.arrayBuffer();



  const buffer =
    Buffer.from(arrayBuffer);



  const readable =
    Readable.from(buffer);



  const safeFileName =
    sanitizeFileName(file.name);



  const uploaded =
    await drive.files.create({

      requestBody: {

        name:
          safeFileName ||
          `upload-${Date.now()}`,

        parents: [
          folder.id,
        ],

      },

      media: {

        mimeType:
          detectedMimeType,

        body: readable,

      },

      fields:
        "id,name",

    });



  const fileId =
    uploaded.data.id;



  if (!fileId) {

    throw new Error(
      "Google Drive upload failed: no file ID returned."
    );

  }



  return {

    fileId,

    name:
      uploaded.data.name ??
      safeFileName,

  };

}



/* =========================================================
   DELETE GOOGLE DRIVE FILE
========================================================= */



async function deleteDriveFile(
  fileId: string
): Promise<void> {

  if (!fileId) {

    return;

  }



  try {

    await drive.files.delete({

      fileId,

    });

  } catch (error) {

    console.error(
      `[Google Drive] Failed to delete file ${fileId}:`,
      error
    );

  }

}



/* =========================================================
   DELETE MULTIPLE GOOGLE DRIVE FILES
========================================================= */



async function deleteDriveFiles(
  fileIds: string[]
): Promise<void> {

  await Promise.all(
    fileIds
      .filter(Boolean)
      .map(
        (fileId) =>
          deleteDriveFile(fileId)
      )
  );

}



/* =========================================================
   FORM VALUE HELPERS
========================================================= */



function formValue(
  formData: FormData,
  key: string
): string | undefined {

  const value =
    formData.get(key);



  if (
    value === null ||
    typeof value !== "string"
  ) {

    return undefined;

  }



  const trimmed =
    value.trim();



  return trimmed
    ? trimmed
    : undefined;

}



/* =========================================================
   FORM NUMBER HELPER
========================================================= */



function numberValue(
  formData: FormData,
  key: string
): number | undefined {

  const value =
    formValue(
      formData,
      key
    );



  if (!value) {

    return undefined;

  }



  const number =
    Number(value);



  return Number.isFinite(number)
    ? number
    : undefined;

}



/* =========================================================
   FORM BOOLEAN HELPER
========================================================= */



function booleanValue(
  formData: FormData,
  key: string
): boolean | undefined {

  const value =
    formValue(
      formData,
      key
    );



  if (value === undefined) {

    return undefined;

  }



  const normalized =
    value.toLowerCase();



  if (
    normalized === "true" ||
    normalized === "1" ||
    normalized === "yes" ||
    normalized === "on"
  ) {

    return true;

  }



  if (
    normalized === "false" ||
    normalized === "0" ||
    normalized === "no" ||
    normalized === "off"
  ) {

    return false;

  }



  return undefined;

}



/* =========================================================
   APPWRITE TABLE MAPPING
========================================================= */



function getResourceCollection(
  resource: string
) {

  return getAdminResource(
    resource
  );

}



/* =========================================================
   PRODUCT SLUG HELPERS
========================================================= */



function slugify(
  value: string
): string {

  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

}



/* =========================================================
   CREATE UNIQUE PRODUCT SLUG
========================================================= */



async function createUniqueProductSlug(
  name: string
): Promise<string> {

  const baseSlug =
    slugify(name);



  if (!baseSlug) {

    return `product-${Date.now()}`;

  }



  let slug =
    baseSlug;



  let counter = 1;



  while (true) {

    const response =
      await tablesDB.listRows({

        databaseId:
          APPWRITE_DATABASE_ID,

        tableId:
          "products",

        queries: [

          Query.equal(
            "slug",
            slug
          ),

          Query.limit(1),

        ],

      });



    if (
      response.rows.length === 0
    ) {

      return slug;

    }



    counter += 1;



    slug =
      `${baseSlug}-${counter}`;

  }

}



/* =========================================================
   RESOLVE COLLECTION ID
========================================================= */



async function resolveCollectionId(
  formData: FormData
) {

  const submittedCollectionId =
    formValue(
      formData,
      "collectionId"
    );



  const submittedCollection =
    formValue(
      formData,
      "collection"
    );



  const raw =
    submittedCollectionId?.trim()
      ? submittedCollectionId
      : submittedCollection;



  if (!raw) {

    return undefined;

  }



  const collections =
    await tablesDB.listRows({

      databaseId:
        APPWRITE_DATABASE_ID,

      tableId:
        "collections",

      queries: [
        Query.limit(100),
      ],

    });



  const directMatch =
    collections.rows.find(
      (row) =>
        String(row.$id) === raw
    );



  if (directMatch) {

    return String(
      directMatch.$id
    );

  }



  const normalizedRaw =
    raw
      .trim()
      .toLowerCase();



  const nameMatch =
    collections.rows.find(
      (row) =>
        String(
          row.name ?? ""
        )
          .trim()
          .toLowerCase() ===
        normalizedRaw
    );



  if (nameMatch) {

    return String(
      nameMatch.$id
    );

  }



  const slugMatch =
    collections.rows.find(
      (row) =>
        String(
          row.slug ?? ""
        )
          .trim()
          .toLowerCase() ===
        normalizedRaw
    );



  return slugMatch
    ? String(slugMatch.$id)
    : undefined;

}



/* =========================================================
   BUILD APPWRITE DATA
========================================================= */



async function buildAppwriteData(
  resource: string,
  formData: FormData,
  driveImageIds: string[],
  driveVideoId: string
) {

  switch (resource) {



    /* =====================================================
       CATEGORIES
    ===================================================== */



    case "Categories": {

      const data: Record<
        string,
        unknown
      > = {};



      const name =
        formValue(
          formData,
          "name"
        );



      const slug =
        formValue(
          formData,
          "slug"
        );



      const categoryCollection =
        formValue(
          formData,
          "collection"
        );



      const sortOrder =
        numberValue(
          formData,
          "sortOrder"
        );



      const active =
        booleanValue(
          formData,
          "active"
        );



      if (name !== undefined) {

        data.name =
          name;

      }



      if (slug !== undefined) {

        data.slug =
          slug;

      }



      if (
        categoryCollection !==
        undefined
      ) {

        data.collection =
          categoryCollection;

      }



      if (active !== undefined) {

        data.active =
          active;

      }

      data.sortOrder =
        sortOrder ?? 0;

      if (driveImageIds.length > 0) {
        data.driveImage =
          driveImageIds[0];
      }



      return data;

    }



    /* =====================================================
       COLLECTIONS
    ===================================================== */



    case "Collections": {

      const data: Record<
        string,
        unknown
      > = {};



      const name =
        formValue(
          formData,
          "name"
        );



      const slug =
        formValue(
          formData,
          "slug"
        );



      const description =
        formValue(
          formData,
          "description"
        );



      const order =
        numberValue(
          formData,
          "order"
        );



      const active =
        booleanValue(
          formData,
          "active"
        );



      if (name !== undefined) {

        data.name =
          name;

      }



      if (slug !== undefined) {

        data.slug =
          slug;

      }



      if (
        description !==
        undefined
      ) {

        data.description =
          description;

      }



      if (order !== undefined) {

        data.order =
          order;

      }



      if (active !== undefined) {

        data.active =
          active;

      }



      return data;

    }



    /* =====================================================
       STORES
    ===================================================== */



    case "Stores": {

      const data: Record<
        string,
        unknown
      > = {};



      const name =
        formValue(
          formData,
          "name"
        );



      const collection =
        formValue(
          formData,
          "collection"
        );



      const address =
        formValue(
          formData,
          "address"
        );



      const phone =
        formValue(
          formData,
          "phone"
        );



      const whatsapp =
        formValue(
          formData,
          "whatsapp"
        );



      const whatsappUrl =
        formValue(
          formData,
          "whatsappUrl"
        );



      const googleMapsUrl =
        formValue(
          formData,
          "googleMapsUrl"
        );



      const email =
        formValue(
          formData,
          "email"
        );



      const description =
        formValue(
          formData,
          "description"
        );



      const active =
        booleanValue(
          formData,
          "active"
        );



      if (name !== undefined) {

        data.name =
          name;

      }



      if (
        collection !==
        undefined
      ) {

        data.collection =
          collection;

      }



      if (
        address !==
        undefined
      ) {

        data.address =
          address;

      }



      if (phone !== undefined) {

        data.phone =
          phone;

      }



      if (
        whatsapp !==
        undefined
      ) {

        data.whatsapp =
          whatsapp;

      }



      if (
        whatsappUrl !==
        undefined
      ) {

        data.whatsappUrl =
          whatsappUrl;

      }



      if (
        googleMapsUrl !==
        undefined
      ) {

        data.googleMapsUrl =
          googleMapsUrl;

      }



      if (email !== undefined) {

        data.email =
          email;

      }



      if (
        description !==
        undefined
      ) {

        data.description =
          description;

      }



      if (active !== undefined) {

        data.active =
          active;

      }



      if (
        driveImageIds.length >
        0
      ) {

        data.logo =
          `/api/media/${driveImageIds[0]}`;

        data.driveLogo =
          driveImageIds[0];

      }



      return data;

    }



    /* =====================================================
       RATES
    ===================================================== */



    case "Rates": {

      const data: Record<
        string,
        unknown
      > = {};



      const name =
        formValue(
          formData,
          "name"
        );



      const value =
        numberValue(
          formData,
          "value"
        );



      const active =
        booleanValue(
          formData,
          "active"
        );



      if (name !== undefined) {

        data.name =
          name;

      }



      if (value !== undefined) {

        data.value =
          value;

      }



      if (active !== undefined) {

        data.active =
          active;

      }



      return data;

    }



    /* =====================================================
       HERO SLIDERS
    ===================================================== */



    case "HeroSliders": {

      const data: Record<
        string,
        unknown
      > = {};



      const title =
        formValue(
          formData,
          "title"
        );



      const subtitle =
        formValue(
          formData,
          "subtitle"
        );



      const buttonText =
        formValue(
          formData,
          "buttonText"
        );



      const buttonLink =
        formValue(
          formData,
          "buttonLink"
        );



      const page =
        formValue(
          formData,
          "page"
        );



      const order =
        numberValue(
          formData,
          "order"
        );



      const active =
        booleanValue(
          formData,
          "active"
        );



      const mediaType =
        formValue(
          formData,
          "mediaType"
        );



      if (title !== undefined) {

        data.title =
          title;

      }



      if (
        subtitle !==
        undefined
      ) {

        data.subtitle =
          subtitle;

      }



      if (
        buttonText !==
        undefined
      ) {

        data.buttonText =
          buttonText;

      }



      if (
        buttonLink !==
        undefined
      ) {

        data.buttonLink =
          buttonLink;

      }



      if (page !== undefined) {

        data.page =
          page;

      }



      if (order !== undefined) {

        data.order =
          order;

      }



      if (active !== undefined) {

        data.active =
          active;

      }



      if (
        mediaType !==
        undefined
      ) {

        data.mediaType =
          mediaType;

      }



      if (
        driveImageIds.length >
        0
      ) {

        data.image =
          `/api/media/${driveImageIds[0]}`;

        data.imageUrl =
          `/api/media/${driveImageIds[0]}`;

        data.driveImage =
          driveImageIds[0];

      }



      if (driveVideoId) {

        data.video =
          `/api/media/${driveVideoId}`;

        data.videoUrl =
          `/api/media/${driveVideoId}`;

        data.driveVideo =
          driveVideoId;

      }



      return data;

    }
     /* =====================================================
   PRODUCTS
===================================================== */

case "Products": {
  const data: Record<string, unknown> = {};

  const name = formValue(formData, "name");

  const submittedSlug = formValue(
    formData,
    "slug"
  );

  const description = formValue(
    formData,
    "description"
  );

  const purity = formValue(
    formData,
    "purity"
  );

  const tagNumber = formValue(
    formData,
    "tagNumber"
  );

  const featured = booleanValue(
    formData,
    "featured"
  );

  const active = booleanValue(
    formData,
    "active"
  );

  const weight = formValue(
    formData,
    "weight"
  );

  const categoryId = formValue(
    formData,
    "categoryId"
  );

  const collectionId =
    await resolveCollectionId(formData);

  if (name !== undefined) {
    data.name = name;
  }

  if (submittedSlug !== undefined) {
    data.slug = submittedSlug;
  } else if (name) {
    data.slug =
      await createUniqueProductSlug(name);
  }

  if (description !== undefined) {
    data.description = description;
  }

  if (purity !== undefined) {
    data.purity = purity;
  }

  if (tagNumber !== undefined) {
    data.tagNumber = tagNumber;
  }

  if (featured !== undefined) {
    data.featured = featured;
  }

  if (active !== undefined) {
    data.active = active;
  }

  /*
   * Weight is intentionally retained.
   * It is currently hidden from the public website
   * but remains available for future client use.
   */
  if (weight !== undefined) {
    data.weight = weight;
  }

  if (categoryId !== undefined) {
    data.categoryId = categoryId;
  }

  if (collectionId) {
    data.collectionId = collectionId;
  }

 
  if (driveImageIds.length > 0) {
    // Save Google Drive IDs in Appwrite array attribute
  data.driveImages = driveImageIds;
  }


  if (driveVideoId) {
    data.driveVideo = driveVideoId;

    data.video =
      `/api/media/${driveVideoId}`;
  }

  return data;
}



      /* =====================================================
         OUR STORY
      ===================================================== */

      case "OurStory": {

        const data: Record<
          string,
          unknown
        > = {};



        const title =
          formValue(
            formData,
            "title"
          );



        const subtitle =
          formValue(
            formData,
            "subtitle"
          );



        const content =
          formValue(
            formData,
            "content"
          );



        const active =
          booleanValue(
            formData,
            "active"
          );



        if (title !== undefined) {

          data.title =
            title;

        }



        if (
          subtitle !==
          undefined
        ) {

          data.subtitle =
            subtitle;

        }



        if (
          content !==
          undefined
        ) {

          data.content =
            content;

        }



        if (active !== undefined) {

          data.active =
            active;

        }



        if (
          driveImageIds.length >
          0
        ) {

          data.image =
            `/api/media/${driveImageIds[0]}`;

          data.driveImage =
            driveImageIds[0];

        }



        return data;

      }

      /* =====================================================
         PRODUCT SETTINGS
      ===================================================== */

case "ProductSettings": {

  const data: Record<
    string,
    unknown
  > = {};

  const line1 =
    formValue(
      formData,
      "line1"
    );

  const line2 =
    formValue(
      formData,
      "line2"
    );

  const line3 =
    formValue(
      formData,
      "line3"
    );

  const line4 =
    formValue(
      formData,
      "line4"
    );

  if (line1 !== undefined) {
    data.line1 = line1;
  }

  if (line2 !== undefined) {
    data.line2 = line2;
  }

  if (line3 !== undefined) {
    data.line3 = line3;
  }

  if (line4 !== undefined) {
    data.line4 = line4;
  }

  return data;
}

      /* =====================================================
         ENQUIRIES
      ===================================================== */

      case "Enquiries": {

        const data: Record<
          string,
          unknown
        > = {};



        const name =
          formValue(
            formData,
            "name"
          );



        const phone =
          formValue(
            formData,
            "phone"
          );



        const email =
          formValue(
            formData,
            "email"
          );



        const message =
          formValue(
            formData,
            "message"
          );



        const productId =
          formValue(
            formData,
            "productId"
          );



        const productName =
          formValue(
            formData,
            "productName"
          );



        const collection =
          formValue(
            formData,
            "collection"
          );



        if (name !== undefined) {

          data.name =
            name;

        }



        if (phone !== undefined) {

          data.phone =
            phone;

        }



        if (email !== undefined) {

          data.email =
            email;

        }



        if (
          message !==
          undefined
        ) {

          data.message =
            message;

        }



        if (
          productId !==
          undefined
        ) {

          data.productId =
            productId;

        }



        if (
          productName !==
          undefined
        ) {

          data.productName =
            productName;

        }



        if (
          collection !==
          undefined
        ) {

          data.collection =
            collection;

        }



        return data;

      }



    /* =====================================================
   GALLERY
===================================================== */

case "Gallery": {
  const data: Record<
    string,
    unknown
  > = {};

  const order =
    numberValue(
      formData,
      "order"
    );

  const active =
    booleanValue(
      formData,
      "active"
    );

  /*
   * Gallery requires:
   * - name
   * - image
   * - driveFileId
   * - order
   * - active
   */

  const imageEntry =
    formData.get("images") ??
    formData.get("image");

  if (driveImageIds.length > 0) {
    data.image =
      `/api/media/${driveImageIds[0]}`;

    data.driveFileId =
      driveImageIds[0];
  }

  /*
   * Appwrite Gallery.name is required.
   * Use the original uploaded filename.
   */
  if (isFile(imageEntry)) {
    data.name =
      sanitizeFileName(
        imageEntry.name
      );
  } else {
    data.name =
      `gallery-${Date.now()}`;
  }

  data.order =
    order ?? 0;

  data.active =
    active ?? true;

  return data;
}



      default:

        throw new Error(
          `Unsupported admin resource: ${resource}`
        );

    }

  }



  /* =========================================================
     POST
  ========================================================= */



  export async function POST(
    request: Request,
    context: {
      params: Promise<{
        resource: string;
      }>;
    }
  ) {

    const uploadedDriveFileIds:
      string[] = [];



    try {

      const {
        resource: resourceParam,
      } =
        await context.params;



      const resource =
        getResourceCollection(
          resourceParam
        );



      if (!resource) {

        return NextResponse.json(
          {
            success: false,
            message:
              "Invalid admin resource.",
          },
          {
            status: 404,
          }
        );

      }



      const tableId =
        getAppwriteTableId(
          resource
        );



      if (!tableId) {

        return NextResponse.json(
          {
            success: false,
            message:
              `No Appwrite table configured for ${resource}.`,
          },
          {
            status: 400,
          }
        );

      }



      /* =====================================================
         ADMIN AUTH
      ===================================================== */



      const admin =
        await getAuthenticatedAdminClient();



      if (!admin) {

        return NextResponse.json(
          {
            success: false,
            message:
              "Unauthorized.",
          },
          {
            status: 401,
          }
        );

      }



      /* =====================================================
         FORM DATA
      ===================================================== */



      const formData =
        await request.formData();



      /* =====================================================
         GOOGLE DRIVE FOLDER
      ===================================================== */



      const driveFolderName =
        getDriveFolderName(
          resource,
          formData
        );



      /* =====================================================
         IMAGE UPLOADS
      ===================================================== */



      const imageFiles =
        formData.getAll(
          "images"
        )
          .filter(isFile);



      const singleImage =
        formData.get(
          "image"
        );



      if (
        imageFiles.length ===
        0 &&
        isFile(singleImage)
      ) {

        imageFiles.push(
          singleImage
        );

      }



      const driveImageIds:
        string[] = [];



      if (
        driveFolderName &&
        imageFiles.length >
        0
      ) {

        for (
          const file of imageFiles
        ) {

          const uploaded =
            await uploadFileToDrive(
              file,
              driveFolderName,
              IMAGE_MIME_TYPES,
              MAX_IMAGE_SIZE
            );



          driveImageIds.push(
            uploaded.fileId
          );



          uploadedDriveFileIds.push(
            uploaded.fileId
          );

        }

      }



      /* =====================================================
         VIDEO UPLOAD
      ===================================================== */



      let driveVideoId =
        "";



      const videoFile =
        formData.get(
          "video"
        );



      if (
        driveFolderName &&
        isFile(videoFile)
      ) {

        const uploaded =
          await uploadFileToDrive(
            videoFile,
            driveFolderName,
            VIDEO_MIME_TYPES,
            MAX_VIDEO_SIZE
          );



        driveVideoId =
          uploaded.fileId;



        uploadedDriveFileIds.push(
          uploaded.fileId
        );

      }



      /* =====================================================
         BUILD APPWRITE DATA
      ===================================================== */



      const data =
        await buildAppwriteData(
          resource,
          formData,
          driveImageIds,
          driveVideoId
        );



      /* =====================================================
         CREATE APPWRITE ROW
      ===================================================== */



      const row =
        await tablesDB.createRow({

          databaseId:
            APPWRITE_DATABASE_ID,

          tableId,

          rowId:
            ID.unique(),

          data,

        });



      /* =====================================================
         RESPONSE
      ===================================================== */



      return NextResponse.json(
        {
          success: true,
          data: row,
        },
        {
          status: 201,
        }
      );

    } catch (error) {

      console.error(
        "[Admin API POST] Error:",
        error
      );



      /* =====================================================
         CLEANUP DRIVE FILES
      ===================================================== */



      await deleteDriveFiles(
        uploadedDriveFileIds
      );



      const message =
        error instanceof Error
          ? error.message
          : "Failed to create resource.";



      return NextResponse.json(
        {
          success: false,
          message,
        },
        {
          status: 500,
        }
      );

    }

  }
