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
    const savedWishlist = getWishlist();

    setProducts(savedWishlist);
    setIsLoaded(true);
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
      <section className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <div className="mb-10">
          <p className="text-sm uppercase tracking-[0.3em] text-[#b08a3c]">
            Your Collection
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[#1c1a17] md:text-5xl">
            My Wishlist
          </h1>

          <p className="mt-4 text-[#6f685e]">
            Your favourite jewellery pieces saved in one place.
          </p>
        </div>

        <div className="flex min-h-[300px] items-center justify-center rounded-3xl border border-[#dfd5c4] bg-white">
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
    <section className="mx-auto max-w-7xl px-6 py-16 md:py-20">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="mb-10">
        <p className="text-sm uppercase tracking-[0.3em] text-[#b08a3c]">
          Your Collection
        </p>

        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[#1c1a17] md:text-5xl">
          My Wishlist
        </h1>

        <p className="mt-4 text-[#6f685e]">
          Your favourite jewellery pieces saved in one place.
        </p>
      </div>

      {/* =====================================================
          EMPTY WISHLIST
      ===================================================== */}

      {products.length === 0 ? (
        <div className="rounded-3xl border border-[#dfd5c4] bg-white px-6 py-20 text-center shadow-[0_15px_50px_rgba(80,60,30,0.06)]">

          <div className="text-6xl font-light text-[#b08a3c]">
            ♡
          </div>

          <h2 className="mt-6 text-2xl font-semibold text-[#1c1a17]">
            Your wishlist is empty
          </h2>

          <p className="mx-auto mt-3 max-w-md leading-7 text-[#6f685e]">
            Browse our Gold and Diamond collections and save
            jewellery you love.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">

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

          <div className="mb-6 text-sm text-[#8a8174]">
            {products.length}{" "}
            {products.length === 1 ? "item" : "items"} saved
          </div>

          {/* =================================================
              PRODUCT GRID
          ================================================= */}

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

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

                  <Link href={productUrl}>
                    <div className="relative aspect-square overflow-hidden bg-[#eee8dc]">

                      {productImage ? (
                        <Image
                          src={productImage}
                          alt={product.name}
                          fill
                          unoptimized
                          className="object-cover transition duration-500 hover:scale-105"
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

                  <div className="p-5">

                    {/* Collection */}

                    <p className="text-xs uppercase tracking-[0.2em] text-[#b08a3c]">
                      {product.collection ||
                        "Jewellery"}
                    </p>

                    {/* Product Name */}

                    <Link href={productUrl}>
                      <h2 className="mt-2 text-lg font-semibold text-[#1c1a17] transition hover:text-[#b08a3c]">
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

                    <div className="mt-5 flex gap-3">

                      <Link
                        href={productUrl}
                        className="flex-1 rounded-lg bg-[#b08a3c] px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#98742f]"
                      >
                        View Product
                      </Link>

                      <button
                        type="button"
                        onClick={() =>
                          handleRemove(product.id)
                        }
                        className="rounded-lg border border-[#c9b9a2] px-4 py-3 text-sm font-semibold text-[#6f685e] transition hover:border-[#b08a3c] hover:bg-[#f3eee6] hover:text-[#1c1a17]"
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