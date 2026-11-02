import {
  APPWRITE_DATABASE_ID,
  tablesDB,
} from "@/lib/appwrite";

import { Query } from "node-appwrite";

import type { Product } from "@/types/product";

export type ProductFilters = {
  search?: string;
  collection?: string;
  category?: string;
  active?: boolean;
  featured?: boolean;
};

export type ProductPage = {
  items: Product[];
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
};

/* =========================================================
   APPWRITE RECORD TYPE
========================================================= */

type AppwriteRecord = Record<string, unknown>;

/* =========================================================
   HELPERS
========================================================= */

function getString(
  record: AppwriteRecord,
  key: string
): string {
  return String(record[key] ?? "");
}

function getBoolean(
  record: AppwriteRecord,
  key: string
): boolean {
  return Boolean(record[key]);
}

function getNumber(
  record: AppwriteRecord,
  key: string
): number {
  const value = Number(record[key] ?? 0);

  return Number.isFinite(value)
    ? value
    : 0;
}

/* =========================================================
   GOOGLE DRIVE IMAGES
========================================================= */

function getDriveImages(
  record: AppwriteRecord
): string[] {
  const value = record.driveImages;

  if (Array.isArray(value)) {
    return value
      .map(String)
      .filter(Boolean);
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);

      if (Array.isArray(parsed)) {
        return parsed
          .map(String)
          .filter(Boolean);
      }
    } catch {
      return [];
    }
  }

  return [];
}

function getDriveImageUrls(
  driveImages: string[]
): string[] {
  return driveImages.map(
    (fileId) =>
      `/api/media/${encodeURIComponent(fileId)}`
  );
}

/* =========================================================
   GOOGLE DRIVE VIDEO
========================================================= */

function getDriveVideoUrl(
  record: AppwriteRecord
): string {
  const driveVideo = getString(
    record,
    "driveVideo"
  ).trim();

  if (!driveVideo) {
    return "";
  }

  return `/api/media/${encodeURIComponent(
    driveVideo
  )}`;
}

/* =========================================================
   COLLECTION INFO
========================================================= */

type CollectionInfo = {
  id: string;
  name: string;
  slug: string;
};

type CategoryInfo = {
  id: string;
  name: string;
};

async function getCollectionInfo(): Promise<
  CollectionInfo[]
> {
  try {
    const result = await tablesDB.listRows({
      databaseId: APPWRITE_DATABASE_ID,
      tableId: "collections",
      queries: [
        Query.limit(100),
      ],
    });

    return result.rows.map((row) => {
      const record =
        row as unknown as AppwriteRecord;

      const rawName = String(
        record.name ?? ""
      ).trim();

      const rawSlug = String(
        record.slug ?? ""
      ).trim();

      const slug =
        rawSlug ||
        rawName.toLowerCase();

      const name =
        rawName ||
        formatCollectionName(slug);

      return {
        id: String(
          record.$id ?? ""
        ),
        name,
        slug,
      };
    });
  } catch (error) {
    console.error(
      "Failed to load product collections:",
      error
    );

    return [];
  }
}

function formatCollectionName(
  value: string
): string {
  const cleanValue = value
    .trim()
    .toLowerCase();

  if (cleanValue === "gold") {
    return "Gold";
  }

  if (cleanValue === "diamond") {
    return "Diamond";
  }

  if (!cleanValue) {
    return "";
  }

  return cleanValue
    .split(/\s+/)
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1)
    )
    .join(" ");
}

/* =========================================================
   CATEGORY INFO
========================================================= */

async function getCategoryInfo(): Promise<
  CategoryInfo[]
> {
  try {
    const result = await tablesDB.listRows({
      databaseId: APPWRITE_DATABASE_ID,
      tableId: "categories",
      queries: [
        Query.limit(100),
      ],
    });

    return result.rows.map((row) => {
      const record =
        row as unknown as AppwriteRecord;

      return {
        id: String(
          record.$id ?? ""
        ),
        name: String(
          record.name ??
            record.slug ??
            ""
        ),
      };
    });
  } catch (error) {
    console.error(
      "Failed to load product categories:",
      error
    );

    return [];
  }
}

/* =========================================================
   MAP APPWRITE PRODUCT
========================================================= */

