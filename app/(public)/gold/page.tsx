import Link from "next/link";

import { getProducts } from "@/services/product.service";
import type { Product } from "@/types/product";

export default async function GoldPage() {
  let products: Product[] = [];

  try {
    products = await getProducts({
      collection: "Gold",
      active: true,
    });
  } catch (error) {
    console.error("Failed to load gold products:", error);
  }

  return (
    <main className="min-h-screen bg-[#f8f5ef] text-[#1c1a17]">

      {/* =====================================================
          PAGE HERO
      ===================================================== */}

      <section className="border-b border-[#e5ded2] bg-[#f1ece3]">

        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-10">

          <div className="flex min-h-[460px] items-center justify-center py-20 sm:min-h-[520px]">

            <div className="max-w-3xl text-center">

              {/* Label */}

              <div className="flex items-center justify-center gap-3 sm:gap-4">

                <span className="h-px w-8 bg-[#b08d57] sm:w-14" />

                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#b08d57] sm:text-xs sm:tracking-[0.4em]">
                  The Gold Collection
                </p>

                <span className="h-px w-8 bg-[#b08d57] sm:w-14" />

              </div>

              {/* Heading */}

              <h1 className="mt-7 font-display text-5xl font-normal leading-[1.05] tracking-[-0.03em] text-[#1c1a17] sm:text-6xl md:text-7xl">

                Timeless Gold

                <span className="mt-2 block text-[#b08d57]">
                  Jewellery
                </span>

              </h1>

              {/* Description */}

              <p className="mx-auto mt-7 max-w-2xl text-sm leading-7 text-[#777169] sm:text-base sm:leading-8">
                Discover our collection of beautifully
                crafted gold jewellery, created to become
                part of your most treasured moments.
              </p>

              {/* Decorative */}

              <div className="mx-auto mt-8 flex items-center justify-center gap-3">

                <span className="h-px w-10 bg-[#e5ded2]" />

                <span className="text-sm text-[#b08d57]">
                  ✦
                </span>

                <span className="h-px w-10 bg-[#e5ded2]" />

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          PRODUCTS
      ===================================================== */}

      <section className="bg-[#f8f5ef]">

        <div className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 sm:py-20 lg:px-10">

          {/* Header */}

          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#b08d57] sm:text-xs">
                Explore
              </p>

              <h2 className="mt-2 font-display text-3xl font-normal text-[#1c1a17] sm:text-4xl">
                Gold Collection
              </h2>

            </div>

            <p className="text-xs uppercase tracking-[0.12em] text-[#918a81]">
              {products.length}{" "}
              {products.length === 1
                ? "Piece"
                : "Pieces"}
            </p>

          </div>

          {/* =================================================
              PRODUCT GRID
          ================================================= */}

          {products.length > 0 ? (

            <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">

              {products.map((product) => (
                <GoldProductCard
                  key={product.id}
                  product={product}
                />
              ))}

            </div>

          ) : (

            /* Empty state */

            <div className="border border-[#e5ded2] bg-[#f1ece3] px-6 py-24 text-center">

              <div className="text-2xl text-[#b08d57]">
                ✦
              </div>

              <h3 className="mt-4 font-display text-2xl font-normal text-[#1c1a17]">
                Gold Collection Coming Soon
              </h3>

              <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#777169]">
                We are adding beautiful gold jewellery
                pieces to our collection. Please check
                back soon.
              </p>

            </div>

          )}

        </div>

      </section>

      {/* =====================================================
          COLLECTION CTA
      ===================================================== */}

      <section className="border-t border-[#e5ded2] bg-[#f1ece3]">

        <div className="mx-auto max-w-4xl px-5 py-20 text-center sm:px-8 sm:py-24">

          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#b08d57] sm:text-xs sm:tracking-[0.4em]">
            Discover More
          </p>

          <h2 className="mt-4 font-display text-4xl font-normal text-[#1c1a17] sm:text-5xl">
            Looking For Diamonds?
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#777169] sm:text-base">
            Explore our elegant diamond jewellery
            collection and discover pieces designed to
            shine through every occasion.
          </p>

          <div className="mt-8">

            <Link
              href="/diamond"
              className="inline-flex min-h-[52px] items-center justify-center bg-[#b08d57] px-8 text-xs font-semibold uppercase tracking-[0.18em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#8f6f3f]"
            >
              Explore Diamonds
            </Link>

          </div>

        </div>

      </section>

    </main>
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
      href={`/products/${product.slug}`}
      className="group block"
    >

      {/* =================================================
          IMAGE
      ================================================= */}

      <div className="relative aspect-square overflow-hidden border border-[#e5ded2] bg-[#f1ece3]">

        {image ? (
          <img
            src={image}
            alt={product.name}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[9px] font-medium uppercase tracking-[0.18em] text-[#aaa196]">
            No Image
          </div>
        )}

        {/* Featured badge */}

        {product.featured && (
          <span className="absolute left-3 top-3 bg-[#b08d57] px-3 py-1.5 text-[8px] font-semibold uppercase tracking-[0.16em] text-white sm:text-[9px]">
            Featured
          </span>
        )}

      </div>

      {/* =================================================
          PRODUCT DETAILS
      ================================================= */}

      <div className="pt-4">

        {/* Collection */}

        <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#b08d57] sm:text-[10px]">
          Gold Jewellery
        </p>

        {/* Product name */}

        <h3 className="mt-1.5 line-clamp-2 font-display text-base font-normal leading-6 text-[#1c1a17] transition-colors group-hover:text-[#b08d57] sm:text-lg">
          {product.name}
        </h3>

        {/* Product info */}

        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[9px] uppercase tracking-[0.1em] text-[#918a81] sm:text-[10px]">

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

        {/* View product */}

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