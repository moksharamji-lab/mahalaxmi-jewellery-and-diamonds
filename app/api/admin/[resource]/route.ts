import { NextResponse } from "next/server";
import { Readable } from "stream";
import { ID, Query } from "node-appwrite";

import {
  ADMIN_AUTH_COOKIE,
  ADMIN_AUTH_COOKIE_OPTIONS,
} from "@/lib/auth-config";

import { getAuthenticatedAdminClient } from "@/lib/admin-pocketbase";

import { getAdminResource } from "@/lib/admin-resources";

import {
  APPWRITE_DATABASE_ID,
  tablesDB,
} from "@/lib/appwrite";

import {
  drive,
  getDriveFolder,
  deleteDriveFiles,
} from "@/lib/google-drive";

import {
  detectSupportedMimeType,
} from "@/lib/file-signature";

type Props = {
  params: Promise<{
    resource: string;
  }>;
};

/* =========================================================
   RESPONSE HELPERS
========================================================= */

function unauthorizedResponse() {
  return NextResponse.json(
    {
      message: "Unauthorized.",
    },
    {
      status: 401,
    }
  );
}

function errorResponse(error: unknown) {
  console.error(
    "Admin create error:",
    error
  );

  return NextResponse.json(
    {
      message:
        "Unable to save this record.",
    },
    {
      status: 400,
    }
  );
}

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

    case "Enquiries":
      return "enquiries";

    default:
      return null;
  }
}

/* =========================================================
   GOOGLE DRIVE FOLDER
========================================================= */

