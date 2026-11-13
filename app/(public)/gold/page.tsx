import Image from "next/image";
import Link from "next/link";

import {
  getProducts,
  type ProductFilters,
} from "@/services/product.service";

import type { Product } from "@/types/product";

import {
  getCategories,
  type Category,
} from "@/services/category.service";

import {
  getStoreByCollection,
  type Store,
} from "@/services/store.service";

type Props = {
  searchParams: Promise<{
    q?: string;
    category?: string;
    purity?: string;
    featured?: string;
  }>;
};

export default async function GoldPage({
  searchParams,
}: Props) {
  const params = await searchParams;

  const search =
    typeof params.q === "string"
      ? params.q.trim()
      : "";

  const category =
    typeof params.category === "string"
      ? params.category
      : "";

  const purity =
    typeof params.purity === "string"
      ? params.purity
      : "";

  const featured =
    params.featured === "true";

  let products: Product[] = [];
  let availableProducts: Product[] = [];
  let categories: Category[] = [];
  let store: Store | null = null;

  /*
   * =====================================================
   * LOAD GOLD PRODUCTS
   * =====================================================
   */

  try {
    const filters: ProductFilters = {
      collection: "Gold",
      active: true,
      search: search || undefined,
      category: category || undefined,
      featured: featured || undefined,
    };

    products = await getProducts(filters);
  } catch (error) {
    console.error(
      "Failed to load Gold products:",
      error
    );
  }
/* =====================================================
   LOAD ALL AVAILABLE GOLD PRODUCTS
   Used only to determine which categories have products.
===================================================== */

try {
  availableProducts = await getProducts({
    collection: "Gold",
    active: true,
  });
} catch (error) {
  console.error(
    "Failed to load available Gold products:",
    error
  );
}
  /*
   * =====================================================
   * LOAD CATEGORIES
   * =====================================================
   */

  try {
    categories = await getCategories();
  } catch (error) {
    console.error(
      "Failed to load Gold categories:",
      error
    );
  }

  /*
   * =====================================================
   * LOAD GOLD STORE
   * =====================================================
   */

  try {
    store = await getStoreByCollection("Gold");
  } catch (error) {
    console.error(
      "Failed to load Gold store:",
      error
    );
  }

  /* =====================================================
   ACTIVE GOLD CATEGORIES WITH AVAILABLE PRODUCTS
===================================================== */

const availableGoldCategoryIds = new Set(
  availableProducts
    .map((product) => product.category)
    .filter(Boolean)
);

const activeCategories = categories.filter(
  (item) =>
    item.active &&
    item.collection === "Gold" &&
    availableGoldCategoryIds.has(item.id)
);

  /*
   * =====================================================
   * PURITY OPTIONS
   * =====================================================
   */

  const purityOptions = Array.from(
    new Set(
      products
        .map((product) =>
          product.purity?.trim()
        )
        .filter(Boolean)
    )
  ).sort((a, b) =>
    a.localeCompare(b)
  );

  /*
   * =====================================================
   * PURITY FILTER
   *
   * ProductFilters does not currently contain purity,
   * so we apply this one locally after Appwrite data
   * has been loaded.
   * =====================================================
   */

  if (purity) {
    products = products.filter(
      (product) =>
        product.purity?.trim() === purity
    );
  }

  /*
   * =====================================================
   * SORT
   *
   * Featured products first, then product name.
   * =====================================================
   */

  products = [...products].sort(
    (a, b) => {
      if (
        a.featured &&
        !b.featured
      ) {
        return -1;
      }

      if (
        !a.featured &&
        b.featured
      ) {
        return 1;
      }

      return a.name.localeCompare(
        b.name
      );
    }
  );

  /*
   * =====================================================
   * WHATSAPP
   * =====================================================
   */

  const whatsappMessage = category
    ? `Hello, I am interested in your Gold Jewellery Collection.`
    : "Hello, I would like to know more about your Gold Jewellery Collection.";

  const whatsappUrl = store?.whatsapp
    ? `https://wa.me/${store.whatsapp}?text=${encodeURIComponent(
        whatsappMessage
      )}`
    : "";

  /*
   * =====================================================
   * ACTIVE FILTER COUNT
   * =====================================================
   */

  const activeFilterCount =
    Number(Boolean(search)) +
    Number(Boolean(category)) +
    Number(Boolean(purity)) +
    Number(featured);

  return (
    <main className="min-h-screen bg-[#f8f5ef] text-[#1c1a17]">

      {/* =================================================
          SHOPPING FILTER
      ================================================= */}

      <section className="border-b border-[#e5ded2] bg-[#f8f5ef]">
        <div className="mx-auto max-w-350 px-5 py-5 sm:px-8 lg:px-10">

          {/* MOBILE FILTER */}
          <details className="lg:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between border border-[#d8c9b5] bg-[#f1ece3] px-5 py-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#b08d57]">
                  Shop Gold
                </p>

                <p className="mt-1 text-sm font-semibold text-[#1c1a17]">
                  Filters
                  {activeFilterCount > 0 &&
                    ` (${activeFilterCount})`}
                </p>
              </div>

              <span className="text-lg text-[#b08d57]">
                +
              </span>
            </summary>

            <div className="border-x border-b border-[#d8c9b5] bg-white p-5">
              <GoldFilterForm
                search={search}
                category={category}
                purity={purity}
                featured={featured}
                categories={activeCategories}
                purityOptions={purityOptions}
              />
            </div>
          </details>

          {/* DESKTOP FILTER */}
          <div className="hidden lg:block">
            <GoldFilterForm
              search={search}
              category={category}
              purity={purity}
              featured={featured}
              categories={activeCategories}
              purityOptions={purityOptions}
            />
          </div>

        </div>

      </section>

      {/* =================================================
          PRODUCTS
      ================================================= */}

      <section className="bg-[#f8f5ef]">
        <div className="mx-auto max-w-350 px-5 py-8 sm:px-8 sm:py-12 lg:px-10">

          {/* RESULT HEADER */}
          <div className="mb-8 flex flex-col gap-4 border-b border-[#e5ded2] pb-6 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#b08d57]">
                Gold Jewellery
              </p>

              <h1 className="mt-1 font-display text-2xl font-normal text-[#1c1a17] sm:text-3xl">
                Products
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <p className="text-[10px] uppercase tracking-[0.15em] text-[#918a81]">
                {products.length}{" "}
                {products.length === 1
                  ? "Piece"
                  : "Pieces"}
              </p>

              {activeFilterCount > 0 && (
                <Link
                  href="/gold"
                  className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#b08d57] transition-colors hover:text-[#8f6f3f]"
                >
                  Clear All
                </Link>
              )}

            </div>

          </div>

          {/* PRODUCT GRID */}

          {products.length === 0 ? (
            <div className="border border-[#e5ded2] bg-[#f1ece3] px-6 py-24 text-center">

              <div className="text-3xl text-[#b08d57]">
                ✦
              </div>

              <h2 className="mt-5 font-display text-2xl font-normal text-[#1c1a17] sm:text-3xl">
                No Products Found
              </h2>

              <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#777169]">
                No gold jewellery products match
                your selected filters.
              </p>

              <Link
                href="/gold"
                className="mt-8 inline-flex min-h-12.5 items-center justify-center bg-[#b08d57] px-7 text-[10px] font-semibold uppercase tracking-[0.18em] text-white transition-all duration-300 hover:bg-[#8f6f3f] sm:text-xs"
              >
                Clear Filters
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">

              {products.map(
                (product) => (
                  <GoldProductCard
                    key={product.id}
                    product={product}
                  />
                )
              )}

            </div>
          )}
        </div>

      </section>

      {/* =================================================
          GOLD STORE
      ================================================= */}

      <section className="border-t border-[#e5ded2] bg-[#f1ece3]">
        <div className="mx-auto max-w-350 px-5 py-20 sm:px-8 sm:py-24 lg:px-10">

          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#b08d57] sm:text-xs sm:tracking-[0.4em]">
              Visit Our Store
            </p>

            <h2 className="mt-4 font-display text-4xl font-normal text-[#1c1a17] sm:text-5xl">
              Find Your Perfect Piece
            </h2>

            <div className="mx-auto mt-5 h-px w-12 bg-[#b08d57]" />

            <p className="mt-5 text-sm leading-7 text-[#777169] sm:text-base">
              Visit our Gold store and explore our
              collection in person.
            </p>
          </div>

          <div className="mx-auto max-w-4xl border border-[#e5ded2] bg-[#f8f5ef] p-7 sm:p-9 md:p-10">

            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#b08d57] sm:text-xs">
              Gold Jewellery
            </p>

            <h3 className="mt-4 font-display text-3xl font-normal text-[#1c1a17] sm:text-4xl">
              {store?.name ||
                "Mahalaxmi Gold Store"}
            </h3>

            <div className="mt-5 h-px w-10 bg-[#b08d57]" />

            {store?.description && (
              <p className="mt-5 max-w-2xl text-sm leading-7 text-[#777169] sm:text-base">
                {store.description}
              </p>
            )}

            <div className="mt-8 grid gap-7 sm:grid-cols-2">

              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#9b9389]">
                  Address
                </p>

                <p className="mt-2 text-sm leading-7 text-[#4d4943] sm:text-base">
                  {store?.address ||
                    "Store address coming soon"}
                </p>
              </div>

              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#9b9389]">
                  Phone
                </p>

                {store?.phone ? (
                  <a
                    href={`tel:${store.phone}`}
                    className="mt-2 inline-block text-sm text-[#4d4943] transition-colors hover:text-[#b08d57] sm:text-base"
                  >
                    {store.phone}
                  </a>
                ) : (
                  <p className="mt-2 text-sm text-[#918a81]">
                    Phone number coming soon
                  </p>
                )}
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">

              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-12.5 flex-1 items-center justify-center bg-[#b08d57] px-5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white transition-all duration-300 hover:bg-[#8f6f3f] sm:text-xs"
                >
                  WhatsApp Store
                </a>
              )}

              {store?.googleMapsUrl && (
                <a
                  href={store.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-12.5 flex-1 items-center justify-center border border-[#b08d57] px-5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#1c1a17] transition-all duration-300 hover:bg-[#b08d57] hover:text-white sm:text-xs"
                >
                  View Store Location
                </a>
              )}
            </div>
          </div>

        </div>

      </section>

    </main>
  );
}

/* =========================================================
   GOLD FILTER FORM
========================================================= */

function GoldFilterForm({
  search,
  category,
  purity,
  featured,
  categories,
  purityOptions,
}: {
  search: string;
  category: string;
  purity: string;
  featured: boolean;
  categories: Category[];
  purityOptions: string[];
}) {
  return (
    <form
      method="GET"
      action="/gold"
      className="grid gap-5 lg:grid-cols-[minmax(260px,1.5fr)_1fr_1fr_auto]"
    >
      {/* SEARCH */}

      <div>
        <label
          htmlFor="gold-search"
          className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.2em] text-[#8f867b]"
        >
          Search
        </label>

        <input
          id="gold-search"
          name="q"
          type="search"
          defaultValue={search}
          placeholder="Search jewellery..."
          className="h-12 w-full border border-[#d8c9b5] bg-white px-4 text-sm text-[#1c1a17] outline-none transition focus:border-[#b08d57] focus:ring-1 focus:ring-[#b08d57]"
        />
      </div>

      {/* CATEGORY */}

      <div>
        <label
          htmlFor="gold-category"
          className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.2em] text-[#8f867b]"
        >
          Category
        </label>

        <select
          id="gold-category"
          name="category"
          defaultValue={category}
          className="h-12 w-full border border-[#d8c9b5] bg-white px-4 text-sm text-[#1c1a17] outline-none transition focus:border-[#b08d57] focus:ring-1 focus:ring-[#b08d57]"
        >
          <option value="">
            All Categories
          </option>

          {categories.map((item) => (
            <option
              key={item.id}
              value={item.id}
            >
              {item.name}
            </option>
          ))}
        </select>
      </div>

      {/* PURITY */}

      <div>
        <label
          htmlFor="gold-purity"
          className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.2em] text-[#8f867b]"
        >
          Purity
        </label>

        <select
          id="gold-purity"
          name="purity"
          defaultValue={purity}
          className="h-12 w-full border border-[#d8c9b5] bg-white px-4 text-sm text-[#1c1a17] outline-none transition focus:border-[#b08d57] focus:ring-1 focus:ring-[#b08d57]"
        >
          <option value="">
            All Purities
          </option>

          {purityOptions.map(
            (item) => (
              <option
                key={item}
                value={item}
              >
                {item}
              </option>
            )
          )}
        </select>
      </div>

      {/* ACTIONS */}

      <div className="flex items-end gap-2">

        <label className="flex h-12 flex-1 cursor-pointer items-center gap-2 border border-[#d8c9b5] bg-white px-4">
          <input
            type="checkbox"
            name="featured"
            value="true"
            defaultChecked={featured}
            className="h-4 w-4 accent-[#b08d57]"
          />

          <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#4d4943]">
            Featured
          </span>
        </label>

        <button
          type="submit"
          className="h-12 bg-[#b08d57] px-6 text-[10px] font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-[#8f6f3f]"
        >
          Filter
        </button>
      </div>
    </form>
  );
}

/* =========================================================
   GOLD PRODUCT CARD
========================================================= */

function GoldProductCard({
  product,
}: {
  product: Product;
}) {
  const image =
    product.imageUrls?.[0] ||
    product.imageUrl ||
    "";

  return (
    <Link
      href={`/products/${product.slug || product.id}`}
      className="group block"
    >

      <div className="relative aspect-square overflow-hidden border border-[#e5ded2] bg-[#f1ece3]">

        {image ? (
          <Image
            src={image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            unoptimized
            className="object-cover transition duration-700 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[9px] font-medium uppercase tracking-[0.18em] text-[#aaa196]">
            No Image
          </div>
        )}

        {product.featured && (
          <span className="absolute left-3 top-3 bg-[#b08d57] px-3 py-1.5 text-[8px] font-semibold uppercase tracking-[0.16em] text-white sm:text-[9px]">
            Featured
          </span>
        )}

      </div>

      <div className="pt-4">

        <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#b08d57] sm:text-[10px]">
          {product.categoryName ||
            "Gold Jewellery"}
        </p>

        <h3 className="mt-1.5 line-clamp-2 font-display text-base font-normal leading-6 text-[#1c1a17] transition-colors group-hover:text-[#b08d57] sm:text-lg">
          {product.name}
        </h3>

        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[9px] uppercase tracking-widest text-[#918a81] sm:text-[10px]">
          {product.purity && (
            <span>
              {product.purity}
            </span>
          )}
        </div>

        <div className="mt-3 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#4d4943] transition-colors group-hover:text-[#b08d57] sm:text-[10px]">
          View Details
          <span className="ml-1 transition-all duration-300 group-hover:ml-2">
            →
          </span>
        </div>
      </div>
    </Link>
  );
}
