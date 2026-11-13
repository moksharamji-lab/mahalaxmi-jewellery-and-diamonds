
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types/product";

import {
  getWishlist,
  removeFromWishlist,
} from "@/lib/wishlist";

export default function WishlistPageClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  /* =========================================================
     LOAD WISHLIST
  ========================================================= */

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const savedWishlist = getWishlist();

      setProducts(savedWishlist);
      setIsLoaded(true);
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  /* =========================================================
     REMOVE FROM WISHLIST
  ========================================================= */

  function handleRemove(productId: string) {
    removeFromWishlist(productId);

    setProducts((current) =>
      current.filter(
        (product) => product.id !== productId
      )
    );
  }

  /* =========================================================
     LOADING STATE
  ========================================================= */

  if (!isLoaded) {
    return (
      <section className="mx-auto max-w-7xl px-4 pt-32 pb-10 sm:px-6 sm:py-16">
        <div className="mb-8 sm:mb-10">
          <p className="text-xs uppercase tracking-[0.3em] text-[#b08a3c] sm:text-sm">
            Your Collection
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#1c1a17] sm:text-4xl md:text-5xl">
            My Wishlist
          </h1>

          <p className="mt-3 text-sm text-[#6f685e] sm:text-base">
            Your favourite jewellery pieces saved in one place.
          </p>
        </div>

        <div className="flex min-h-[250px] items-center justify-center rounded-3xl border border-[#dfd5c4] bg-white">
          <div className="text-center">
            <div className="mx-auto mb-5 h-8 w-8 animate-spin rounded-full border-2 border-[#dfd5c4] border-t-[#b08a3c]" />

            <p className="text-sm text-[#8a8174]">
              Loading your wishlist...
            </p>
          </div>
        </div>
      </section>
    );
  }

  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-16">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="mb-8 sm:mb-10">
        <p className="text-xs uppercase tracking-[0.3em] text-[#b08a3c] sm:text-sm">
          Your Collection
        </p>

        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#1c1a17] sm:text-4xl md:text-5xl">
          My Wishlist
        </h1>

        <p className="mt-3 text-sm text-[#6f685e] sm:mt-4 sm:text-base">
          Your favourite jewellery pieces saved in one place.
        </p>
      </div>

      {/* =====================================================
          EMPTY WISHLIST
      ===================================================== */}

      {products.length === 0 ? (
        <div className="rounded-3xl border border-[#dfd5c4] bg-white px-5 py-14 text-center shadow-[0_15px_50px_rgba(80,60,30,0.06)] sm:px-6 sm:py-20">

          <div className="text-5xl font-light text-[#b08a3c] sm:text-6xl">
            💛
          </div>

          <h2 className="mt-6 text-xl font-semibold text-[#1c1a17] sm:text-2xl">
            Your wishlist is empty
          </h2>

          <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#6f685e] sm:text-base">
            Browse our Gold and Diamond collections and save
            jewellery you love.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">

            <Link
              href="/gold"
              className="rounded-xl bg-[#b08a3c] px-6 py-4 text-center font-semibold text-white transition hover:bg-[#98742f]"
            >
              Explore Gold
            </Link>

            <Link
              href="/diamond"
              className="rounded-xl border border-[#b08a3c] px-6 py-4 text-center font-semibold text-[#9a762f] transition hover:bg-[#b08a3c] hover:text-white"
            >
              Explore Diamonds
            </Link>

          </div>
        </div>
      ) : (
        <>

          {/* =================================================
              ITEM COUNT
          ================================================= */}

          <div className="mb-5 text-sm text-[#8a8174] sm:mb-6">
            {products.length}{" "}
            {products.length === 1 ? "item" : "items"} saved
          </div>

          {/* =================================================
              PRODUCT GRID
          ================================================= */}

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">

            {products.map((product) => {
              const productUrl = `/products/${
                product.slug || product.id
              }`;

              const productImage =
                product.imageUrls?.[0] ||
                product.imageUrl ||
                "";

              return (
                <div
                  key={product.id}
                  className="overflow-hidden rounded-2xl border border-[#dfd5c4] bg-white shadow-[0_12px_40px_rgba(80,60,30,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(80,60,30,0.1)]"
                >

                  {/* =================================================
                      PRODUCT IMAGE
                  ================================================= */}

                  <Link
                    href={productUrl}
                    aria-label={`View ${product.name}`}
                  >
                    <div className="relative h-52 overflow-hidden bg-[#eee8dc] sm:h-60 lg:h-64">

                      {productImage ? (
                        <Image
                          src={productImage}
                          alt={product.name}
                          fill
                          unoptimized
                          className="object-contain p-3 transition duration-300 hover:scale-[1.03]"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm text-[#9b917f]">
                          No image
                        </div>
                      )}

                    </div>
                  </Link>

                  {/* =================================================
                      PRODUCT INFORMATION
                  ================================================= */}

                  <div className="p-4 sm:p-5">

                    {/* Collection */}

                    <p className="text-xs uppercase tracking-[0.2em] text-[#b08a3c]">
                      {product.collection || "Jewellery"}
                    </p>

                    {/* Product Name */}

                    <Link href={productUrl}>
                      <h2 className="mt-2 line-clamp-2 text-base font-semibold text-[#1c1a17] transition hover:text-[#b08a3c] sm:text-lg">
                        {product.name}
                      </h2>
                    </Link>

                    {/* Category */}

                    {product.categoryName && (
                      <p className="mt-1 text-sm text-[#8a8174]">
                        {product.categoryName}
                      </p>
                    )}

                    {/* Purity */}

                    {product.purity && (
                      <p className="mt-3 text-xs uppercase tracking-[0.15em] text-[#9b917f]">
                        {product.purity}
                      </p>
                    )}

                    {/* =================================================
                        BUTTONS
                    ================================================= */}

                    <div className="mt-4 flex gap-2 sm:mt-5 sm:gap-3">

                      <Link
                        href={productUrl}
                        className="flex-1 rounded-lg bg-[#b08a3c] px-3 py-3 text-center text-xs font-semibold text-white transition hover:bg-[#98742f] sm:px-4 sm:text-sm"
                      >
                        View Product
                      </Link>

                      <button
                        type="button"
                        onClick={() =>
                          handleRemove(product.id)
                        }
                        className="rounded-lg border border-[#c9b9a2] px-3 py-3 text-xs font-semibold text-[#6f685e] transition hover:border-[#b08a3c] hover:bg-[#f3eee6] hover:text-[#1c1a17] sm:px-4 sm:text-sm"
                      >
                        Remove
                      </button>

                    </div>
                  </div>
                </div>
              );
            })}

          </div>
        </>
      )}
    </section>
  );
}