function getDriveFolderName(
  resource: string,
  formData: FormData
): string | null {
  if (resource === "Products") {
    const collectionValue =
      String(
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

  return null;
}

/* =========================================================
   GOOGLE DRIVE UPLOAD SECURITY
========================================================= */

const IMAGE_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const VIDEO_MIME_TYPES = new Set([
  "video/mp4",
  "video/webm",
]);

const MAX_IMAGE_SIZE =
  10 * 1024 * 1024;

const MAX_VIDEO_SIZE =
  100 * 1024 * 1024;

/* =========================================================
   GOOGLE DRIVE UPLOAD
========================================================= */

async function uploadFileToDrive(
  file: File,
  folderName: string,
  allowedMimeTypes: Set<string>,
  maxSizeBytes: number
) {
  if (!(file instanceof File)) {
    throw new Error(
      "Invalid upload."
    );
  }

  if (file.size <= 0) {
    throw new Error(
      "Uploaded file is empty."
    );
  }

  if (file.size > maxSizeBytes) {
    throw new Error(
      "Uploaded file exceeds the allowed size."
    );
  }

  /*
   * IMPORTANT:
   *
   * Do not trust file.type.
   *
   * file.type is supplied by the client/browser.
   *
   * We inspect the actual file signature instead.
   */
  const detectedMimeType =
    await detectSupportedMimeType(
      file
    );

  if (
    !detectedMimeType ||
    !allowedMimeTypes.has(
      detectedMimeType
    )
  ) {
    throw new Error(
      "Unsupported file type."
    );
  }

  const folder =
    await getDriveFolder(
      folderName
    );

  if (!folder?.id) {
    throw new Error(
      `Google Drive folder "${folderName}" was not found.`
    );
  }

  const buffer =
    Buffer.from(
      await file.arrayBuffer()
    );

  const uploadedFile =
    await drive.files.create({
      requestBody: {
        name: file.name,
        parents: [folder.id],
      },

      media: {
        mimeType:
          detectedMimeType,

        body:
          Readable.from(buffer),
      },

      fields:
        "id,name,mimeType,size",
    });

  if (!uploadedFile.data.id) {
    throw new Error(
      "Google Drive did not return a file ID."
    );
  }

  return {
    id:
      uploadedFile.data.id,

    name:
      uploadedFile.data.name ??
      file.name,

    mimeType:
      uploadedFile.data.mimeType ??
      detectedMimeType,
  };
}

/* =========================================================
   FORM DATA HELPERS
========================================================= */

function formValue(
  formData: FormData,
  key: string
) {
  const value =
    formData.get(key);

  if (value === null) {
    return undefined;
  }

  if (value instanceof File) {
    return undefined;
  }

  return String(value);
}

function booleanValue(
  formData: FormData,
  key: string
) {
  const value =
    formValue(
      formData,
      key
    );

  if (value === undefined) {
    return undefined;
  }

  return (
    value === "true" ||
    value === "1" ||
    value === "on"
  );
}

function numberValue(
  formData: FormData,
  key: string
) {
  const value =
    formValue(
      formData,
      key
    );

  if (
    value === undefined ||
    value === ""
  ) {
    return undefined;
  }

  const number =
    Number(value);

  return Number.isNaN(number)
    ? undefined
    : number;
}

/* =========================================================
   RESOLVE COLLECTION ID
========================================================= */

async function resolveCollectionId(
  formData: FormData
) {
  const raw =
    formValue(
      formData,
      "collectionId"
    ) ??
    formValue(
      formData,
      "collection"
    );

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
        String(row.$id) ===
        raw
    );

  if (directMatch) {
    return String(
      directMatch.$id
    );
  }

  const nameMatch =
    collections.rows.find(
      (row) =>
        String(
          row.name ?? ""
        )
          .trim()
          .toLowerCase() ===
        raw
          .trim()
          .toLowerCase()
    );

  return nameMatch
    ? String(
        nameMatch.$id
      )
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

      const active =
        booleanValue(
          formData,
          "active"
        );

      if (
        name !== undefined
      ) {
        data.name = name;
      }

      if (
        slug !== undefined
      ) {
        data.slug = slug;
      }

      if (
        categoryCollection !==
        undefined
      ) {
        data.collection =
          categoryCollection;
      }

      if (
        active !== undefined
      ) {
        data.active = active;
      }

      /*
       * sortOrder is required by
       * the Appwrite categories table.
       */
      data.sortOrder = 0;

      if (
        driveImageIds.length >
        0
      ) {
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

      const active =
        booleanValue(
          formData,
          "active"
        );

      if (
        name !== undefined
      ) {
        data.name = name;
      }

      if (
        slug !== undefined
      ) {
        data.slug = slug;
      }

      if (
        active !== undefined
      ) {
        data.active = active;
      }

      if (
        driveImageIds.length >
        0
      ) {
        data.driveImage =
          driveImageIds[0];
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

      const storeType =
        formValue(
          formData,
          "storeType"
        ) ??
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

      if (
        name !== undefined
      ) {
        data.name = name;
      }

      if (
        storeType !== undefined
      ) {
        data.storeType =
          storeType;
      }

      if (
        address !== undefined
      ) {
        data.address =
          address;
      }

      if (
        phone !== undefined
      ) {
        data.phone =
          phone;
      }

      if (
        whatsapp !== undefined
      ) {
        data.whatsapp =
          whatsapp;
      }

      if (
        googleMapsUrl !==
        undefined
      ) {
        data.googleMapsUrl =
          googleMapsUrl;
      }

      if (
        email !== undefined
      ) {
        data.email = email;
      }

      if (
        description !==
        undefined
      ) {
        data.description =
          description;
      }

      if (
        active !== undefined
      ) {
        data.active = active;
      }

      if (
        driveImageIds.length >
        0
      ) {
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

      const collection =
        formValue(
          formData,
          "collection"
        );

      const purity =
        formValue(
          formData,
          "purity"
        );

      const unit =
        formValue(
          formData,
          "unit"
        );

      const rate =
        numberValue(
          formData,
          "rate"
        );

      const active =
        booleanValue(
          formData,
          "active"
        );

      if (
        collection !==
        undefined
      ) {
        data.collection =
          collection;
      }

      if (
        purity !== undefined
      ) {
        data.purity =
          purity;
      }

      if (
        rate !== undefined
      ) {
        data.rate = rate;
      }

      if (
        unit !== undefined
      ) {
        data.unit = unit;
      }

      if (
        active !== undefined
      ) {
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

      const mediaType =
        formValue(
          formData,
          "mediaType"
        );

      const active =
        booleanValue(
          formData,
          "active"
        );

      const order =
        numberValue(
          formData,
          "order"
        );

      if (
        title !== undefined
      ) {
        data.title = title;
      }

      if (
        subtitle !== undefined
      ) {
        data.subtitle =
          subtitle;
      }

      if (
        buttonText !== undefined
      ) {
        data.buttonText =
          buttonText;
      }

      if (
        buttonLink !== undefined
      ) {
        data.buttonLink =
          buttonLink;
      }

      if (
        page !== undefined
      ) {
        data.page = page;
      }

      if (
        mediaType !== undefined
      ) {
        data.mediaType =
          mediaType;
      }

      if (
        active !== undefined
      ) {
        data.active =
          active;
      }

      if (
        order !== undefined
      ) {
        data.order = order;
      }

      if (
        driveImageIds.length >
        0
      ) {
        data.driveImage =
          driveImageIds[0];
      }

      if (driveVideoId) {
        data.driveVideo =
          driveVideoId;
      }

      return data;
    }

    /* =====================================================
       PRODUCTS
    ===================================================== */

    case "Products": {
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

      const categoryId =
        formValue(
          formData,
          "categoryId"
        ) ??
        formValue(
          formData,
          "category"
        );

      const collectionId =
        await resolveCollectionId(
          formData
        );

      const purity =
        formValue(
          formData,
          "purity"
        );

      const description =
        formValue(
          formData,
          "description"
        );

      const hyd =
        formValue(
          formData,
          "hyd"
        );

      const hallmark =
        formValue(
          formData,
          "hallmark"
        );

      const igi =
        formValue(
          formData,
          "igi"
        );

      const sgl =
        formValue(
          formData,
          "sgl"
        );

      const weight =
        numberValue(
          formData,
          "weight"
        );

      const makingCharges =
        numberValue(
          formData,
          "makingCharges"
        );

      const featured =
        booleanValue(
          formData,
          "featured"
        );

      const active =
        booleanValue(
          formData,
          "active"
        );

      if (
        name !== undefined
      ) {
        data.name = name;
      }

      if (
        slug !== undefined
      ) {
        data.slug = slug;
      }

      if (
        categoryId !== undefined
      ) {
        data.categoryId =
          categoryId;
      }

      if (
        collectionId !== undefined
      ) {
        data.collectionId =
          collectionId;
      }

      if (
        purity !== undefined
      ) {
        data.purity = purity;
      }

      if (
        description !== undefined
      ) {
        data.description =
          description;
      }

      if (
        hyd !== undefined
      ) {
        data.hyd = hyd;
      }

      if (
        hallmark !== undefined
      ) {
        data.hallmark =
          hallmark;
      }

      if (
        igi !== undefined
      ) {
        data.igi = igi;
      }

      if (
        sgl !== undefined
      ) {
        data.sgl = sgl;
      }

      /*
       * Keep these legacy database
       * fields for compatibility.
       */
      if (
        weight !== undefined
      ) {
        data.weight = weight;
      }

      if (
        makingCharges !==
        undefined
      ) {
        data.makingCharges =
          makingCharges;
      }

      if (
        featured !== undefined
      ) {
        data.featured =
          featured;
      }

      if (
        active !== undefined
      ) {
        data.active = active;
      }

      if (
        driveImageIds.length >
        0
      ) {
        data.driveImages =
          driveImageIds;
      }

      if (driveVideoId) {
        data.driveVideo =
          driveVideoId;
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

      const fields = [
        "title",
        "paragraphOne",
        "paragraphTwo",
        "buttonText",
        "buttonLink",
      ];

      for (
        const field of fields
      ) {
        const value =
          formValue(
            formData,
            field
          );

        if (
          value !== undefined
        ) {
          data[field] =
            value;
        }
      }

      const active =
        booleanValue(
          formData,
          "active"
        );

      if (
        active !== undefined
      ) {
        data.active = active;
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

      const fields = [
        "name",
        "phone",
        "email",
        "product",
        "productSlug",
        "collection",
        "message",
        "status",
      ];

      for (
        const field of fields
      ) {
        const value =
          formValue(
            formData,
            field
          );

        if (
          value !== undefined
        ) {
          data[field] =
            value;
        }
      }

      return data;
    }

    default:
      throw new Error(
        `Appwrite migration for "${resource}" is not configured yet.`
      );
  }
}

/* =========================================================
   CREATE
========================================================= */

export async function POST(
  request: Request,
  { params }: Props
) {
  const { resource } =
    await params;

  const collection =
    getAdminResource(resource);

  if (!collection) {
    return NextResponse.json(
      {
        message:
          "Unknown resource.",
      },
      {
        status: 404,
      }
    );
  }

  const tableId =
    getAppwriteTableId(
      collection
    );

  if (!tableId) {
    return NextResponse.json(
      {
        message:
          `Resource "${collection}" is not migrated to Appwrite yet.`,
      },
      {
        status: 400,
      }
    );
  }

  /*
   * AUTHENTICATE BEFORE
   * processing uploads.
   */
  const adminClient =
    await getAuthenticatedAdminClient();

  if (!adminClient) {
    return unauthorizedResponse();
  }

  const uploadedDriveFileIds: string[] = [];

  try {
    const originalFormData =
      await request.formData();

    /* =====================================================
       GOOGLE DRIVE
    ===================================================== */

    const driveFolderName =
      getDriveFolderName(
        collection,
        originalFormData
      );

    const driveImageIds: string[] =
      [];

    let driveVideoId =
      "";

    if (driveFolderName) {
      /*
       * Accept both:
       *
       * images
       * image
       */

      const imageFiles = [
        ...originalFormData.getAll(
          "images"
        ),

        ...originalFormData.getAll(
          "image"
        ),
      ];

      for (
        const item of imageFiles
      ) {
        if (
          !(item instanceof File)
        ) {
          continue;
        }

        if (
          item.size === 0
        ) {
          continue;
        }

        const uploaded =
          await uploadFileToDrive(
            item,
            driveFolderName,
            IMAGE_MIME_TYPES,
            MAX_IMAGE_SIZE
          );

        driveImageIds.push(
          uploaded.id
        );

        uploadedDriveFileIds.push(
          uploaded.id
        );
      }

      const videoItem =
        originalFormData.get(
          "video"
        );

      if (
        videoItem instanceof File &&
        videoItem.size > 0
      ) {
        const uploaded =
          await uploadFileToDrive(
            videoItem,
            driveFolderName,
            VIDEO_MIME_TYPES,
            MAX_VIDEO_SIZE
          );

        driveVideoId =
          uploaded.id;

        uploadedDriveFileIds.push(
          uploaded.id
        );
      }
    }

    /* =====================================================
       APPWRITE DATA
    ===================================================== */

    const data =
      await buildAppwriteData(
        collection,
        originalFormData,
        driveImageIds,
        driveVideoId
      );

    const record =
      await tablesDB.createRow({
        databaseId:
          APPWRITE_DATABASE_ID,

        tableId,

        rowId:
          ID.unique(),

        data,
      });

    const response =
      NextResponse.json(
        record,
        {
          status: 201,
        }
      );

    response.cookies.set(
      ADMIN_AUTH_COOKIE,
      adminClient.refreshedToken,
      ADMIN_AUTH_COOKIE_OPTIONS
    );

    return response;
  } catch (error) {
    await deleteDriveFiles(
      uploadedDriveFileIds
    );

    return errorResponse(
      error
    );
  }
}