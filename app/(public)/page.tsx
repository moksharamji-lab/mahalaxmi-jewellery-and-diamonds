import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/components/public/ScrollReveal";

import {
  getStores,
  type Store,
} from "@/services/store.service";

import { getProducts } from "@/services/product.service";
import type { Product } from "@/types/product";

import { getHeroSlides } from "@/services/hero-slide.service";
import type { HeroSlide } from "@/types/hero-slide";

import { getOurStory } from "@/services/our-story.service";
import type { OurStory } from "@/types/our-story";

import HeroSlider from "@/components/public/HeroSlider";

export default async function HomePage() {
  let stores: Store[] = [];
  let newestProducts: Product[] = [];
  let heroSlides: HeroSlide[] = [];
  let ourStory: OurStory | null = null;

  /* =====================================================
     LOAD STORES
  ===================================================== */

  try {
    stores = await getStores();
  } catch (error) {
    console.error(
      "Failed to load stores:",
      error
    );
  }

  /* =====================================================
     LOAD NEWEST PRODUCTS
  ===================================================== */

  try {
    newestProducts = await getProducts({
      active: true,
    });

    newestProducts =
      newestProducts.slice(0, 4);
  } catch (error) {
    console.error(
      "Failed to load newest products:",
      error
    );
  }

  /* =====================================================
     LOAD HERO SLIDES
  ===================================================== */

  try {
    heroSlides = await getHeroSlides();
  } catch (error) {
    console.error(
      "Failed to load hero slides:",
      error
    );
  }

  /* =====================================================
     LOAD OUR STORY
  ===================================================== */

  try {
    ourStory = await getOurStory();
  } catch (error) {
    console.error(
      "Failed to load Our Story:",
      error
    );
  }

  /* =====================================================
     ACTIVE HERO SLIDES
  ===================================================== */

  const activeHeroSlides =
    heroSlides
      .filter(
        (slide) =>
          slide.active &&
          slide.page === "Home" &&
          (slide.videoUrl ||
            slide.imageUrl)
      )
      .sort(
        (a, b) =>
          a.order - b.order
      );

  /* =====================================================
     FIND STORES
  ===================================================== */

  const goldStore =
    stores.find(
      (store) =>
        store.collection === "Gold"
    );

  const diamondStore =
    stores.find(
      (store) =>
        store.collection ===
        "Diamond"
    );

  /* =====================================================
     OUR STORY CONTENT
  ===================================================== */

  const storyTitle =
    ourStory?.title ||
    "Tradition Meets Elegance";

  const storyParagraphOne =
    ourStory?.paragraphOne ||
    "Mahalaxmi Jewels brings together timeless craftsmanship and contemporary design to create jewellery for life's most memorable moments.";

  const storyParagraphTwo =
    ourStory?.paragraphTwo ||
    "From classic gold jewellery to elegant diamond creations, every piece is selected with an appreciation for beauty, detail and lasting elegance.";

  const storyButtonText =
    ourStory?.buttonText ||
    "Explore Our Collections";

  const storyButtonLink =
    ourStory?.buttonLink ||
    "/categories";

  const storyImageOne =
    ourStory?.imageUrlOne ||
    "";

  const storyImageTwo =
    ourStory?.imageUrlTwo ||
    "";

  return (
    <main className="min-h-screen bg-[#f8f5ef] text-[#1c1a17]">

      {/* =================================================
          HERO
      ================================================= */}

      <HeroSlider
        slides={activeHeroSlides}
      />

      {/* =================================================
    FEATURED COLLECTION
================================================= */}

<section className="border-b border-[#e5ded2] bg-[#f8f5ef]">
  <ScrollReveal>
    <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 sm:py-24 lg:px-10">

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

      {newestProducts.length > 0 ? (
        <>

          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">

            {newestProducts.map((product, index) => {

              /*
               * IMPORTANT:
               * Keep the original product image logic.
               */
              const productImage =
                product.imageUrls?.[0] ||
                product.imageUrl ||
                "";

              return (
                <ScrollReveal
                  key={product.id}
                  delay={index * 100}
                >
                  <Link
                    href={`/products/${product.slug}`}
                    className="group block"
                  >

                    <div className="relative aspect-square overflow-hidden rounded-md border border-[#e5ded2] bg-[#f1ece3]">

                      {productImage ? (
                        <Image
                          src={productImage}
                          alt={product.name}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          unoptimized
                          className="object-cover transition duration-700 group-hover:scale-[1.04]"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs uppercase tracking-[0.15em] text-[#aaa196]">
                          No Image
                        </div>
                      )}

                      <span className="absolute left-3 top-3 bg-[#b08d57] px-3 py-1.5 text-[8px] font-semibold uppercase tracking-[0.16em] text-white sm:text-[9px]">
                        New
                      </span>

                    </div>

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
                </ScrollReveal>
              );
            })}

          </div>

          <div className="mt-10 text-center">

            <Link
              href="/categories"
              className="inline-flex items-center gap-2 border-b border-[#b08d57] pb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#1c1a17] transition-colors hover:text-[#b08d57] sm:text-xs"
            >
              View All Collections
              <span>→</span>
            </Link>

          </div>

        </>
      ) : (

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
  </ScrollReveal>
</section>

      
   
     {/* =================================================
    OUR STORY
================================================= */}

{ourStory && ourStory.active && (
  <section className="relative overflow-hidden border-b border-[#ded4c4] bg-[#eee7dc]">

    <div
      aria-hidden="true"
      className="pointer-events-none absolute -right-40 top-16 h-[520px] w-[520px] rounded-full border border-[#b08d57]/10"
    />

    <div
      aria-hidden="true"
      className="pointer-events-none absolute -right-24 top-32 h-[360px] w-[360px] rounded-full border border-[#b08d57]/10"
    />

    <ScrollReveal>
      <div className="relative mx-auto max-w-[1400px] px-5 py-14 sm:px-8 sm:py-28 lg:px-10 lg:py-32">

        <div className="grid items-center gap-10 sm:gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20 xl:gap-28">

          {/* IMAGE COLLAGE */}
          <div className="relative min-h-[360px] sm:min-h-[620px] lg:min-h-[680px]">

            <div
              aria-hidden="true"
              className="absolute left-3 top-3 h-[calc(100%-6px)] w-[calc(100%-6px)] border border-[#b08d57]/35"
            />

            {/* MAIN IMAGE */}
            <div className="absolute left-0 top-0 h-[300px] w-[68%] overflow-hidden bg-[#ddd3c4] shadow-[0_24px_70px_rgba(40,32,24,0.14)] sm:h-[520px] lg:h-[600px]">

              {storyImageOne ? (
                <Image
                  src={storyImageOne}
                  alt="Mahalaxmi Jewellers heritage and craftsmanship"
                  fill
                  sizes="(max-width: 640px) 70vw, 50vw"
                  unoptimized
                  className="object-cover transition duration-1000 hover:scale-[1.025]"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-[#ddd3c4]">
                  <span className="text-[10px] font-medium uppercase tracking-[0.28em] text-[#8f8579]">
                    Our Story
                  </span>
                </div>
              )}

            </div>

            {/* SECOND IMAGE */}
            <div className="absolute bottom-5 right-0 z-10 h-[190px] w-[44%] overflow-hidden border-[8px] border-[#eee7dc] bg-[#ddd3c4] shadow-[0_24px_60px_rgba(40,32,24,0.18)] sm:bottom-10 sm:h-[350px] sm:w-[45%] sm:border-[14px] lg:bottom-12 lg:h-[400px] lg:w-[44%]">

              {storyImageTwo ? (
                <Image
                  src={storyImageTwo}
                  alt="Mahalaxmi Jewellers timeless jewellery"
                  fill
                  sizes="(max-width: 640px) 48vw, 35vw"
                  unoptimized
                  className="object-cover transition duration-1000 hover:scale-[1.025]"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-[#ddd3c4]">
                  <span className="text-[10px] font-medium uppercase tracking-[0.28em] text-[#8f8579]">
                    Timeless Elegance
                  </span>
                </div>
              )}

            </div>

            {/* ESTABLISHED BADGE */}
            <div className="absolute bottom-5 left-[54%] z-20 flex h-16 w-16 -translate-x-1/2 flex-col items-center justify-center rounded-full border border-[#b08d57]/50 bg-[#eee7dc]/95 text-center shadow-[0_10px_35px_rgba(40,32,24,0.12)] backdrop-blur-sm sm:bottom-16 sm:h-24 sm:w-24">

              <span className="text-[7px] font-semibold uppercase tracking-[0.25em] text-[#9b7947] sm:text-[8px]">
                Est.
              </span>

              <span className="mt-1 font-display text-lg text-[#1c1a17] sm:text-2xl">
                1996
              </span>

            </div>

          </div>

          {/* STORY CONTENT */}
          <div className="relative lg:pl-2 xl:pl-8">

            <div className="mb-6 flex items-center gap-4 sm:mb-8">

              <span className="h-px w-10 bg-[#b08d57]" />

              <p className="text-[9px] font-semibold uppercase tracking-[0.34em] text-[#9b7947] sm:text-[10px] sm:tracking-[0.4em]">
                Our Story
              </p>

            </div>

            <h2 className="max-w-2xl font-display text-3xl font-normal leading-[1.1] tracking-[-0.025em] text-[#1c1a17] sm:text-5xl lg:text-6xl xl:text-[4.5rem]">
              {storyTitle}
            </h2>

            <div className="mt-6 h-px w-16 bg-[#b08d57] sm:mt-7" />

            <div className="mt-6 max-w-xl space-y-4 sm:mt-9 sm:space-y-6">

              <p className="text-sm leading-7 text-[#625b53] sm:text-base sm:leading-8">
                {storyParagraphOne}
              </p>

              <p className="text-sm leading-7 text-[#777169] sm:text-base sm:leading-8">
                {storyParagraphTwo}
              </p>

            </div>

            <div className="mt-8 flex flex-wrap items-center gap-5 sm:mt-10 sm:gap-6">

              <Link
                href={storyButtonLink}
                className="group inline-flex min-h-11 items-center justify-center border border-[#b08d57] px-6 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#1c1a17] transition-all duration-500 hover:bg-[#b08d57] hover:text-white sm:min-h-[50px] sm:px-8 sm:text-xs"
              >
                <span>
                  {storyButtonText}
                </span>

                <span className="ml-4 transition-transform duration-500 group-hover:translate-x-1">
                  →
                </span>
              </Link>

              <span className="text-[8px] font-medium uppercase tracking-[0.25em] text-[#a0978c] sm:text-[9px]">
                Crafted with tradition
              </span>

            </div>

            <div className="mt-10 flex items-center gap-4 sm:mt-14">

              <span className="h-px w-20 bg-[#c9bda9]" />

              <span className="text-[7px] uppercase tracking-[0.3em] text-[#a0978c] sm:text-[8px]">
                Mahalaxmi Jewellers &amp; Diamonds
              </span>

            </div>

          </div>

        </div>

      </div>
    </ScrollReveal>

  </section>
)}

     {/* =================================================
    GOOGLE REVIEWS
================================================= */}

<section className="border-b border-[#e5ded2] bg-[#f8f5ef]">

  <ScrollReveal>
    <div className="mx-auto max-w-[1400px] px-5 py-14 sm:px-8 sm:py-24 lg:px-10">

      {/* SECTION HEADING */}
      <div className="mx-auto mb-8 max-w-3xl text-center sm:mb-12">

        <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#b08d57] sm:text-xs sm:tracking-[0.4em]">
          From Our Customers
        </p>

        <h2 className="mt-3 font-display text-3xl font-normal text-[#1c1a17] sm:mt-4 sm:text-5xl">
          Google Reviews
        </h2>

        <div className="mx-auto mt-4 h-px w-12 bg-[#b08d57] sm:mt-5" />

        <p className="mx-auto mt-4 max-w-xl text-[13px] leading-6 text-[#777169] sm:mt-5 sm:text-base sm:leading-7">
          Discover what our customers say about their experience with Mahalaxmi Jewellers &amp; Diamonds.
        </p>

      </div>

      {/* REVIEW CARDS */}
      <div className="grid gap-4 sm:gap-5 md:grid-cols-2">

        {/* GOLD STORE */}
        <ScrollReveal delay={100}>
          <div className="h-full border border-[#e5ded2] bg-[#f1ece3] p-5 sm:p-8 lg:p-10">

            <div className="flex items-start justify-between gap-3 sm:gap-6">

              <div className="min-w-0">

                <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#b08d57] sm:text-[10px] sm:tracking-[0.35em]">
                  Gold Store
                </p>

                <h3 className="mt-3 font-display text-2xl font-normal leading-tight text-[#1c1a17] sm:mt-4 sm:text-3xl lg:text-4xl">
                  Mahalaxmi Jewellers
                </h3>

                <p className="mt-2 text-[9px] font-semibold uppercase tracking-[0.22em] text-[#b08d57] sm:text-[10px] sm:tracking-[0.28em]">
                  (Since 1996)
                </p>

              </div>

              {goldStore?.logo ? (
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#b08d57]/30 bg-[#f1ece3] p-2 sm:h-20 sm:w-20 sm:p-3">

                  <Image
                    src={goldStore.logo}
                    alt="Mahalaxmi Jewellers logo"
                    width={80}
                    height={80}
                    unoptimized
                    className="h-full w-full object-contain"
                  />

                </div>
              ) : (
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-[#b08d57]/30 bg-[#f1ece3] sm:h-20 sm:w-20">

                  <span className="font-display text-xl text-[#b08d57] sm:text-2xl">
                    G
                  </span>

                </div>
              )}

            </div>

            <div className="mt-5 h-px w-11 bg-[#b08d57] sm:mt-6" />

            <div className="mt-6 flex items-center gap-3 sm:mt-8 sm:gap-4">

              <span className="text-[15px] tracking-[0.1em] text-[#b08d57] sm:text-[17px] sm:tracking-[0.12em]">
                ★★★★★
              </span>

              <span className="text-[11px] text-[#777169] sm:text-xs">
                Google Reviews
              </span>

            </div>

            <p className="mt-4 max-w-xl text-[13px] leading-6 text-[#777169] sm:mt-6 sm:text-base sm:leading-7">
              See genuine customer experiences, ratings and reviews for our Gold Jewellery store on Google.
            </p>

            <a
              href="https://maps.app.goo.gl/LPbrNMBkQdHPZrPi6"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex min-h-11 w-full items-center justify-center whitespace-nowrap border border-[#b08d57] px-3 text-[9px] font-semibold uppercase tracking-[0.15em] text-[#1c1a17] transition hover:bg-[#b08d57] hover:text-white sm:mt-9 sm:min-h-12.5 sm:w-auto sm:px-8 sm:text-xs sm:tracking-[0.22em]"
            >
              Read Gold Reviews

              <span className="ml-3 text-base sm:ml-4">
                →
              </span>
            </a>

          </div>
        </ScrollReveal>

        {/* DIAMOND STORE */}
        <ScrollReveal delay={250}>
          <div className="h-full border border-[#e5ded2] bg-[#f1ece3] p-5 sm:p-8 lg:p-10">

            <div className="flex items-start justify-between gap-3 sm:gap-6">

              <div className="min-w-0">

                <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#b08d57] sm:text-[10px] sm:tracking-[0.35em]">
                  Diamond Store
                </p>

                <h3 className="mt-3 font-display text-2xl font-normal leading-tight text-[#1c1a17] sm:mt-4 sm:text-3xl lg:text-4xl">
                  Mahalaxmi Jewels &amp; Diamonds
                </h3>

              </div>

              {diamondStore?.logo ? (
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#b08d57]/30 bg-[#f1ece3] p-2 sm:h-20 sm:w-20 sm:p-3">

                  <Image
                    src={diamondStore.logo}
                    alt="Mahalaxmi Jewels & Diamonds logo"
                    width={80}
                    height={80}
                    unoptimized
                    className="h-full w-full object-contain"
                  />

                </div>
              ) : (
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-[#b08d57]/30 bg-[#f1ece3] sm:h-20 sm:w-20">

                  <span className="font-display text-xl text-[#b08d57] sm:text-2xl">
                    D
                  </span>

                </div>
              )}

            </div>

            <div className="mt-5 h-px w-11 bg-[#b08d57] sm:mt-6" />

            <div className="mt-6 flex items-center gap-3 sm:mt-8 sm:gap-4">

              <span className="text-[15px] tracking-[0.1em] text-[#b08d57] sm:text-[17px] sm:tracking-[0.12em]">
                ★★★★★
              </span>

              <span className="text-[11px] text-[#777169] sm:text-xs">
                Google Reviews
              </span>

            </div>

            <p className="mt-4 max-w-xl text-[13px] leading-6 text-[#777169] sm:mt-6 sm:text-base sm:leading-7">
              See genuine customer experiences, ratings and reviews for our Diamond Jewellery store on Google.
            </p>

            <a
              href="https://maps.app.goo.gl/gTx3QsENQTaaYNgS6"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex min-h-11 w-full items-center justify-center whitespace-nowrap border border-[#b08d57] px-3 text-[9px] font-semibold uppercase tracking-[0.15em] text-[#1c1a17] transition hover:bg-[#b08d57] hover:text-white sm:mt-9 sm:min-h-12.5 sm:w-auto sm:px-8 sm:text-xs sm:tracking-[0.22em]"
            >
              Read Diamond Reviews

              <span className="ml-3 text-base sm:ml-4">
                →
              </span>
            </a>

          </div>
        </ScrollReveal>

      </div>

    </div>
  </ScrollReveal>

</section>

     {/* =================================================
    VISIT US
================================================= */}

<section className="bg-[#f1ece3]">

  <ScrollReveal>
    <div className="mx-auto max-w-350 px-5 py-14 sm:px-8 sm:py-24 lg:px-10">

      {/* SECTION HEADING */}
      <div className="mx-auto mb-8 max-w-2xl text-center sm:mb-12">

        <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#b08d57] sm:text-xs sm:tracking-[0.4em]">
          Visit Us
        </p>

        <h2 className="mt-3 font-display text-3xl font-normal leading-tight text-[#1c1a17] sm:mt-4 sm:text-5xl">
          Let&apos;s Find Something Beautiful
        </h2>

        <div className="mx-auto mt-4 h-px w-12 bg-[#b08d57] sm:mt-5" />

        <p className="mx-auto mt-4 max-w-xl text-[13px] leading-6 text-[#777169] sm:mt-5 sm:text-base sm:leading-7">
          Visit our stores and explore our Gold and
          Diamond collections in person.
        </p>

      </div>

      {/* STORE CARDS */}
      <div className="grid gap-4 sm:gap-5 md:grid-cols-2">

        <ScrollReveal delay={100}>
          <StoreCard
            collection="Gold"
            store={goldStore}
          />
        </ScrollReveal>

        <ScrollReveal delay={250}>
          <StoreCard
            collection="Diamond"
            store={diamondStore}
          />
        </ScrollReveal>

      </div>

      {/* CONTACT BUTTON */}
      <div className="mt-7 text-center sm:mt-10">

        <Link
          href="/contact"
          className="inline-flex min-h-11 items-center justify-center bg-[#b08d57] px-7 text-[9px] font-semibold uppercase tracking-[0.18em] text-white transition-all duration-300 hover:bg-[#8f6f3f] sm:min-h-12.5 sm:px-8 sm:text-xs sm:tracking-[0.2em]"
        >
          Contact Us
        </Link>

      </div>

    </div>
  </ScrollReveal>

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

  const whatsappUrlWithMessage =
    whatsappUrl
      ? `${whatsappUrl}?text=${encodeURIComponent(
          whatsappMessage
        )}`
      : "";

  return (

    <div className="group h-full border border-[#e5ded2] bg-[#f8f5ef] p-5 transition-all duration-500 hover:border-[#b08d57] sm:p-9 lg:p-10">

      {/* STORE LOGO + STORE NAME */}

      <div className="flex items-center gap-3 sm:gap-5">

        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#b08d57]/30 bg-[#f1ece3] p-2 sm:h-24 sm:w-24 sm:p-3">

          {store?.logo ? (

            <Image
              src={store.logo}
              alt={`${store.name || collection} logo`}
              width={96}
              height={96}
              unoptimized
              className="h-full w-full object-contain"
            />

          ) : (

            <span className="font-display text-xl text-[#b08d57] sm:text-2xl">
              {collection === "Gold" ? "G" : "D"}
            </span>

          )}

        </div>

        <div className="min-w-0">

          <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#b08d57] sm:text-xs sm:tracking-[0.3em]">
            {collection} Store
          </p>

          <h3 className="mt-1.5 font-display text-xl font-normal leading-tight text-[#1c1a17] sm:mt-2 sm:text-3xl">
            {store?.name || fallbackName}
          </h3>

        </div>

      </div>

      <div className="mt-5 h-px w-10 bg-[#b08d57] sm:mt-6" />

      {store?.description && (

        <p className="mt-4 max-w-xl text-[13px] leading-6 text-[#777169] sm:mt-5 sm:text-base sm:leading-7">
          {store.description}
        </p>

      )}

      {/* ADDRESS AND PHONE */}

      <div className="mt-6 space-y-4 sm:mt-7 sm:space-y-6">

        <div>

          <p className="text-[8px] font-semibold uppercase tracking-[0.2em] text-[#9b9389] sm:text-[9px]">
            Address
          </p>

          <p className="mt-1.5 text-[13px] leading-5 text-[#4d4943] sm:mt-2 sm:text-base sm:leading-6">
            {store?.address || "Store address coming soon"}
          </p>

        </div>

        <div>

          <p className="text-[8px] font-semibold uppercase tracking-[0.2em] text-[#9b9389] sm:text-[9px]">
            Phone
          </p>

          {store?.phone ? (

            <a
              href={`tel:${store.phone}`}
              className="mt-1.5 inline-block text-[13px] text-[#4d4943] transition-colors hover:text-[#b08d57] sm:mt-2 sm:text-base"
            >
              {store.phone}
            </a>

          ) : (

            <p className="mt-1.5 text-[13px] text-[#918a81] sm:mt-2">
              Phone number coming soon
            </p>

          )}

        </div>

      </div>

      {/* ACTION BUTTONS */}

      <div className="mt-6 flex flex-col gap-2.5 sm:mt-8 sm:flex-row sm:gap-3">

        {whatsappUrlWithMessage && (

          <a
            href={whatsappUrlWithMessage}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-11 flex-1 items-center justify-center bg-[#b08d57] px-4 text-[9px] font-semibold uppercase tracking-[0.13em] text-white transition-colors hover:bg-[#8f6f3f] sm:min-h-12 sm:px-5 sm:text-xs sm:tracking-[0.16em]"
          >
            WhatsApp
          </a>

        )}

        {store?.googleMapsUrl && (

          <a
            href={store.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-11 flex-1 items-center justify-center border border-[#b08d57] px-4 text-[9px] font-semibold uppercase tracking-[0.13em] text-[#1c1a17] transition-colors hover:bg-[#b08d57] hover:text-white sm:min-h-12 sm:px-5 sm:text-xs sm:tracking-[0.16em]"
          >
            View Location
          </a>

        )}

      </div>

      {/* COLLECTION BUTTON */}

      <Link
        href={
          collection === "Gold"
            ? "/gold"
            : "/diamond"
        }
        className="mt-2.5 flex min-h-11 items-center justify-center border border-[#e5ded2] px-4 text-[9px] font-semibold uppercase tracking-[0.13em] text-[#4d4943] transition-colors hover:border-[#b08d57] hover:text-[#b08d57] sm:mt-3 sm:min-h-12 sm:px-5 sm:text-xs sm:tracking-[0.16em]"
      >
        View {collection} Collection

        <span className="ml-2">
          →
        </span>

      </Link>

    </div>
  );
}
