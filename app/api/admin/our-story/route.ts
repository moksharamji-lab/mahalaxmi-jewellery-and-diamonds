import { NextResponse } from "next/server";
import { ID } from "node-appwrite";
import { z } from "zod";
import { Readable } from "stream";

import {
  getAuthenticatedAdminClient,
} from "@/lib/admin-pocketbase";

import {
  APPWRITE_DATABASE_ID,
  tablesDB,
} from "@/lib/appwrite";

import {
  drive,
  getDriveFolder,
} from "@/lib/google-drive";

/* =========================================================
   LIMITS
========================================================= */

const MAX_IMAGE_SIZE =
  10 * 1024 * 1024;

/* =========================================================
   ALLOWED IMAGE TYPES
========================================================= */

const ALLOWED_IMAGE_TYPES =
  new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
  ]);

/* =========================================================
   VALIDATION
========================================================= */

const updateOurStorySchema =
  z.object({
    title: z
      .string()
      .trim()
      .min(
        1,
        "Our Story title is required."
      ),

    paragraphOne: z
      .string()
      .trim()
      .min(
        1,
        "First paragraph is required."
      ),

    paragraphTwo: z
      .string()
      .trim()
      .min(
        1,
        "Second paragraph is required."
      ),

    buttonText: z
      .string()
      .trim()
      .min(
        1,
        "Button text is required."
      ),

    buttonLink: z
      .string()
      .trim()
      .min(
        1,
        "Button link is required."
      ),

    active: z.boolean(),
  });

/* =========================================================
   FILE EXTENSION
========================================================= */

function getExtension(
  filename: string
): string {
  const parts =
    filename.split(".");

  if (parts.length < 2) {
    return "";
  }

  return (
    parts[
      parts.length - 1
    ] ?? ""
  )
    .toLowerCase()
    .replace(
      /[^a-z0-9]/g,
      ""
    );
}

/* =========================================================
   SANITIZE FILENAME
========================================================= */

function sanitizeFilename(
  filename: string
): string {
  return filename
    .replace(
      /[^a-zA-Z0-9._-]/g,
      "_"
    )
    .slice(0, 150);
}

/* =========================================================
   VALIDATE IMAGE
========================================================= */

async function validateImageFile(
  file: File,
  fieldName: string
): Promise<Buffer> {
  if (
    !file ||
    file.size === 0
  ) {
    throw new Error(
      `${fieldName} is empty.`
    );
  }

  if (
    file.size >
    MAX_IMAGE_SIZE
  ) {
    throw new Error(
      `${fieldName} must be 10MB or smaller.`
    );
  }

  if (
    !ALLOWED_IMAGE_TYPES.has(
      file.type
    )
  ) {
    throw new Error(
      `${fieldName} must be JPG, PNG, WEBP or GIF.`
    );
  }

  const buffer =
    Buffer.from(
      await file.arrayBuffer()
    );

  if (
    buffer.length < 12
  ) {
    throw new Error(
      `${fieldName} is not a valid image.`
    );
  }

  const isJpeg =
    buffer[0] === 0xff &&
    buffer[1] === 0xd8 &&
    buffer[2] === 0xff;

  const isPng =
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a;

  const isWebp =
    buffer.toString(
      "ascii",
      0,
      4
    ) === "RIFF" &&
    buffer.toString(
      "ascii",
      8,
      12
    ) === "WEBP";

  const isGif =
    buffer.toString(
      "ascii",
      0,
      6
    ) === "GIF87a" ||
    buffer.toString(
      "ascii",
      0,
      6
    ) === "GIF89a";

  if (
    !isJpeg &&
    !isPng &&
    !isWebp &&
    !isGif
  ) {
    throw new Error(
      `${fieldName} does not contain a valid image file.`
    );
  }

  return buffer;
}

/* =========================================================
   UPLOAD IMAGE TO GOOGLE DRIVE
========================================================= */