function mapProduct(
  record: AppwriteRecord,
  collections: CollectionInfo[],
  categories: CategoryInfo[]
): Product {
  const collectionId = getString(
    record,
    "collectionId"
  );

  const categoryId = getString(
    record,
    "categoryId"
  );

  const collectionRecord =
    collections.find(
      (item) =>
        item.id === collectionId
    );

  const categoryRecord =
    categories.find(
      (item) =>
        item.id === categoryId
    );

  const collectionName =
    collectionRecord?.name ?? "";

  const categoryName =
    categoryRecord?.name ?? "";

  /* =====================================================
     MEDIA
  ===================================================== */

  const driveImages =
    getDriveImages(record);

  const imageUrls =
    getDriveImageUrls(
      driveImages
    );

  const imageUrl =
    imageUrls.length > 0
      ? imageUrls[0]
      : "";

  const driveVideo =
    getString(
      record,
      "driveVideo"
    ).trim();

  const videoUrl =
    getDriveVideoUrl(record);

  /* =====================================================
     PRODUCT
  ===================================================== */

  return {
    id: getString(
      record,
      "$id"
    ),

    collectionId,

    name: getString(
      record,
      "name"
    ),

    slug: getString(
      record,
      "slug"
    ),

    collection:
      collectionName,

    category:
      categoryId,

    categoryName,

    purity: getString(
      record,
      "purity"
    ),

    /*
     * NEW FIELD
     *
     * This must exist in Appwrite before products
     * start using Tag Number.
     */
    tagNumber: getString(
      record,
      "tagNumber"
    ),

    description: getString(
      record,
      "description"
    ),

    /*
     * Weight stays in the model/database.
     *
     * IMPORTANT:
     * It is not displayed publicly right now.
     */
    weight: getNumber(
      record,
      "weight"
    ),

    featured:
      getBoolean(
        record,
        "featured"
      ),

    active:
      getBoolean(
        record,
        "active"
      ),

    /*
     * Google Drive media
     */
    images: [],

    driveImages,

    imageUrls,

    imageUrl,

    driveVideo,

    video: videoUrl,

    created:
      getString(
        record,
        "$createdAt"
      ),

    updated:
      getString(
        record,
        "$updatedAt"
      ),
  };
}

/* =========================================================
   RESOLVE COLLECTION FILTER
========================================================= */

async function resolveCollectionFilter(
  collection?: string
): Promise<string | null> {
  if (!collection) {
    return null;
  }

  const collections =
    await getCollectionInfo();

  const wanted =
    collection
      .trim()
      .toLowerCase();

  const match =
    collections.find(
      (item) => {
        const name =
          item.name
            .trim()
            .toLowerCase();

        const slug =
          item.slug
            .trim()
            .toLowerCase();

        if (
          wanted === "gold"
        ) {
          return (
            name === "gold" ||
            name.includes("gold") ||
            slug === "gold" ||
            slug.includes("gold")
          );
        }

        if (
          wanted === "diamond"
        ) {
          return (
            name === "diamond" ||
            name.includes("diamond") ||
            slug === "diamond" ||
            slug.includes("diamond")
          );
        }

        return (
          name === wanted ||
          slug === wanted
        );
      }
    );

  if (!match) {
    console.error(
      `Collection "${collection}" was not found in the collections table. Available collections:`,
      collections
    );

    return null;
  }

  return match.id;
}

/* =========================================================
   BUILD PRODUCT QUERIES
========================================================= */

function buildProductQueries(
  filters: ProductFilters,
  collectionId: string | null
) {
  const queries = [];

  /* =====================================================
     SEARCH
  ===================================================== */

  if (filters.search?.trim()) {
    const search =
      filters.search
        .trim()
        .toLowerCase();

    queries.push(
      Query.search(
        "name",
        search
      )
    );
  }

  /* =====================================================
     COLLECTION
  ===================================================== */

  if (filters.collection) {
    if (collectionId) {
      queries.push(
        Query.equal(
          "collectionId",
          [collectionId]
        )
      );
    } else {
      queries.push(
        Query.equal(
          "collectionId",
          [
            "__NO_MATCHING_COLLECTION__",
          ]
        )
      );
    }
  }

  /* =====================================================
     CATEGORY
  ===================================================== */

  if (filters.category) {
    queries.push(
      Query.equal(
        "categoryId",
        [filters.category]
      )
    );
  }

  /* =====================================================
     ACTIVE
  ===================================================== */

  if (
    typeof filters.active ===
    "boolean"
  ) {
    queries.push(
      Query.equal(
        "active",
        [filters.active]
      )
    );
  }

  /* =====================================================
     FEATURED
  ===================================================== */

  if (
    typeof filters.featured ===
    "boolean"
  ) {
    queries.push(
      Query.equal(
        "featured",
        [filters.featured]
      )
    );
  }

  /* =====================================================
     SORT
  ===================================================== */

  queries.push(
    Query.orderDesc(
      "$createdAt"
    )
  );

  return queries;
}

/* =========================================================
   GET ALL PRODUCTS
========================================================= */

