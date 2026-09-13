import Link from "next/link";

import {
  getStores,
  type Store,
} from "@/services/store.service";

import { getProducts } from "@/services/product.service";
import type { Product } from "@/types/product";

import { getHeroSlides } from "@/services/hero-slide.service";
import type { HeroSlide } from "@/types/hero-slide";

import HeroSlider from "@/components/public/HeroSlider";

export default async function HomePage() {
  let stores: Store[] = [];
  let newestProducts: Product[] = [];
  let heroSlides: HeroSlide[] = [];

  /* =====================================================
     LOAD STORES
  ===================================================== */

  try {
    stores = await getStores();
  } catch (error) {
    console.error("Failed to load stores:", error);
  }

  /* =====================================================
     LOAD NEWEST PRODUCTS
  ===================================================== */

  try {
    newestProducts = await getProducts({
      active: true,
    });

    newestProducts = newestProducts.slice(0, 4);
  } catch (error) {
    console.error("Failed to load newest products:", error);
  }

  /* =====================================================
     LOAD HERO SLIDES
  ===================================================== */

  try {
    heroSlides = await getHeroSlides();
  } catch (error) {
    console.error("Failed to load hero slides:", error);
  }

  /* =====================================================
     ACTIVE HERO SLIDES
  ===================================================== */

  const activeHeroSlides = heroSlides
  .filter(
    (slide) =>
      slide.active &&
      slide.page === "Home" &&
      (slide.videoUrl || slide.imageUrl)
  )
  .sort(
    (a, b) => a.order - b.order
  );

  /* =====================================================
     FIND STORES
  ===================================================== */

  const goldStore = stores.find(
    (store) => store.collection === "Gold"
  );

  const diamondStore = stores.find(
    (store) => store.collection === "Diamond"
  );

  return (
    <main className="min-h-screen bg-[#f8f5ef] text-[#1c1a17]">

      {/* =================================================
          HERO
      ================================================= */}

      <HeroSlider slides={activeHeroSlides} />

      {/* =================================================
          FEATURED COLLECTION
      ================================================= */}

      <section className="border-b border-[#e5ded2] bg-[#f8f5ef]">

        <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 sm:py-24 lg:px-10">

          {/* Section heading */}

          <div className="mx-auto mb-12 max-w-2xl text-center">

            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#b08d57] sm:text-xs sm:tracking-[0.4em]">
              Curated For You
            </p>

            <h2 className="mt-4 font-display text-4xl font-normal tracking-[-0.02em] text-[#1c1a17] sm:text-5xl">
              Featured Collection
            </h2>

            <div className="mx-auto mt-5 h-px w-12 bg-[#b08d57]" />

            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#777169] sm:text-base">
              Discover our latest jewellery pieces,
              thoughtfully selected for timeless beauty
              and everyday elegance.
            </p>

          </div>

          {/* Products */}

          {newestProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">

                {newestProducts.map((product) => {

                  const productImage =
                    product.imageUrls?.[0] ||
                    product.imageUrl ||
                    "";

                  return (
                    <Link
                      key={product.id}
                      href={`/products/${product.slug}`}
                      className="group"
                    >

                      {/* Product image */}

                      <div className="relative aspect-square overflow-hidden border border-[#e5ded2] bg-[#f1ece3]">

                        {productImage ? (
                          <img
                            src={productImage}
                            alt={product.name}
                            className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs uppercase tracking-[0.15em] text-[#aaa196]">
                            No Image
                          </div>
                        )}

                        {/* New badge */}

                        <span className="absolute left-3 top-3 bg-[#b08d57] px-3 py-1.5 text-[8px] font-semibold uppercase tracking-[0.16em] text-white sm:text-[9px]">
                          New
                        </span>

                      </div>

                      {/* Product information */}

                      <div className="pt-4">

                        <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-[#b08d57] sm:text-[10px]">
                          {product.collection}
                        </p>

                        <h3 className="mt-1.5 line-clamp-2 font-display text-base font-normal leading-6 text-[#1c1a17] transition-colors group-hover:text-[#b08d57] sm:text-lg">
                          {product.name}
                        </h3>

                        <div className="mt-2 flex items-center gap-3 text-[10px] uppercase tracking-[0.08em] text-[#918a81] sm:text-xs">

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

                      </div>

                    </Link>
                  );
                })}

              </div>

              {/* View all */}

              <div className="mt-10 text-center">

                <Link
                  href="/categories"
                  className="inline-flex items-center gap-2 border-b border-[#b08d57] pb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#1c1a17] transition-colors hover:text-[#b08d57] sm:text-xs"
                >
                  View All Collections

                  <span>
                    →
                  </span>

                </Link>

              </div>

            </>
          ) : (

            /* Empty state */

            <div className="border border-[#e5ded2] bg-[#f1ece3] px-6 py-20 text-center">

              <div className="text-2xl text-[#b08d57]">
                ✦
              </div>

              <h3 className="mt-4 font-display text-2xl text-[#1c1a17]">
                Beautiful Things Are Coming
              </h3>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#777169]">
                Explore our exclusive jewellery
                collection as we continue adding
                beautiful new pieces.
              </p>

            </div>
          )}

        </div>
      </section>

      {/* =================================================
          OUR STORY
      ================================================= */}

      <section className="border-b border-[#e5ded2] bg-[#f1ece3]">

        <div className="mx-auto max-w-[1200px] px-5 py-20 sm:px-8 sm:py-24 lg:px-10">

          <div className="mx-auto max-w-3xl text-center">

            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#b08d57] sm:text-xs sm:tracking-[0.4em]">
              Our Story
            </p>

            <h2 className="mt-4 font-display text-4xl font-normal tracking-[-0.02em] text-[#1c1a17] sm:text-5xl">
              Tradition Meets Elegance
            </h2>

            <div className="mx-auto mt-5 h-px w-12 bg-[#b08d57]" />

            <p className="mt-7 text-sm leading-8 text-[#777169] sm:text-base sm:leading-8">
              Mahalaxmi Jewels brings together timeless
              craftsmanship and contemporary design to
              create jewellery for life&apos;s most memorable
              moments.
            </p>

            <p className="mt-5 text-sm leading-8 text-[#777169] sm:text-base sm:leading-8">
              From classic gold jewellery to elegant
              diamond creations, every piece is selected
              with an appreciation for beauty, detail and
              lasting elegance.
            </p>

            <div className="mt-8">

              <Link
                href="/categories"
                className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#1c1a17] transition-colors hover:text-[#b08d57] sm:text-xs"
              >
                Explore Our Collections

                <span>
                  →
                </span>

              </Link>

            </div>

          </div>

        </div>
      </section>

      {/* =================================================
          COLLECTIONS
      ================================================= */}

      <section className="border-b border-[#e5ded2] bg-[#f8f5ef]">

        <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 sm:py-24 lg:px-10">

          <div className="mb-12 text-center">

            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#b08d57] sm:text-xs sm:tracking-[0.4em]">
              Discover
            </p>

            <h2 className="mt-4 font-display text-4xl font-normal text-[#1c1a17] sm:text-5xl">
              Our Collections
            </h2>

          </div>

          <div className="grid gap-5 md:grid-cols-2">

            {/* Gold Collection */}

            <Link
              href="/gold"
              className="group border border-[#e5ded2] bg-[#f1ece3] p-8 transition-all duration-500 hover:-translate-y-1 hover:border-[#b08d57] sm:p-10 lg:p-12"
            >

              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#b08d57]">
                Collection
              </p>

              <h3 className="mt-4 font-display text-3xl font-normal text-[#1c1a17] sm:text-4xl">
                Gold Jewellery
              </h3>

              <div className="mt-5 h-px w-10 bg-[#b08d57] transition-all duration-300 group-hover:w-16" />

              <p className="mt-5 max-w-lg text-sm leading-7 text-[#777169]">
                Discover timeless gold jewellery designed
                for every special occasion, from everyday
                elegance to unforgettable celebrations.
              </p>

              <div className="mt-7 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#1c1a17] transition-colors group-hover:text-[#b08d57] sm:text-xs">
                Explore Gold

                <span className="ml-2 transition-all duration-300 group-hover:ml-4">
                  →
                </span>
              </div>

            </Link>

            {/* Diamond Collection */}

            <Link
              href="/diamond"
              className="group border border-[#e5ded2] bg-[#f1ece3] p-8 transition-all duration-500 hover:-translate-y-1 hover:border-[#b08d57] sm:p-10 lg:p-12"
            >

              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#b08d57]">
                Collection
              </p>

              <h3 className="mt-4 font-display text-3xl font-normal text-[#1c1a17] sm:text-4xl">
                Diamond Jewellery
              </h3>

              <div className="mt-5 h-px w-10 bg-[#b08d57] transition-all duration-300 group-hover:w-16" />

              <p className="mt-5 max-w-lg text-sm leading-7 text-[#777169]">
                Explore elegant diamond jewellery crafted
                to bring brilliance and sophistication to
                every special occasion.
              </p>

              <div className="mt-7 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#1c1a17] transition-colors group-hover:text-[#b08d57] sm:text-xs">
                Explore Diamonds

                <span className="ml-2 transition-all duration-300 group-hover:ml-4">
                  →
                </span>
              </div>

            </Link>

          </div>
        </div>
      </section>

      {/* =================================================
          VISIT US
      ================================================= */}

      <section className="bg-[#f1ece3]">

        <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 sm:py-24 lg:px-10">

          {/* Heading */}

          <div className="mx-auto mb-12 max-w-2xl text-center">

            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#b08d57] sm:text-xs sm:tracking-[0.4em]">
              Visit Us
            </p>

            <h2 className="mt-4 font-display text-4xl font-normal text-[#1c1a17] sm:text-5xl">
              Let&apos;s Find Something Beautiful
            </h2>

            <div className="mx-auto mt-5 h-px w-12 bg-[#b08d57]" />

            <p className="mt-5 text-sm leading-7 text-[#777169] sm:text-base">
              Visit our stores and explore our Gold and
              Diamond collections in person.
            </p>

          </div>

          {/* Stores */}

          <div className="grid gap-5 md:grid-cols-2">

            <StoreCard
              collection="Gold"
              store={goldStore}
            />

            <StoreCard
              collection="Diamond"
              store={diamondStore}
            />

          </div>

          {/* Contact */}

          <div className="mt-10 text-center">

            <Link
              href="/contact"
              className="inline-flex min-h-[50px] items-center justify-center bg-[#b08d57] px-8 text-[10px] font-semibold uppercase tracking-[0.2em] text-white transition-all duration-300 hover:bg-[#8f6f3f] sm:text-xs"
            >
              Contact Us
            </Link>

          </div>

        </div>
      </section>

    </main>
  );
}

/* =========================================================
   STORE CARD
========================================================= */

function StoreCard({
  collection,
  store,
}: {
  collection: "Gold" | "Diamond";
  store: Store | undefined;
}) {
  const fallbackName =
    collection === "Gold"
      ? "Gold Jewellery Store"
      : "Diamond Jewellery Store";

  /* =====================================================
     WHATSAPP
  ===================================================== */

  const whatsappUrl = store?.whatsapp
    ? `https://wa.me/${store.whatsapp}`
    : "";

  const whatsappMessage =
    `Hello, I would like to know more about your ${collection} Jewellery Collection.`;

  const whatsappUrlWithMessage = whatsappUrl
    ? `${whatsappUrl}?text=${encodeURIComponent(
        whatsappMessage
      )}`
    : "";

  return (
    <div className="group border border-[#e5ded2] bg-[#f8f5ef] p-7 transition-all duration-500 hover:border-[#b08d57] sm:p-9 lg:p-10">

      {/* =================================================
          STORE LOGO + STORE NAME
      ================================================= */}

      <div className="flex items-center gap-5">

        {/* Store Logo */}

        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#b08d57]/30 bg-[#f1ece3] p-3 sm:h-24 sm:w-24">

          {store?.logo ? (
            <img
              src={store.logo}
              alt={`${store.name || collection} logo`}
              className="h-full w-full object-contain"
            />
          ) : (
            <span className="font-display text-2xl text-[#b08d57]">
              {collection === "Gold"
                ? "G"
                : "D"}
            </span>
          )}

        </div>

        {/* Store heading */}

        <div className="min-w-0">

          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#b08d57] sm:text-xs">
            {collection} Store
          </p>

          <h3 className="mt-2 font-display text-2xl font-normal leading-tight text-[#1c1a17] sm:text-3xl">
            {store?.name || fallbackName}
          </h3>

        </div>

      </div>

      {/* Divider */}

      <div className="mt-6 h-px w-10 bg-[#b08d57]" />

      {/* Description */}

      {store?.description && (
        <p className="mt-5 max-w-xl text-sm leading-7 text-[#777169] sm:text-base">
          {store.description}
        </p>
      )}

      {/* Store information */}

      <div className="mt-7 space-y-6">

        {/* Address */}

        <div>

          <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#9b9389]">
            Address
          </p>

          <p className="mt-2 text-sm leading-6 text-[#4d4943] sm:text-base">
            {store?.address ||
              "Store address coming soon"}
          </p>

        </div>

        {/* Phone */}

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

      {/* Store actions */}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">

        {/* WhatsApp */}

        {whatsappUrlWithMessage && (
          <a
            href={whatsappUrlWithMessage}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-[48px] flex-1 items-center justify-center bg-[#b08d57] px-5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#8f6f3f] sm:text-xs"
          >
            WhatsApp
          </a>
        )}

        {/* Google Maps */}

        {store?.googleMapsUrl && (
          <a
            href={store.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-[48px] flex-1 items-center justify-center border border-[#b08d57] px-5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#1c1a17] transition-colors hover:bg-[#b08d57] hover:text-white sm:text-xs"
          >
            View Location
          </a>
        )}

      </div>

      {/* Collection link */}

      <Link
        href={
          collection === "Gold"
            ? "/gold"
            : "/diamond"
        }
        className="mt-3 flex min-h-[48px] items-center justify-center border border-[#e5ded2] px-5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#4d4943] transition-colors hover:border-[#b08d57] hover:text-[#b08d57] sm:text-xs"
      >
        View {collection} Collection

        <span className="ml-2">
          →
        </span>
      </Link>

    </div>
  );
}