async function uploadImageToDrive(
  file: File,
  fieldName: string
): Promise<string> {
  const buffer =
    await validateImageFile(
      file,
      fieldName
    );

  const folder =
    await getDriveFolder(
      "OurStory"
    );

  if (!folder?.id) {
    throw new Error(
      "Google Drive Our Story folder could not be found."
    );
  }

  const extension =
    getExtension(
      file.name
    ) || "jpg";

  const filename =
    `${Date.now()}-our-story-${fieldName
      .toLowerCase()
      .replace(
        /\s+/g,
        "-"
      )}.${extension}`;

  const safeFilename =
    sanitizeFilename(
      filename
    );

  const uploaded =
    await drive.files.create({
      requestBody: {
        name: safeFilename,

        parents: [
          folder.id,
        ],
      },

      media: {
        mimeType:
          file.type,

        body:
          Readable.from(
            buffer
          ),
      },

      fields:
        "id,name,mimeType,size",
    });

  const fileId =
    uploaded.data.id;

  if (!fileId) {
    throw new Error(
      `Google Drive upload failed for ${fieldName}.`
    );
  }

  return fileId;
}

/* =========================================================
   PUT
========================================================= */

export async function PUT(
  request: Request
) {
  try {
    /* =====================================================
       AUTH
    ===================================================== */

    const admin =
      await getAuthenticatedAdminClient();

    if (!admin) {
      return NextResponse.json(
        {
          message:
            "Unauthorized.",
        },
        {
          status: 401,
        }
      );
    }

    /* =====================================================
       REQUEST DATA
    ===================================================== */

    const contentType =
      request.headers.get(
        "content-type"
      ) ?? "";

    let title = "";
    let paragraphOne = "";
    let paragraphTwo = "";
    let buttonText = "";
    let buttonLink = "";
    let active = true;

    let imageOne:
      | File
      | null = null;

    let imageTwo:
      | File
      | null = null;

    /* =====================================================
       MULTIPART FORM
    ===================================================== */

    if (
      contentType
        .toLowerCase()
        .includes(
          "multipart/form-data"
        )
    ) {
      const formData =
        await request.formData();

      title =
        String(
          formData.get(
            "title"
          ) ?? ""
        );

      paragraphOne =
        String(
          formData.get(
            "paragraphOne"
          ) ?? ""
        );

      paragraphTwo =
        String(
          formData.get(
            "paragraphTwo"
          ) ?? ""
        );

      buttonText =
        String(
          formData.get(
            "buttonText"
          ) ?? ""
        );

      buttonLink =
        String(
          formData.get(
            "buttonLink"
          ) ?? ""
        );

      active =
        String(
          formData.get(
            "active"
          ) ?? "true"
        ) === "true";

      const imageOneValue =
        formData.get(
          "imageOne"
        );

      const imageTwoValue =
        formData.get(
          "imageTwo"
        );

      if (
        imageOneValue instanceof
          File &&
        imageOneValue.size > 0
      ) {
        imageOne =
          imageOneValue;
      }

      if (
        imageTwoValue instanceof
          File &&
        imageTwoValue.size > 0
      ) {
        imageTwo =
          imageTwoValue;
      }
    } else {
      /* ===================================================
         JSON FALLBACK
      =================================================== */

      const body =
        await request
          .json()
          .catch(
            () => null
          );

      title =
        String(
          body?.title ?? ""
        );

      paragraphOne =
        String(
          body?.paragraphOne ??
            ""
        );

      paragraphTwo =
        String(
          body?.paragraphTwo ??
            ""
        );

      buttonText =
        String(
          body?.buttonText ??
            ""
        );

      buttonLink =
        String(
          body?.buttonLink ??
            ""
        );

      active =
        Boolean(
          body?.active
        );
    }

    /* =====================================================
       VALIDATE FORM
    ===================================================== */

    const parsed =
      updateOurStorySchema.safeParse(
        {
          title,
          paragraphOne,
          paragraphTwo,
          buttonText,
          buttonLink,
          active,
        }
      );

    if (!parsed.success) {
      return NextResponse.json(
        {
          message:
            parsed.error
              .issues[0]
              ?.message ??
            "Invalid Our Story information.",
        },
        {
          status: 400,
        }
      );
    }

    /* =====================================================
       GET EXISTING RECORD
    ===================================================== */

    const result =
      await tablesDB.listRows({
        databaseId:
          APPWRITE_DATABASE_ID,

        tableId:
          "ourstory",
      });

    const existingStory =
      result.rows.length >
      0
        ? result.rows[0]
        : null;

    /* =====================================================
       EXISTING DRIVE IMAGE IDS
    ===================================================== */

    let driveImage1 =
      String(
        existingStory?.driveImage1 ??
          ""
      );

    let driveImage2 =
      String(
        existingStory?.driveImage2 ??
          ""
      );

    /* =====================================================
       UPLOAD NEW STORY IMAGE 1
    ===================================================== */

    if (imageOne) {
      driveImage1 =
        await uploadImageToDrive(
          imageOne,
          "Story Image 1"
        );
    }

    /* =====================================================
       UPLOAD NEW STORY IMAGE 2
    ===================================================== */

    if (imageTwo) {
      driveImage2 =
        await uploadImageToDrive(
          imageTwo,
          "Story Image 2"
        );
    }

    /* =====================================================
       CONTENT

       Appwrite does not have:
       paragraphOne
       paragraphTwo
       buttonText
       buttonLink

       Store those four values inside
       the existing `content` field.
    ===================================================== */

    const content =
      JSON.stringify({
        paragraphOne:
          parsed.data
            .paragraphOne,

        paragraphTwo:
          parsed.data
            .paragraphTwo,

        buttonText:
          parsed.data
            .buttonText,

        buttonLink:
          parsed.data
            .buttonLink,
      });

    /* =====================================================
       SORT ORDER
    ===================================================== */

    const existingSortOrder =
      Number(
        existingStory?.sortOrder
      );

    const sortOrder =
      Number.isFinite(
        existingSortOrder
      )
        ? existingSortOrder
        : 1;

    /* =====================================================
       APPWRITE DATA

       IMPORTANT:
       These are ONLY attributes that actually
       exist in your Appwrite OurStory table.
    ===================================================== */

    const data = {
      title:
        parsed.data.title,

      content,

      active:
        parsed.data.active,

      sortOrder,

      driveImage1,

      driveImage2,
    };

    /* =====================================================
       UPDATE EXISTING RECORD
    ===================================================== */

    let updatedStory;

    if (existingStory) {
      updatedStory =
        await tablesDB.updateRow({
          databaseId:
            APPWRITE_DATABASE_ID,

          tableId:
            "ourstory",

          rowId:
            String(
              existingStory.$id
            ),

          data,
        });
    } else {
      /* ===================================================
         CREATE NEW RECORD
      =================================================== */

      updatedStory =
        await tablesDB.createRow({
          databaseId:
            APPWRITE_DATABASE_ID,

          tableId:
            "ourstory",

          rowId:
            ID.unique(),

          data,
        });
    }

    /* =====================================================
       SUCCESS
    ===================================================== */

    return NextResponse.json({
      success: true,

      story: {
        id: String(
          updatedStory.$id
        ),

        title: String(
          updatedStory.title ??
            ""
        ),

        active:
          Boolean(
            updatedStory.active
          ),

        sortOrder:
          Number(
            updatedStory.sortOrder ??
              1
          ),

        driveImage1:
          String(
            updatedStory.driveImage1 ??
              ""
          ),

        driveImage2:
          String(
            updatedStory.driveImage2 ??
              ""
          ),
      },
    });
  } catch (error) {
    console.error(
      "Failed to update Our Story:",
      error
    );

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Unable to update Our Story. Please try again.",
      },
      {
        status: 500,
      }
    );
  }
}
