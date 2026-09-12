import Link from "next/link";
import { redirect } from "next/navigation";

import ProductTable from "@/components/admin/ProductTable";
import { getBrands } from "@/services/brand.service";
import { getCategories } from "@/services/category.service";
import {
  getProductsPage,
  type ProductFilters,
} from "@/services/product.service";

const PRODUCTS_PER_PAGE = 10;

type SearchParams = {
  q?: string | string[];
  collection?: string | string[];
  category?: string | string[];
  brand?: string | string[];
  active?: string | string[];
  page?: string | string[];
};

type Props = {
  searchParams: Promise<SearchParams>;
};

function getFirstSearchValue(
  value: string | string[] | undefined
) {
  return (
    Array.isArray(value) ? value[0] : value
  )?.trim() ?? "";
}

function getProductsUrl(
  filters: ProductFilters,
  page = 1
) {
  const searchParams = new URLSearchParams();

  if (filters.search) {
    searchParams.set("q", filters.search);
  }

  if (filters.collection) {
    searchParams.set(
      "collection",
      filters.collection
    );
  }

  if (filters.category) {
    searchParams.set(
      "category",
      filters.category
    );
  }

  if (filters.brand) {
    searchParams.set(
      "brand",
      filters.brand
    );
  }

  if (typeof filters.active === "boolean") {
    searchParams.set(
      "active",
      String(filters.active)
    );
  }

  if (page > 1) {
    searchParams.set(
      "page",
      String(page)
    );
  }

  const query = searchParams.toString();

  return query
    ? `/admin/products?${query}`
    : "/admin/products";
}

function getVisiblePages(
  currentPage: number,
  totalPages: number
) {
  const start = Math.max(
    1,
    Math.min(
      currentPage - 2,
      totalPages - 4
    )
  );

  const end = Math.min(
    totalPages,
    start + 4
  );

  return Array.from(
    { length: end - start + 1 },
    (_, index) => start + index
  );
}

