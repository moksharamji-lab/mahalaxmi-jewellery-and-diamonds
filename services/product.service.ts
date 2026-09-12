import type {
  RecordListOptions,
  RecordModel,
} from "pocketbase";

import pb from "@/lib/pocketbase";
import type { Product } from "@/types/product";

export type ProductFilters = {
  search?: string;
  collection?: string;
  category?: string;
  brand?: string;
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

/* --------------------------------------------------
   PRODUCT LIST OPTIONS
-------------------------------------------------- */

function getProductListOptions(
  filters: ProductFilters
): RecordListOptions {
  const expressions: string[] = [];

  const parameters: Record<string, string | boolean> = {};

  const search = filters.search?.trim();

  if (search) {
    expressions.push(
      "(name ~ {:search} || slug ~ {:search})"
    );

    parameters.search = search;
  }

  if (filters.collection) {
    expressions.push(
      "collection = {:collection}"
    );

    parameters.collection = filters.collection;
  }

  if (filters.category) {
    expressions.push(
      "category = {:category}"
    );

    parameters.category = filters.category;
  }

  if (filters.brand) {
    expressions.push(
      "brand = {:brand}"
    );

    parameters.brand = filters.brand;
  }

  if (typeof filters.active === "boolean") {
    expressions.push(
      "active = {:active}"
    );

    parameters.active = filters.active;
  }

  if (typeof filters.featured === "boolean") {
    expressions.push(
      "featured = {:featured}"
    );

    parameters.featured = filters.featured;
  }

  return {
    sort: "-created",
    expand: "category,brand",

    ...(expressions.length > 0
      ? {
          filter: pb.filter(
            expressions.join(" && "),
            parameters
          ),
        }
      : {}),

    requestKey: null,
  };
}

/* --------------------------------------------------
   MAP POCKETBASE PRODUCT
-------------------------------------------------- */

function mapProduct(
  record: RecordModel
): Product {
  const categoryName =
    record.expand?.category?.name ?? "";

  const brandName =
    record.expand?.brand?.name ?? "";

  const images = Array.isArray(record.images)
    ? record.images.map(String)
    : [];

  /* -----------------------------------------------
     CREATE IMAGE URLS
  ------------------------------------------------ */

  const imageUrl =
    images.length > 0
      ? pb.files.getURL(
          record,
          images[0]
        )
      : "";

  const imageUrls = images.map(
    (image) =>
      pb.files.getURL(record, image)
  );

  /* -----------------------------------------------
     VIDEO URL
  ------------------------------------------------ */

  const video =
    record.video
      ? pb.files.getURL(
          record,
          String(record.video)
        )
      : "";

  /* -----------------------------------------------
     RETURN PRODUCT
  ------------------------------------------------ */

  return {
    id: record.id,

    collectionId: String(
      record.collectionId ?? ""
    ),

    name: String(
      record.name ?? ""
    ),

    slug: String(
      record.slug ?? ""
    ),

    collection: String(
      record.collection ?? ""
    ),

    category: String(
      record.category ?? ""
    ),

    brand: String(
      record.brand ?? ""
    ),

    categoryName: String(
      categoryName
    ),

    brandName: String(
      brandName
    ),

    purity: String(
      record.purity ?? ""
    ),

    weight: Number(
      record.weight ?? 0
    ),

    makingCharges: Number(
      record.makingCharges ?? 0
    ),

    description: String(
      record.description ?? ""
    ),

    featured: Boolean(
      record.featured
    ),

    active: Boolean(
      record.active
    ),

    images,
    imageUrls,
    imageUrl,

    video,

    created: String(
      record.created ?? ""
    ),

    updated: String(
      record.updated ?? ""
    ),
  };
}

/* --------------------------------------------------
   GET ALL PRODUCTS
-------------------------------------------------- */

export async function getProducts(
  filters: ProductFilters = {}
): Promise<Product[]> {
  try {
    const records = await pb
      .collection("Products")
      .getFullList(
        getProductListOptions(filters)
      );

    return records.map(mapProduct);
  } catch (error) {
    console.error(
      "Failed to load products:",
      error
    );

    throw error;
  }
}

/* --------------------------------------------------
   GET PAGINATED PRODUCTS
-------------------------------------------------- */

export async function getProductsPage(
  filters: ProductFilters = {},
  page = 1,
  perPage = 10
): Promise<ProductPage> {
  try {
    const result = await pb
      .collection("Products")
      .getList(
        Math.max(1, page),
        Math.max(1, perPage),
        getProductListOptions(filters)
      );

    return {
      items: result.items.map(
        mapProduct
      ),

      page: result.page,

      perPage: result.perPage,

      totalItems:
        result.totalItems,

      totalPages:
        result.totalPages,
    };
  } catch (error) {
    console.error(
      "Failed to load paginated products:",
      error
    );

    throw error;
  }
}

/* --------------------------------------------------
   GET PRODUCT BY ID
-------------------------------------------------- */

export async function getProduct(
  id: string
): Promise<Product> {
  try {
    const record = await pb
      .collection("Products")
      .getOne(id, {
        expand: "category,brand",
        requestKey: null,
      });

    return mapProduct(record);
  } catch (error) {
    console.error(
      `Failed to load product ${id}:`,
      error
    );

    throw error;
  }
}

/* --------------------------------------------------
   GET PRODUCT BY SLUG
-------------------------------------------------- */

export async function getProductBySlug(
  slug: string
): Promise<Product> {
  const cleanSlug =
    decodeURIComponent(slug).trim();

  if (!cleanSlug) {
    throw new Error(
      "Product slug is empty."
    );
  }

  try {
    const result = await pb
      .collection("Products")
      .getList(
        1,
        1,
        {
          filter: pb.filter(
            "slug = {:slug}",
            {
              slug: cleanSlug,
            }
          ),

          expand: "category,brand",

          requestKey: null,
        }
      );

    if (result.items.length === 0) {
      throw new Error(
        `Product not found: ${cleanSlug}`
      );
    }

    return mapProduct(
      result.items[0]
    );
  } catch (error) {
    console.error(
      "PRODUCT LOOKUP FAILED:",
      error
    );

    throw error;
  }
}

/* --------------------------------------------------
   CREATE PRODUCT
-------------------------------------------------- */

export async function createProduct(
  data: FormData
) {
  try {
    return await pb
      .collection("Products")
      .create(data);
  } catch (error) {
    console.error(
      "Failed to create product:",
      error
    );

    throw error;
  }
}

/* --------------------------------------------------
   UPDATE PRODUCT
-------------------------------------------------- */

export async function updateProduct(
  id: string,
  data: FormData
) {
  try {
    return await pb
      .collection("Products")
      .update(
        id,
        data
      );
  } catch (error) {
    console.error(
      `Failed to update product ${id}:`,
      error
    );

    throw error;
  }
}

/* --------------------------------------------------
   DELETE PRODUCT
-------------------------------------------------- */

export async function deleteProduct(
  id: string
) {
  try {
    return await pb
      .collection("Products")
      .delete(id);
  } catch (error) {
    console.error(
      `Failed to delete product ${id}:`,
      error
    );

    throw error;
  }
}