export async function getProducts(
  filters: ProductFilters = {}
): Promise<Product[]> {
  try {
    const [
      collectionId,
      collections,
      categories,
    ] = await Promise.all([
      resolveCollectionFilter(
        filters.collection
      ),
      getCollectionInfo(),
      getCategoryInfo(),
    ]);

    const result =
      await tablesDB.listRows({
        databaseId:
          APPWRITE_DATABASE_ID,

        tableId:
          "products",

        queries:
          buildProductQueries(
            filters,
            collectionId
          ),
      });

    let products =
      result.rows.map(
        (row) =>
          mapProduct(
            row as unknown as AppwriteRecord,
            collections,
            categories
          )
      );

    /* ===================================================
       CLIENT-SIDE SEARCH FALLBACK
    =================================================== */

    if (
      filters.search?.trim()
    ) {
      const search =
        filters.search
          .trim()
          .toLowerCase();

      products =
        products.filter(
          (product) =>
            product.name
              .toLowerCase()
              .includes(search) ||
            product.slug
              .toLowerCase()
              .includes(search)
        );
    }

    return products;
  } catch (error) {
    console.error(
      "Failed to load products:",
      error
    );

    throw error;
  }
}

/* =========================================================
   GET PAGINATED PRODUCTS
========================================================= */

export async function getProductsPage(
  filters: ProductFilters = {},
  page = 1,
  perPage = 10
): Promise<ProductPage> {
  try {
    const safePage =
      Math.max(
        1,
        page
      );

    const safePerPage =
      Math.max(
        1,
        perPage
      );

    const [
      collectionId,
      collections,
      categories,
    ] = await Promise.all([
      resolveCollectionFilter(
        filters.collection
      ),
      getCollectionInfo(),
      getCategoryInfo(),
    ]);

    const result =
      await tablesDB.listRows({
        databaseId:
          APPWRITE_DATABASE_ID,

        tableId:
          "products",

        queries: [
          ...buildProductQueries(
            filters,
            collectionId
          ),

          Query.limit(
            safePerPage
          ),

          Query.offset(
            (safePage - 1) *
              safePerPage
          ),
        ],
      });

    const items =
      result.rows.map(
        (row) =>
          mapProduct(
            row as unknown as AppwriteRecord,
            collections,
            categories
          )
      );

    return {
      items,

      page:
        safePage,

      perPage:
        safePerPage,

      totalItems:
        result.total,

      totalPages:
        Math.ceil(
          result.total /
            safePerPage
        ),
    };
  } catch (error) {
    console.error(
      "Failed to load paginated products:",
      error
    );

    throw error;
  }
}

/* =========================================================
   GET PRODUCT BY ID
========================================================= */

export async function getProduct(
  id: string
): Promise<Product> {
  try {
    const [
      record,
      collections,
      categories,
    ] = await Promise.all([
      tablesDB.getRow({
        databaseId:
          APPWRITE_DATABASE_ID,

        tableId:
          "products",

        rowId:
          id,
      }),

      getCollectionInfo(),

      getCategoryInfo(),
    ]);

    return mapProduct(
      record as unknown as AppwriteRecord,
      collections,
      categories
    );
  } catch (error) {
    console.error(
      `Failed to load product ${id}:`,
      error
    );

    throw error;
  }
}

/* =========================================================
   GET PRODUCT BY SLUG
========================================================= */

export async function getProductBySlug(
  slug: string
): Promise<Product> {
  const cleanSlug =
    decodeURIComponent(
      slug
    ).trim();

  if (!cleanSlug) {
    throw new Error(
      "Product slug is empty."
    );
  }

  try {
    const [
      result,
      collections,
      categories,
    ] = await Promise.all([
      tablesDB.listRows({
        databaseId:
          APPWRITE_DATABASE_ID,

        tableId:
          "products",

        queries: [
          Query.equal(
            "slug",
            [cleanSlug]
          ),

          Query.limit(1),
        ],
      }),

      getCollectionInfo(),

      getCategoryInfo(),
    ]);

    if (
      result.rows.length > 0
    ) {
      return mapProduct(
        result.rows[0] as unknown as AppwriteRecord,
        collections,
        categories
      );
    }

    /*
     * Fallback to Appwrite row ID.
     */
    const record =
      await tablesDB.getRow({
        databaseId:
          APPWRITE_DATABASE_ID,

        tableId:
          "products",

        rowId:
          cleanSlug,
      });

    return mapProduct(
      record as unknown as AppwriteRecord,
      collections,
      categories
    );
  } catch (error) {
    console.error(
      `PRODUCT LOOKUP FAILED: ${cleanSlug}`,
      error
    );

    throw error;
  }
}

/* =========================================================
   CREATE PRODUCT
========================================================= */

export async function createProduct(
  _data: FormData
) {
  void _data;

  throw new Error(
    "Product creation must be handled through the admin API."
  );
}

/* =========================================================
   UPDATE PRODUCT
========================================================= */

export async function updateProduct(
  _id: string,
  _data: FormData
) {
  void _id;
  void _data;

  throw new Error(
    "Product updates must be handled through the admin API."
  );
}

/* =========================================================
   DELETE PRODUCT
========================================================= */

export async function deleteProduct(
  id: string
) {
  try {
    return await tablesDB.deleteRow({
      databaseId:
        APPWRITE_DATABASE_ID,

      tableId:
        "products",

      rowId:
        id,
    });
  } catch (error) {
    console.error(
      `Failed to delete product ${id}:`,
      error
    );

    throw error;
  }
}
