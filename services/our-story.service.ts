import {
  APPWRITE_DATABASE_ID,
  tablesDB,
} from "@/lib/appwrite";

import { Query } from "node-appwrite";

import type { OurStory } from "@/types/our-story";

function mapOurStory(
  record: Record<string, unknown>
): OurStory {
  return {
    id: String(record.$id ?? ""),
    title: String(record.title ?? ""),
    paragraphOne: String(
      record.paragraphOne ?? ""
    ),
    paragraphTwo: String(
      record.paragraphTwo ?? ""
    ),
    buttonText: String(
      record.buttonText ?? ""
    ),
    buttonLink: String(
      record.buttonLink ?? ""
    ),
    active: Boolean(record.active),
  };
}

export async function getOurStory(): Promise<
  OurStory | null
> {
  try {
    const result = await tablesDB.listRows({
      databaseId: APPWRITE_DATABASE_ID,
      tableId: "ourstory",
      queries: [
        Query.equal("active", [true]),
        Query.limit(1),
      ],
    });

    if (result.rows.length === 0) {
      return null;
    }

    return mapOurStory(
      result.rows[0] as unknown as Record<
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

export async function getOurStoryForAdmin(): Promise<
  OurStory | null
> {
  try {
    const result = await tablesDB.listRows({
      databaseId: APPWRITE_DATABASE_ID,
      tableId: "ourstory",
      queries: [
        Query.limit(1),
      ],
    });

    if (result.rows.length === 0) {
      return null;
    }

    return mapOurStory(
      result.rows[0] as unknown as Record<
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