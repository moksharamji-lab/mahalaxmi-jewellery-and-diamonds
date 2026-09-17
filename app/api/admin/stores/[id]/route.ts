import { NextResponse } from "next/server";
import { Readable } from "stream";
import { z } from "zod";

import { getAuthenticatedAdminClient } from "@/lib/admin-pocketbase";

import {
  APPWRITE_DATABASE_ID,
  tablesDB,
} from "@/lib/appwrite";

import {
  drive,
  getDriveFolder,
  deleteDriveFiles,
} from "@/lib/google-drive";

/* =========================================================
   VALIDATION
========================================================= */

const updateStoreSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Store name is required.")
    .max(150, "Store name is too long."),

  address: z
    .string()
    .trim()
    .max(1000, "Address is too long."),

  phone: z
    .string()
    .trim()
    .max(30, "Phone number is too long."),

  whatsapp: z
    .string()
    .trim()
    .max(30, "WhatsApp number is too long."),

  whatsappUrl: z
    .string()
    .trim()
    .refine(
      (value) =>
        value === "" ||
        /^https?:\/\/.+/i.test(value),
      "Enter a valid WhatsApp URL."
    )
    .max(500, "WhatsApp URL is too long."),

  googleMapsUrl: z
    .string()
    .trim()
    .refine(
      (value) =>
        value === "" ||
        /^https?:\/\/.+/i.test(value),
      "Enter a valid Google Maps URL."
    )
    .max(1000, "Google Maps URL is too long."),

  description: z
    .string()
    .trim()
    .max(2000, "Description is too long."),

  active: z.boolean(),
});

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

/* =========================================================
   LOGO UPLOAD SECURITY
========================================================= */

const ALLOWED_LOGO_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const MAX_LOGO_SIZE = 10 * 1024 * 1024;

/* =========================================================
   GOOGLE DRIVE LOGO UPLOAD
========================================================= */

async function uploadLogoToDrive(file: File) {
  if (!(file instanceof File)) {
    throw new Error("Invalid logo upload.");
  }

  if (file.size <= 0) {
    throw new Error("Uploaded logo is empty.");
  }

  if (file.size > MAX_LOGO_SIZE) {
    throw new Error(
      "Uploaded logo exceeds the allowed size."
    );
  }

  if (!ALLOWED_LOGO_MIME_TYPES.has(file.type)) {
    throw new Error("Unsupported logo file type.");
  }

  const folder = await getDriveFolder("Categories");

  if (!folder?.id) {
    throw new Error(
      'Google Drive folder "Categories" was not found.'
    );
  }

  const buffer = Buffer.from(
    await file.arrayBuffer()
  );

  const uploadedFile = await drive.files.create({
    requestBody: {
      name: file.name,
      parents: [folder.id],
    },

    media: {
      mimeType: file.type,
      body: Readable.from(buffer),
    },

    fields: "id,name,mimeType,size",
  });

  if (!uploadedFile.data.id) {
    throw new Error(
      "Google Drive did not return a file ID."
    );
  }

  return {
    id: uploadedFile.data.id,
    name:
      uploadedFile.data.name ??
      file.name,
  };
}

/* =========================================================
   FORM DATA HELPERS
========================================================= */

function formValue(
  formData: FormData,
  key: string
): string {
  const value = formData.get(key);

  if (value === null) {
    return "";
  }

  if (value instanceof File) {
    return "";
  }

  return String(value);
}

function booleanValue(
  formData: FormData,
  key: string
): boolean {
  const value = formValue(
    formData,
    key
  );

  return (
    value === "true" ||
    value === "1" ||
    value === "on"
  );
}

/* =========================================================
   UPDATE STORE
========================================================= */

export async function PUT(
  request: Request,
  context: RouteContext
) {
  /*
   * Track only files uploaded during this request.
   * If a later database operation fails, these files
   * can safely be deleted without touching existing media.
   */
  const uploadedDriveFileIds: string[] = [];

  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        {
          message: "Store ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * Authenticate before processing uploaded files
     * or modifying Appwrite data.
     */
    const admin =
      await getAuthenticatedAdminClient();

    if (!admin) {
      return NextResponse.json(
        {
          message: "Unauthorized.",
        },
        {
          status: 401,
        }
      );
    }

    const formData =
      await request.formData();

    /* =====================================================
       LOGO
    ===================================================== */

    const logoItem =
      formData.get("logo");

    let driveLogoId = "";

    if (
      logoItem instanceof File &&
      logoItem.size > 0
    ) {
      const uploaded =
        await uploadLogoToDrive(
          logoItem
        );

      driveLogoId = uploaded.id;

      uploadedDriveFileIds.push(
        uploaded.id
      );
    }

    /* =====================================================
       VALIDATE STORE DATA
    ===================================================== */

    const parsed =
      updateStoreSchema.safeParse({
        name: formValue(
          formData,
          "name"
        ),

        address: formValue(
          formData,
          "address"
        ),

        phone: formValue(
          formData,
          "phone"
        ),

        whatsapp: formValue(
          formData,
          "whatsapp"
        ),

        whatsappUrl:
          formValue(
            formData,
            "whatsappUrl"
          ),

        googleMapsUrl:
          formValue(
            formData,
            "googleMapsUrl"
          ),

        description:
          formValue(
            formData,
            "description"
          ),

        active:
          booleanValue(
            formData,
            "active"
          ),
      });

    if (!parsed.success) {
      await deleteDriveFiles(
        uploadedDriveFileIds
      );

      return NextResponse.json(
        {
          message:
            parsed.error
              .issues[0]
              ?.message ??
            "Invalid store information.",
        },
        {
          status: 400,
        }
      );
    }

    /* =====================================================
       APPWRITE DATA
    ===================================================== */

    const data: Record<
      string,
      unknown
    > = {
      name:
        parsed.data.name,

      address:
        parsed.data.address,

      phone:
        parsed.data.phone,

      whatsapp:
        parsed.data.whatsapp,

      whatsappUrl:
        parsed.data.whatsappUrl,

      googleMapsUrl:
        parsed.data.googleMapsUrl,

      description:
        parsed.data.description,

      active:
        parsed.data.active,
    };

    if (driveLogoId) {
      data.driveLogo =
        driveLogoId;
    }

    /* =====================================================
       UPDATE APPWRITE
    ===================================================== */

    const updatedStore =
      await tablesDB.updateRow({
        databaseId:
          APPWRITE_DATABASE_ID,

        tableId:
          "stores",

        rowId:
          id,

        data,
      });

    /* =====================================================
       RESPONSE
    ===================================================== */

    return NextResponse.json({
      success: true,

      store: {
        id: String(
          updatedStore.$id
        ),

        name: String(
          updatedStore.name ??
            ""
        ),

        collection:
          String(
            updatedStore.storeType ??
              ""
          ),

        active:
          Boolean(
            updatedStore.active
          ),

        driveLogo:
          String(
            updatedStore.driveLogo ??
              ""
          ),

        whatsappUrl:
          String(
            updatedStore.whatsappUrl ??
              ""
          ),
      },
    });
  } catch (error) {
    /*
     * If Drive upload succeeded but a later operation failed,
     * remove only the files created by this request.
     *
     * Existing store logos are never deleted here.
     */
    await deleteDriveFiles(
      uploadedDriveFileIds
    );

    console.error(
      "Failed to update store:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Unable to update the store. Please try again.",
      },
      {
        status: 500,
      }
    );
  }
}