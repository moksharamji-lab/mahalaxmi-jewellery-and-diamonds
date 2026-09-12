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
    category?: string;
  }>;
};

export default async function DiamondPage({
  searchParams,
}: Props) {
  const { category } = await searchParams;

  let products: Product[] = [];
  let categories: Category[] = [];
  let store: Store | null = null;

  // =====================================================
  // LOAD DIAMOND PRODUCTS
  // =====================================================

  try {
    const filters: ProductFilters = {
      collection: "Diamond",
      active: true,
      category: category || undefined,
    };

    products = await getProducts(filters);
  } catch (error) {
    console.error("Failed to load Diamond products:", error);
  }

  // =====================================================
  // LOAD CATEGORIES
  // =====================================================

  try {
    categories = await getCategories();
  } catch (error) {
    console.error("Failed to load categories:", error);
  }

  // =====================================================
  // LOAD DIAMOND STORE
  // =====================================================

  try {
    store = await getStoreByCollection("Diamond");
  } catch (error) {
    console.error("Failed to load Diamond store:", error);
  }

  // =====================================================
  // ACTIVE CATEGORIES
  // =====================================================

  // Categories are shared between Gold and Diamond.
  // The Categories collection does NOT have a collection field.
  const activeCategories = categories.filter(
    (item) => item.active
  );

  const selectedCategory = activeCategories.find(
    (item) => item.id === category
  );

  // =====================================================
  // WHATSAPP
  // =====================================================

  const whatsappMessage = selectedCategory
    ? `Hello, I am interested in your Diamond ${selectedCategory.name} Jewellery Collection.`
    : "Hello, I would like to know more about your Diamond Jewellery Collection.";

  const whatsappUrl = store?.whatsapp
    ? `https://wa.me/${store.whatsapp}?text=${encodeURIComponent(
        whatsappMessage
      )}`
    : "";

  return (
    <main className="min-h-screen bg-[#f8f5ef] text-[#1c1a17]">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="border-b border-[#e5ded2] bg-[#f1ece3]">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-10">

          <div className="flex min-h-[460px] items-center justify-center py-20 sm:min-h-[520px]">

            <div className="max-w-3xl text-center">

              <div className="flex items-center justify-center gap-3 sm:gap-4">

                <span className="h-px w-8 bg-[#b08d57] sm:w-14" />

                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#b08d57] sm:text-xs sm:tracking-[0.4em]">
                  The Diamond Collection
                </p>

                <span className="h-px w-8 bg-[#b08d57] sm:w-14" />

              </div>

              <h1 className="mt-7 font-display text-5xl font-normal leading-[1.05] tracking-[-0.03em] text-[#1c1a17] sm:text-6xl md:text-7xl">

                Brilliant Diamonds

                <span className="mt-2 block text-[#b08d57]">
                  Timelessly Crafted
                </span>

              </h1>

              <p className="mx-auto mt-7 max-w-2xl text-sm leading-7 text-[#777169] sm:text-base sm:leading-8">
                Explore refined diamond jewellery designed
                to celebrate life&apos;s most precious moments
                with brilliance and elegance.
              </p>

              {selectedCategory && (
                <div className="mt-7">

                  <span className="inline-flex items-center border border-[#b08d57] bg-[#f8f5ef] px-4 py-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#b08d57] sm:text-[10px]">
                    Showing: {selectedCategory.name}
                  </span>

                </div>
              )}

              <div className="mx-auto mt-8 flex items-center justify-center gap-3">

                <span className="h-px w-10 bg-[#e5ded2]" />

                <span className="text-sm text-[#b08d57]">
                  ◇
                </span>

                <span className="h-px w-10 bg-[#e5ded2]" />

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* =====================================================
          CATEGORY FILTER
      ===================================================== */}

      <section className="border-b border-[#e5ded2] bg-[#f8f5ef]">

        <div className="mx-auto max-w-[1400px] px-5 py-7 sm:px-8 lg:px-10">

          <div className="flex flex-wrap items-center justify-center gap-2.5">

            {/* ALL DIAMONDS */}

            <Link
              href="/diamond"
              className={`border px-5 py-2.5 text-[9px] font-semibold uppercase tracking-[0.15em] transition-all duration-300 sm:text-[10px] ${
                !category
                  ? "border-[#b08d57] bg-[#b08d57] text-white"
                  : "border-[#e5ded2] bg-[#f1ece3] text-[#777169] hover:border-[#b08d57] hover:text-[#b08d57]"
              }`}
            >
              All Diamonds
            </Link>

            {/* DIAMOND CATEGORIES */}

            {activeCategories.map((item) => (
              <Link
                key={item.id}
                href={`/diamond?category=${encodeURIComponent(
                  item.id
                )}`}
                className={`border px-5 py-2.5 text-[9px] font-semibold uppercase tracking-[0.15em] transition-all duration-300 sm:text-[10px] ${
                  category === item.id
                    ? "border-[#b08d57] bg-[#b08d57] text-white"
                    : "border-[#e5ded2] bg-[#f1ece3] text-[#777169] hover:border-[#b08d57] hover:text-[#b08d57]"
                }`}
              >
                {item.name}
              </Link>
            ))}

          </div>

        </div>

      </section>

      {/* =====================================================
          PRODUCTS
      ===================================================== */}

      <section className="bg-[#f8f5ef]">

        <div className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 sm:py-20 lg:px-10">

          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#b08d57] sm:text-xs">
                {selectedCategory?.name || "Explore"}
              </p>

              <h2 className="mt-2 font-display text-3xl font-normal text-[#1c1a17] sm:text-4xl">
                {selectedCategory
                  ? `${selectedCategory.name} Jewellery`
                  : "Diamond Collection"}
              </h2>

            </div>

            <div className="flex items-center gap-5">

              <p className="text-[9px] uppercase tracking-[0.15em] text-[#918a81] sm:text-[10px]">
                {products.length}{" "}
                {products.length === 1
                  ? "Piece"
                  : "Pieces"}
              </p>

              {category && (
                <Link
                  href="/diamond"
                  className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#b08d57] transition-colors hover:text-[#8f6f3f] sm:text-[10px]"
                >
                  Clear Filter →
                </Link>
              )}

            </div>

          </div>

          {/* =================================================
              PRODUCTS / EMPTY STATE
          ================================================= */}

          {products.length === 0 ? (

            <div className="border border-[#e5ded2] bg-[#f1ece3] px-6 py-24 text-center">

              <div className="text-3xl text-[#b08d57]">
                ◇
              </div>

              <h2 className="mt-5 font-display text-2xl font-normal text-[#1c1a17] sm:text-3xl">
                No Products Found
              </h2>

              <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#777169]">
                We currently don&apos;t have any active
                Diamond jewellery products in this
                category.
              </p>

              {category && (
                <Link
                  href="/diamond"
                  className="mt-8 inline-flex min-h-[50px] items-center justify-center bg-[#b08d57] px-7 text-[10px] font-semibold uppercase tracking-[0.18em] text-white transition-all duration-300 hover:bg-[#8f6f3f] sm:text-xs"
                >
                  View All Diamond Jewellery
                </Link>
              )}

            </div>

          ) : (

            <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">

              {products.map((product) => (
                <DiamondProductCard
                  key={product.id}
                  product={product}
                />
              ))}

            </div>

          )}

        </div>

      </section>

      {/* =====================================================
          DIAMOND STORE
      ===================================================== */}

      <section className="border-t border-[#e5ded2] bg-[#f1ece3]">

        <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 sm:py-24 lg:px-10">

          <div className="mx-auto mb-12 max-w-2xl text-center">

            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#b08d57] sm:text-xs sm:tracking-[0.4em]">
              Visit Our Store
            </p>

            <h2 className="mt-4 font-display text-4xl font-normal text-[#1c1a17] sm:text-5xl">
              Find Something Brilliant
            </h2>

            <div className="mx-auto mt-5 h-px w-12 bg-[#b08d57]" />

            <p className="mt-5 text-sm leading-7 text-[#777169] sm:text-base">
              Visit our Diamond store and explore our
              collection in person.
            </p>

          </div>

          <div className="mx-auto max-w-4xl border border-[#e5ded2] bg-[#f8f5ef] p-7 sm:p-9 md:p-10">

            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#b08d57] sm:text-xs">
              Diamond Jewellery
            </p>

            <h3 className="mt-4 font-display text-3xl font-normal text-[#1c1a17] sm:text-4xl">
              {store?.name || "Mahalaxmi Diamond Store"}
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
                  className="flex min-h-[50px] flex-1 items-center justify-center bg-[#b08d57] px-5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white transition-all duration-300 hover:bg-[#8f6f3f] sm:text-xs"
                >
                  WhatsApp Store
                </a>
              )}

              {store?.googleMapsUrl && (
                <a
                  href={store.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-[50px] flex-1 items-center justify-center border border-[#b08d57] px-5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#1c1a17] transition-all duration-300 hover:bg-[#b08d57] hover:text-white sm:text-xs"
                >
                  View Store Location
                </a>
              )}

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          GOLD CTA
      ===================================================== */}

      <section className="border-t border-[#e5ded2] bg-[#f8f5ef]">

        <div className="mx-auto max-w-4xl px-5 py-20 text-center sm:px-8 sm:py-24">

          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#b08d57] sm:text-xs sm:tracking-[0.4em]">
            Discover More
          </p>

          <h2 className="mt-4 font-display text-4xl font-normal text-[#1c1a17] sm:text-5xl">
            Looking For Gold?
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#777169] sm:text-base">
            Discover timeless gold jewellery crafted
            to become part of your most beautiful
            moments.
          </p>

          <div className="mt-8">

            <Link
              href="/gold"
              className="inline-flex min-h-[52px] items-center justify-center bg-[#b08d57] px-8 text-xs font-semibold uppercase tracking-[0.18em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#8f6f3f]"
            >
              Explore Gold
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
}

