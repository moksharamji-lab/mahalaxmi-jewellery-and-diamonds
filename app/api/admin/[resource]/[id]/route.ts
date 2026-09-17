import { NextResponse } from "next/server";
import { Readable } from "stream";
import { Query } from "node-appwrite";

import {
  ADMIN_AUTH_COOKIE,
  ADMIN_AUTH_COOKIE_OPTIONS,
} from "@/lib/auth-config";

import {
  getAuthenticatedAdminClient,
} from "@/lib/admin-pocketbase";

import {
  getAdminResource,
} from "@/lib/admin-resources";

import {
  APPWRITE_DATABASE_ID,
  tablesDB,
} from "@/lib/appwrite";

import {
  drive,
  getDriveFolder,
} from "@/lib/google-drive";

type Props = {
  params: Promise<{
    resource: string;
    id: string;
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
    "Admin mutation error:",
    error
  );

  return NextResponse.json(
    {
      message:
        "Unable to complete this request.",
    },
    {
      status: 400,
    }
  );
}

/* =========================================================
   APPWRITE TABLE
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
  collection: string,
  formData: FormData
) {
  if (collection === "Products") {
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
      collectionValue.includes(
        "diamond"
      )
    ) {
      return "Diamonds";
    }

    return "Gold";
  }

  if (
    collection === "HeroSliders"
  ) {
    return "Hero";
  }

  if (
    collection === "Categories"
  ) {
    return "Categories";
  }

  if (
    collection === "Collections"
  ) {
    return "Categories";
  }

  return null;
}

/* =========================================================
   UPLOAD SECURITY
========================================================= */

const IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const VIDEO_MIME_TYPES = [
  "video/mp4",
  "video/webm",
];

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
  allowedMimeTypes: string[],
  maxSizeBytes: number
) {
  if (!(file instanceof File)) {
    throw new Error(
      "Invalid upload."
    );
  }

  if (file.size <= 0) {
    throw new Error(
      "The uploaded file is empty."
    );
  }

  if (
    file.size >
    maxSizeBytes
  ) {
    const maxSizeMB =
      maxSizeBytes /
      (1024 * 1024);

    throw new Error(
      `File "${file.name}" is too large. Maximum allowed size is ${maxSizeMB} MB.`
    );
  }

  if (
    !allowedMimeTypes.includes(
      file.type
    )
  ) {
    throw new Error(
      `File "${file.name}" has an unsupported file type.`
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
        parents: [
          folder.id,
        ],
      },

      media: {
        mimeType:
          file.type,

        body: Readable.from(
          buffer
        ),
      },

      fields:
        "id,name,mimeType,size",
    });

  if (
    !uploadedFile.data.id
  ) {
    throw new Error(
      `Google Drive did not return a file ID for "${file.name}".`
    );
  }

  return {
    id:
      uploadedFile.data.id,

    name:
      uploadedFile.data.name ??
      file.name,
  };
}

