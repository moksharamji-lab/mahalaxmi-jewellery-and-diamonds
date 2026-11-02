import {
  APPWRITE_DATABASE_ID,
  tablesDB,
} from "@/lib/appwrite";

import {
  APPWRITE_GALLERY_TABLE_ID,
} from "@/lib/appwrite-tables";

import { Query } from "node-appwrite";

import type { GalleryImage } from "@/types/gallery";

type GalleryRecord = {
  $id: string;
  image?: string;
  driveFileId?: string;
  order?: number;
  active?: boolean;
};

function mapGalleryImage(
  record: GalleryRecord,
): GalleryImage {
  const driveFileId =
    String(
      record.driveFileId ?? "",
    ).trim();

  return {
    id: record.$id,

    image: String(
      record.image ?? "",
    ).trim(),

    driveFileId,

    order: Number(
      record.order ?? 0,
    ),

    active: Boolean(
      record.active,
    ),
  };
}

export async function getGalleryImages(): Promise<
  GalleryImage[]
> {
  try {
    const response =
      await tablesDB.listRows({
        databaseId:
          APPWRITE_DATABASE_ID,

        tableId:
          APPWRITE_GALLERY_TABLE_ID,

        queries: [
          Query.orderAsc("order"),
          Query.orderDesc(
            "$createdAt",
          ),
        ],
      });

    return response.rows
      .map((row) =>
        mapGalleryImage(
          row as GalleryRecord,
        ),
      )
      .sort(
        (a, b) =>
          a.order - b.order,
      );
  } catch (error) {
    console.error(
      "[Gallery] Failed to fetch gallery images:",
      error,
    );

    return [];
  }
}

export async function getActiveGalleryImages(): Promise<
  GalleryImage[]
> {
  try {
    const response =
      await tablesDB.listRows({
        databaseId:
          APPWRITE_DATABASE_ID,

        tableId:
          APPWRITE_GALLERY_TABLE_ID,

        queries: [
          Query.equal(
            "active",
            true,
          ),
          Query.orderAsc("order"),
          Query.orderDesc(
            "$createdAt",
          ),
        ],
      });

    return response.rows
      .map((row) =>
        mapGalleryImage(
          row as GalleryRecord,
        ),
      )
      .filter(
        (item) => item.active,
      )
      .sort(
        (a, b) =>
          a.order - b.order,
      );
  } catch (error) {
    console.error(
      "[Gallery] Failed to fetch active gallery images:",
      error,
    );

    return [];
  }
}

export async function getGalleryImageById(
  id: string,
): Promise<GalleryImage | null> {
  try {
    const response =
      await tablesDB.getRow({
        databaseId:
          APPWRITE_DATABASE_ID,

        tableId:
          APPWRITE_GALLERY_TABLE_ID,

        rowId: id,
      });

    return mapGalleryImage(
      response as GalleryRecord,
    );
  } catch (error) {
    console.error(
      `[Gallery] Failed to fetch gallery image ${id}:`,
      error,
    );

    return null;
  }
}
