import pb from "@/lib/pocketbase";
import type { RecordModel } from "pocketbase";

import type { Category } from "@/types/category";

export type { Category } from "@/types/category";

function normalizeCollection(
  value: unknown
): "Gold" | "Diamond" {
  const text = String(value ?? "")
    .replace("☑", "")
    .trim()
    .toLowerCase();

  if (text === "diamond") {
    return "Diamond";
  }

  return "Gold";
}

function mapCategory(record: RecordModel): Category {
  return {
    id: record.id,
    name: String(record.name ?? ""),
    slug: String(record.slug ?? ""),
    collection: normalizeCollection(
      record.collection
    ),
    image: String(record.image ?? ""),
    description: String(
      record.description ?? ""
    ),
    active: Boolean(record.active),
    created: String(record.created ?? ""),
    updated: String(record.updated ?? ""),
  };
}

export async function getCategories(): Promise<Category[]> {
  try {
    const records = await pb
      .collection("Categories")
      .getFullList({
        sort: "name",
        requestKey: null,
      });

    return records.map(mapCategory);
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
    const records = await pb
      .collection("Categories")
      .getFullList({
        filter: "active = true",
        sort: "name",
        requestKey: null,
      });

    return records.map(mapCategory);
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
    const records = await pb
      .collection("Categories")
      .getFullList({
        filter: pb.filter(
          "collection = {:collection}",
          {
            collection,
          }
        ),
        sort: "name",
        requestKey: null,
      });

    return records.map(mapCategory);
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
    if (!id.trim()) {
      return null;
    }

    const record = await pb
      .collection("Categories")
      .getOne(id, {
        requestKey: null,
      });

    return mapCategory(record);
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

    const record = await pb
      .collection("Categories")
      .getFirstListItem(
        pb.filter("slug = {:slug}", {
          slug: cleanSlug,
        }),
        {
          requestKey: null,
        }
      );

    return mapCategory(record);
  } catch (error) {
    console.error(
      "Failed to load category by slug:",
      error
    );

    return null;
  }
}