/* =========================================================
   FORM HELPERS
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

  if (
    value instanceof File
  ) {
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

  if (
    value === undefined
  ) {
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
   COLLECTION ID
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

  const result =
    await tablesDB.listRows({
      databaseId:
        APPWRITE_DATABASE_ID,

      tableId:
        "collections",

      queries: [
        Query.limit(100),
      ],
    });

  const direct =
    result.rows.find(
      (row) =>
        String(row.$id) ===
        raw
    );

  if (direct) {
    return String(
      direct.$id
    );
  }

  const byName =
    result.rows.find(
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

  return byName
    ? String(
        byName.$id
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
  const data: Record<
    string,
    unknown
  > = {};

  switch (resource) {
    /* =====================================================
       CATEGORIES
    ===================================================== */

    case "Categories": {
      const fields = [
        "name",
        "slug",
        "collection",
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
        data.active =
          active;
      }

      if (
        driveImageIds.length >
        0
      ) {
        data.driveImage =
          driveImageIds[0];
      }

      break;
    }

    /* =====================================================
       COLLECTIONS
    ===================================================== */

    case "Collections": {
      const fields = [
        "name",
        "slug",
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
        data.active =
          active;
      }

      if (
        driveImageIds.length >
        0
      ) {
        data.driveImage =
          driveImageIds[0];
      }

      break;
    }

    /* =====================================================
       STORES
    ===================================================== */

    case "Stores": {
      const storeType =
        formValue(
          formData,
          "storeType"
        ) ??
        formValue(
          formData,
          "collection"
        );

      const fields = [
        "name",
        "address",
        "phone",
        "whatsapp",
        "googleMapsUrl",
        "email",
        "description",
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

      if (
        storeType !==
        undefined
      ) {
        data.storeType =
          storeType;
      }

      const active =
        booleanValue(
          formData,
          "active"
        );

      if (
        active !== undefined
      ) {
        data.active =
          active;
      }

      if (
        driveImageIds.length >
        0
      ) {
        data.driveLogo =
          driveImageIds[0];
      }

      break;
    }

    /* =====================================================
       RATES
    ===================================================== */

    case "Rates": {
      const fields = [
        "collection",
        "purity",
        "unit",
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

      const rate =
        numberValue(
          formData,
          "rate"
        );

      if (
        rate !== undefined
      ) {
        data.rate = rate;
      }

      const active =
        booleanValue(
          formData,
          "active"
        );

      if (
        active !== undefined
      ) {
        data.active =
          active;
      }

      break;
    }

    /* =====================================================
       HERO SLIDERS
    ===================================================== */

    case "HeroSliders": {
      const fields = [
        "title",
        "subtitle",
        "buttonText",
        "buttonLink",
        "page",
        "mediaType",
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
        data.active =
          active;
      }

      const order =
        numberValue(
          formData,
          "order"
        );

      if (
        order !== undefined
      ) {
        data.order =
          order;
      }

      if (
        driveImageIds.length >
        0
      ) {
        data.driveImage =
          driveImageIds[0];
      }

      if (
        driveVideoId
      ) {
        data.driveVideo =
          driveVideoId;
      }

      break;
    }

    /* =====================================================
       PRODUCTS
    ===================================================== */

    case "Products": {
      const fields = [
        "name",
        "slug",
        "purity",
        "description",
        "hyd",
        "hallmark",
        "igi",
        "sgl",
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

      const categoryId =
        formValue(
          formData,
          "categoryId"
        ) ??
        formValue(
          formData,
          "category"
        );

      if (
        categoryId !==
        undefined
      ) {
        data.categoryId =
          categoryId;
      }

      const collectionId =
        await resolveCollectionId(
          formData
        );

      if (
        collectionId !==
        undefined
      ) {
        data.collectionId =
          collectionId;
      }

      const weight =
        numberValue(
          formData,
          "weight"
        );

      if (
        weight !== undefined
      ) {
        data.weight =
          weight;
      }

      const makingCharges =
        numberValue(
          formData,
          "makingCharges"
        );

      if (
        makingCharges !==
        undefined
      ) {
        data.makingCharges =
          makingCharges;
      }

      const featured =
        booleanValue(
          formData,
          "featured"
        );

      if (
        featured !== undefined
      ) {
        data.featured =
          featured;
      }

      const active =
        booleanValue(
          formData,
          "active"
        );

      if (
        active !== undefined
      ) {
        data.active =
          active;
      }

      if (
        driveImageIds.length >
        0
      ) {
        data.driveImages =
          driveImageIds;
      }

      if (
        driveVideoId
      ) {
        data.driveVideo =
          driveVideoId;
      }

      break;
    }

    /* =====================================================
       OUR STORY
    ===================================================== */

    case "OurStory": {
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
        data.active =
          active;
      }

      break;
    }

    /* =====================================================
       ENQUIRIES
    ===================================================== */

    case "Enquiries": {
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

      break;
    }

    default:
      throw new Error(
        `Appwrite migration for "${resource}" is not configured yet.`
      );
  }

  return data;
}

/* =========================================================
   PATCH
========================================================= */

export async function PATCH(
  request: Request,
  { params }: Props
) {
  const {
    resource,
    id,
  } = await params;

  const collection =
    getAdminResource(
      resource
    );

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

  const adminClient =
    await getAuthenticatedAdminClient();

  if (!adminClient) {
    return unauthorizedResponse();
  }

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

    if (
      driveFolderName
    ) {
      const imageFiles =
        originalFormData.getAll(
          "images"
        );

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
      }

      const videoItem =
        originalFormData.get(
          "video"
        );

      if (
        videoItem instanceof
          File &&
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
      await tablesDB.updateRow({
        databaseId:
          APPWRITE_DATABASE_ID,

        tableId,

        rowId: id,

        data,
      });

    const response =
      NextResponse.json(
        record
      );

    response.cookies.set(
      ADMIN_AUTH_COOKIE,
      adminClient.refreshedToken,
      ADMIN_AUTH_COOKIE_OPTIONS
    );

    return response;
  } catch (error) {
    return errorResponse(
      error
    );
  }
}

/* =========================================================
   DELETE
========================================================= */

export async function DELETE(
  _request: Request,
  { params }: Props
) {
  const {
    resource,
    id,
  } = await params;

  const collection =
    getAdminResource(
      resource
    );

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

  const adminClient =
    await getAuthenticatedAdminClient();

  if (!adminClient) {
    return unauthorizedResponse();
  }

  try {
    await tablesDB.deleteRow({
      databaseId:
        APPWRITE_DATABASE_ID,

      tableId,

      rowId: id,
    });

    const response =
      new NextResponse(
        null,
        {
          status: 204,
        }
      );

    response.cookies.set(
      ADMIN_AUTH_COOKIE,
      adminClient.refreshedToken,
      ADMIN_AUTH_COOKIE_OPTIONS
    );

    return response;
  } catch (error) {
    return errorResponse(
      error
    );
  }
}