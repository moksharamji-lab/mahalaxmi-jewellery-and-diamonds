import {
  APPWRITE_DATABASE_ID,
  tablesDB,
} from "@/lib/appwrite";

import type { Category } from "@/types/category";

export type { Category } from "@/types/category";

function mapCategory(
  record: Record<string, unknown>
): Category {
  return {
    id: String(record.$id ?? ""),
    name: String(record.name ?? ""),
    slug: String(record.slug ?? ""),

    // Temporary compatibility value.
    // The Appwrite Categories table currently does not
    // have a collection field.
    collection: "Gold",

    description: "",

    // Google Drive file ID stored in Appwrite.
    image: String(record.driveImage ?? ""),

    active: Boolean(record.active),

    created: String(record.$createdAt ?? ""),
    updated: String(record.$updatedAt ?? ""),
  };
}

export async function getCategories(): Promise<Category[]> {
  try {
    const result = await tablesDB.listRows({
      databaseId: APPWRITE_DATABASE_ID,
      tableId: "categories",
    });

    return result.rows
      .map((row) =>
        mapCategory(
          row as unknown as Record<string, unknown>
        )
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error(
      "Failed to load categories:",
      error
    );

    return [];
  }
}

export async function getActiveCategories(): Promise<Category[]> {
  try {
    const result = await tablesDB.listRows({
      databaseId: APPWRITE_DATABASE_ID,
      tableId: "categories",
    });

    return result.rows
      .map((row) =>
        mapCategory(
          row as unknown as Record<string, unknown>
        )
      )
      .filter((category) => category.active)
      .sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error(
      "Failed to load active categories:",
      error
    );

    return [];
  }
}

export async function getCategoriesByCollection(
  collection: "Gold" | "Diamond"
): Promise<Category[]> {
  try {
    const result = await tablesDB.listRows({
      databaseId: APPWRITE_DATABASE_ID,
      tableId: "categories",
    });

    console.warn(
      `getCategoriesByCollection("${collection}") cannot currently filter by collection because the Appwrite Categories table does not have a collection column.`
    );

    return result.rows
      .map((row) =>
        mapCategory(
          row as unknown as Record<string, unknown>
        )
      )
      .filter((category) => category.active);
  } catch (error) {
    console.error(
      `Failed to load ${collection} categories:`,
      error
    );

    return [];
  }
}

export async function getCategoryById(
  id: string
): Promise<Category | null> {
  try {
    const cleanId = id.trim();

    if (!cleanId) {
      return null;
    }

    const result = await tablesDB.getRow({
      databaseId: APPWRITE_DATABASE_ID,
      tableId: "categories",
      rowId: cleanId,
    });

    return mapCategory(
      result as unknown as Record<string, unknown>
    );
  } catch (error) {
    console.error(
      "Failed to load category by ID:",
      error
    );

    return null;
  }
}

export async function getCategoryBySlug(
  slug: string
): Promise<Category | null> {
  try {
    const cleanSlug = slug.trim();

    if (!cleanSlug) {
      return null;
    }

    const result = await tablesDB.listRows({
      databaseId: APPWRITE_DATABASE_ID,
      tableId: "categories",
      queries: [
        `equal("slug", ["${cleanSlug.replace(
          /"/g,
          '\\"'
        )}"])`,
        "limit(1)",
      ],
    });

    if (result.rows.length === 0) {
      return null;
    }

    return mapCategory(
      result.rows[0] as unknown as Record<string, unknown>
    );
  } catch (error) {
    console.error(
      "Failed to load category by slug:",
      error
    );

    return null;
  }
}