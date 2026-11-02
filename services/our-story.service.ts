import {
  APPWRITE_DATABASE_ID,
  tablesDB,
} from "@/lib/appwrite";

import { Query } from "node-appwrite";

import type { OurStory } from "@/types/our-story";

/* =========================================================
   CONTENT STRUCTURE
========================================================= */

type OurStoryContent = {
  paragraphOne?: string;
  paragraphTwo?: string;
  buttonText?: string;
  buttonLink?: string;
};

/* =========================================================
   IMAGE URL
========================================================= */

function getImageUrl(
  driveFileId: string
): string {
  if (!driveFileId) {
    return "";
  }

  return `/api/media/${encodeURIComponent(
    driveFileId
  )}`;
}

/* =========================================================
   PARSE CONTENT
========================================================= */

function parseContent(
  content: unknown
): OurStoryContent {
  if (
    typeof content !== "string" ||
    !content.trim()
  ) {
    return {};
  }

  /*
   * New format:
   *
   * {
   *   paragraphOne: "...",
   *   paragraphTwo: "...",
   *   buttonText: "...",
   *   buttonLink: "..."
   * }
   */

  try {
    const parsed = JSON.parse(
      content
    );

    if (
      parsed &&
      typeof parsed === "object"
    ) {
      return {
        paragraphOne:
          typeof parsed.paragraphOne ===
          "string"
            ? parsed.paragraphOne
            : "",

        paragraphTwo:
          typeof parsed.paragraphTwo ===
          "string"
            ? parsed.paragraphTwo
            : "",

        buttonText:
          typeof parsed.buttonText ===
          "string"
            ? parsed.buttonText
            : "",

        buttonLink:
          typeof parsed.buttonLink ===
          "string"
            ? parsed.buttonLink
            : "",
      };
    }
  } catch {
    /*
     * Older records may have plain text
     * inside the content field.
     *
     * Keep that content as paragraph one
     * so existing data is not lost.
     */
  }

  return {
    paragraphOne: content,
    paragraphTwo: "",
    buttonText:
      "Explore Our Collections",
    buttonLink: "/gold",
  };
}

/* =========================================================
   MAP APPWRITE RECORD
========================================================= */

function mapOurStory(
  record: Record<string, unknown>
): OurStory {
  const content =
    parseContent(
      record.content
    );

  const driveImage1 =
    String(
      record.driveImage1 ?? ""
    );

  const driveImage2 =
    String(
      record.driveImage2 ?? ""
    );

  return {
    id: String(
      record.$id ?? ""
    ),

    title: String(
      record.title ?? ""
    ),

    paragraphOne:
      content.paragraphOne ?? "",

    paragraphTwo:
      content.paragraphTwo ?? "",

    buttonText:
      content.buttonText ??
      "Explore Our Collections",

    buttonLink:
      content.buttonLink ??
      "/gold",

    active:
      Boolean(
        record.active
      ),

    sortOrder:
      Number(
        record.sortOrder ?? 1
      ),

    driveImage1,

    driveImage2,

    imageUrlOne:
      getImageUrl(
        driveImage1
      ),

    imageUrlTwo:
      getImageUrl(
        driveImage2
      ),
  };
}

/* =========================================================
   PUBLIC
========================================================= */

export async function getOurStory(): Promise<
  OurStory | null
> {
  try {
    const result =
      await tablesDB.listRows({
        databaseId:
          APPWRITE_DATABASE_ID,

        tableId:
          "ourstory",

        queries: [
          Query.equal(
            "active",
            true
          ),

          Query.orderAsc(
            "sortOrder"
          ),

          Query.limit(1),
        ],
      });

    const record =
      result.rows[0];

    if (!record) {
      return null;
    }

    return mapOurStory(
      record as unknown as Record<
        string,
        unknown
      >
    );
  } catch (error) {
    console.error(
      "Failed to load Our Story:",
      error
    );

    return null;
  }
}

/* =========================================================
   ADMIN
========================================================= */

export async function getOurStoryForAdmin(): Promise<
  OurStory | null
> {
  try {
    const result =
      await tablesDB.listRows({
        databaseId:
          APPWRITE_DATABASE_ID,

        tableId:
          "ourstory",

        queries: [
          Query.orderAsc(
            "sortOrder"
          ),

          Query.limit(1),
        ],
      });

    const record =
      result.rows[0];

    if (!record) {
      return null;
    }

    return mapOurStory(
      record as unknown as Record<
        string,
        unknown
      >
    );
  } catch (error) {
    console.error(
      "Failed to load Our Story for admin:",
      error
    );

    return null;
  }
}