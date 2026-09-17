import { NextRequest } from "next/server";

import {
  drive,
  isPublicMediaFile,
} from "@/lib/google-drive";

interface RouteContext {
  params: Promise<{
    fileId: string;
  }>;
}

const ALLOWED_MEDIA_TYPES =
  new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "video/mp4",
    "video/webm",
  ]);

export async function GET(
  _request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { fileId } =
      await params;

    if (!fileId) {
      return new Response(
        "File ID is required",
        {
          status: 400,
        }
      );
    }

    /*
     * Validate Google Drive file ID format.
     */
    if (
      !/^[a-zA-Z0-9_-]+$/.test(
        fileId
      )
    ) {
      return new Response(
        "Invalid file ID",
        {
          status: 400,
        }
      );
    }

    /*
     * Verify that the file belongs
     * to one of the site's public
     * media folders.
     */
    const isAllowed =
      await isPublicMediaFile(
        fileId
      );

    if (!isAllowed) {
      return new Response(
        "Media not found",
        {
          status: 404,
        }
      );
    }

    /*
     * Get file metadata.
     */
    const metadata =
      await drive.files.get({
        fileId,

        fields:
          "id,name,mimeType,size,parents,trashed",
      });

    const file =
      metadata.data;

    if (
      !file.id ||
      file.trashed
    ) {
      return new Response(
        "Media not found",
        {
          status: 404,
        }
      );
    }

    const mimeType =
      file.mimeType ?? "";

    /*
     * Only allow media types
     * used by the website.
     */
    if (
      !ALLOWED_MEDIA_TYPES.has(
        mimeType
      )
    ) {
      return new Response(
        "Unsupported media type",
        {
          status: 403,
        }
      );
    }

    /*
     * Retrieve media from
     * Google Drive.
     */
    const response =
      await drive.files.get(
        {
          fileId,
          alt: "media",
        },
        {
          responseType: "stream",
        }
      );

    const stream =
      response.data;

    return new Response(
      stream as unknown as ReadableStream,
      {
        status: 200,

        headers: {
          "Content-Type":
            mimeType,

          "Cache-Control":
            "public, max-age=31536000, immutable",

          "X-Content-Type-Options":
            "nosniff",

          "Content-Disposition":
            "inline",
        },
      }
    );
  } catch (error) {
    console.error(
      "Google Drive media error:",
      error
    );

    return new Response(
      "Unable to load media",
      {
        status: 404,
      }
    );
  }
}