export default async function ProductsPage({
  searchParams,
}: Props) {
  const params = await searchParams;

  const collectionParam =
    getFirstSearchValue(
      params.collection
    );

  const categoryParam =
    getFirstSearchValue(
      params.category
    );

  const brandParam =
    getFirstSearchValue(
      params.brand
    );

  const activeParam =
    getFirstSearchValue(
      params.active
    );

  const pageParam = Number(
    getFirstSearchValue(
      params.page
    )
  );

  const requestedPage =
    Number.isSafeInteger(pageParam) &&
    pageParam > 0
      ? pageParam
      : 1;

  const [categories, brands] =
    await Promise.all([
      getCategories(),
      getBrands(),
    ]);

  const collection = [
    "Gold",
    "Diamond",
  ].includes(collectionParam)
    ? collectionParam
    : "";

  const category = categories.some(
    ({ id }) => id === categoryParam
  )
    ? categoryParam
    : "";

  const brand = brands.some(
    ({ id }) => id === brandParam
  )
    ? brandParam
    : "";

  const active =
    activeParam === "true"
      ? true
      : activeParam === "false"
        ? false
        : undefined;

  const filters: ProductFilters = {
    search: getFirstSearchValue(
      params.q
    ),
    collection,
    category,
    brand,
    active,
  };

  const productPage =
    await getProductsPage(
      filters,
      requestedPage,
      PRODUCTS_PER_PAGE
    );

  if (
    productPage.totalPages > 0 &&
    requestedPage >
      productPage.totalPages
  ) {
    redirect(
      getProductsUrl(
        filters,
        productPage.totalPages
      )
    );
  }

  const hasFilters = Boolean(
    filters.search ||
      collection ||
      category ||
      brand ||
      typeof active === "boolean"
  );

  const firstItem =
    productPage.totalItems
      ? (productPage.page - 1) *
          productPage.perPage +
        1
      : 0;

  const lastItem = Math.min(
    productPage.page *
      productPage.perPage,
    productPage.totalItems
  );

  const pageNumbers =
    getVisiblePages(
      productPage.page,
      productPage.totalPages
    );

  return (
    <div className="text-[#302A23]">
      {/* PAGE HEADER */}

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#A47C3A]">
            Catalogue
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#302A23] md:text-4xl">
            Products
          </h1>

          <p className="mt-2 text-sm text-[#6F665B]">
            Manage your jewellery products.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center rounded-xl bg-[#B08D57] px-6 py-3 font-semibold text-[#FFF9EF] shadow-[0_6px_18px_rgba(176,141,87,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#8F6F3F]"
        >
          + Add Product
        </Link>
      </div>

      {/* SEARCH & FILTERS */}

      <form
        action="/admin/products"
        method="GET"
        className="mb-6 space-y-4 rounded-2xl border border-[#D8C9B5] bg-[#EDE3D3] p-4 shadow-[0_4px_18px_rgba(80,60,30,0.04)] sm:p-5"
      >
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {/* Search */}

          <div className="xl:col-span-2">
            <label
              className="sr-only"
              htmlFor="product-search"
            >
              Search products
            </label>

            <input
              id="product-search"
              name="q"
              type="search"
              defaultValue={
                filters.search
              }
              placeholder="Search by product name or slug"
              className="w-full rounded-xl border border-[#D0C1AC] bg-[#F8F2E8] px-4 py-3 text-sm text-[#302A23] outline-none transition placeholder:text-[#8A7F70] focus:border-[#B08D57] focus:ring-2 focus:ring-[#B08D57]/15"
            />
          </div>

          {/* Collection */}

          <div>
            <label
              className="sr-only"
              htmlFor="collection-filter"
            >
              Filter by collection
            </label>

            <select
              id="collection-filter"
              name="collection"
              defaultValue={collection}
              className="w-full rounded-xl border border-[#D0C1AC] bg-[#F8F2E8] px-4 py-3 text-sm text-[#40382F] outline-none transition focus:border-[#B08D57] focus:ring-2 focus:ring-[#B08D57]/15"
            >
              <option value="">
                All Collections
              </option>

              <option value="Gold">
                Gold
              </option>

              <option value="Diamond">
                Diamond
              </option>
            </select>
          </div>

          {/* Category */}

          <div>
            <label
              className="sr-only"
              htmlFor="category-filter"
            >
              Filter by category
            </label>

            <select
              id="category-filter"
              name="category"
              defaultValue={category}
              className="w-full rounded-xl border border-[#D0C1AC] bg-[#F8F2E8] px-4 py-3 text-sm text-[#40382F] outline-none transition focus:border-[#B08D57] focus:ring-2 focus:ring-[#B08D57]/15"
            >
              <option value="">
                All Categories
              </option>

              {categories.map(
                (item) => (
                  <option
                    key={item.id}
                    value={item.id}
                  >
                    {item.name}
                  </option>
                )
              )}
            </select>
          </div>

          {/* Brand */}

          <div>
            <label
              className="sr-only"
              htmlFor="brand-filter"
            >
              Filter by brand
            </label>

            <select
              id="brand-filter"
              name="brand"
              defaultValue={brand}
              className="w-full rounded-xl border border-[#D0C1AC] bg-[#F8F2E8] px-4 py-3 text-sm text-[#40382F] outline-none transition focus:border-[#B08D57] focus:ring-2 focus:ring-[#B08D57]/15"
            >
              <option value="">
                All Brands
              </option>

              {brands.map(
                (item) => (
                  <option
                    key={item.id}
                    value={item.id}
                  >
                    {item.name}
                  </option>
                )
              )}
            </select>
          </div>
        </div>

        {/* STATUS + BUTTONS */}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="w-full sm:w-48">
            <label
              className="sr-only"
              htmlFor="active-filter"
            >
              Filter by status
            </label>

            <select
              id="active-filter"
              name="active"
              defaultValue={
                typeof active ===
                "boolean"
                  ? String(active)
                  : ""
              }
              className="w-full rounded-xl border border-[#D0C1AC] bg-[#F8F2E8] px-4 py-3 text-sm text-[#40382F] outline-none transition focus:border-[#B08D57] focus:ring-2 focus:ring-[#B08D57]/15"
            >
              <option value="">
                All Statuses
              </option>

              <option value="true">
                Active
              </option>

              <option value="false">
                Inactive
              </option>
            </select>
          </div>

          {/* Apply */}

          <button
            type="submit"
            className="rounded-xl bg-[#B08D57] px-6 py-3 font-semibold text-[#FFF9EF] shadow-[0_5px_14px_rgba(176,141,87,0.15)] transition-all duration-300 hover:bg-[#8F6F3F]"
          >
            Apply Filters
          </button>

          {/* Clear */}

          {hasFilters && (
            <Link
              href="/admin/products"
              className="rounded-xl border border-[#CDBDA8] bg-[#F8F2E8] px-6 py-3 text-center font-semibold text-[#554C42] transition-all duration-300 hover:border-[#B08D57] hover:bg-[#FDF9F1] hover:text-[#8F6F3F]"
            >
              Clear All
            </Link>
          )}
        </div>
      </form>

      {/* RESULT COUNT */}

      {productPage.totalItems >
        0 && (
        <p className="mb-4 text-sm font-medium text-[#6F665B]">
          Showing{" "}
          <span className="font-semibold text-[#40382F]">
            {firstItem}-{lastItem}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-[#40382F]">
            {productPage.totalItems}
          </span>{" "}
          products
          {hasFilters
            ? " matching the current filters."
            : "."}
        </p>
      )}

      {/* PRODUCT TABLE */}

      <ProductTable
        products={
          productPage.items
        }
        emptyMessage={
          hasFilters
            ? "No products match the selected search and filters."
            : undefined
        }
      />

      {/* PAGINATION */}

      {productPage.totalPages >
        1 && (
        <nav
          aria-label="Product pagination"
          className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="text-sm font-medium text-[#6F665B]">
            Page{" "}
            <span className="text-[#40382F]">
              {productPage.page}
            </span>{" "}
            of{" "}
            <span className="text-[#40382F]">
              {
                productPage.totalPages
              }
            </span>
          </p>

          <div className="flex flex-wrap items-center gap-2">
            {/* Previous */}

            {productPage.page >
              1 && (
              <Link
                href={getProductsUrl(
                  filters,
                  productPage.page -
                    1
                )}
                className="rounded-lg border border-[#CDBDA8] bg-[#FAF6EE] px-4 py-2 text-sm font-medium text-[#554C42] transition-all hover:border-[#B08D57] hover:text-[#8F6F3F]"
              >
                Previous
              </Link>
            )}

            {/* Page Numbers */}

            {pageNumbers.map(
              (page) => (
                <Link
                  key={page}
                  href={getProductsUrl(
                    filters,
                    page
                  )}
                  aria-current={
                    page ===
                    productPage.page
                      ? "page"
                      : undefined
                  }
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                    page ===
                    productPage.page
                      ? "bg-[#B08D57] text-[#FFF9EF] shadow-[0_4px_12px_rgba(176,141,87,0.16)]"
                      : "border border-[#CDBDA8] bg-[#FAF6EE] text-[#554C42] hover:border-[#B08D57] hover:text-[#8F6F3F]"
                  }`}
                >
                  {page}
                </Link>
              )
            )}

            {/* Next */}

            {productPage.page <
              productPage.totalPages && (
              <Link
                href={getProductsUrl(
                  filters,
                  productPage.page +
                    1
                )}
                className="rounded-lg border border-[#CDBDA8] bg-[#FAF6EE] px-4 py-2 text-sm font-medium text-[#554C42] transition-all hover:border-[#B08D57] hover:text-[#8F6F3F]"
              >
                Next
              </Link>
            )}
          </div>
        </nav>
      )}
    </div>
  );
}