/* =========================================================
   DIAMOND PRODUCT CARD
========================================================= */

function DiamondProductCard({
  product,
}: {
  product: Product;
}) {
  const productImage =
    product.imageUrls?.[0] ||
    product.imageUrl ||
    "";

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block"
    >

      <div className="relative aspect-square overflow-hidden border border-[#e5ded2] bg-[#f1ece3]">

        {productImage ? (
          <img
            src={productImage}
            alt={product.name}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-5xl text-[#b08d57]">
              ◇
            </span>
          </div>
        )}

        <span className="absolute left-3 top-3 bg-[#b08d57] px-3 py-1.5 text-[8px] font-semibold uppercase tracking-[0.16em] text-white sm:text-[9px]">
          New
        </span>

        {product.featured && (
          <span className="absolute right-3 top-3 border border-[#e5ded2] bg-[#f8f5ef]/95 px-3 py-1.5 text-[8px] font-semibold uppercase tracking-[0.16em] text-[#b08d57] backdrop-blur sm:text-[9px]">
            Featured
          </span>
        )}

      </div>

      <div className="pt-4">

        <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#b08d57] sm:text-[10px]">
          {product.categoryName || "Diamond Jewellery"}
        </p>

        <h3 className="mt-1.5 line-clamp-2 font-display text-base font-normal leading-6 text-[#1c1a17] transition-colors group-hover:text-[#b08d57] sm:text-lg">
          {product.name}
        </h3>

        {product.brandName && (
          <p className="mt-2 text-[10px] uppercase tracking-[0.08em] text-[#918a81]">
            {product.brandName}
          </p>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[9px] uppercase tracking-[0.1em] text-[#918a81] sm:text-[10px]">

          {product.purity && (
            <span>
              {product.purity}
            </span>
          )}

          {product.weight > 0 && (
            <span>
              {product.weight} g
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