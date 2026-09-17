import Link from "next/link";

import HeroSlider from "@/components/public/HeroSlider";

import {
  getCategories,
  type Category,
} from "@/services/category.service";

import { getHeroSlides } from "@/services/hero-slide.service";

import type { HeroSlide } from "@/types/hero-slide";

export default async function CategoriesPage() {
  /* =========================================================
     LOAD CATEGORIES
  ========================================================= */

  let categories: Category[] = [];

  try {
    categories = await getCategories();
  } catch (error) {
    console.error(
      "Failed to load categories:",
      error
    );
  }

  /* =========================================================
     LOAD CATEGORY HERO SLIDES
  ========================================================= */

  let heroSlides: HeroSlide[] = [];

  try {
    const slides = await getHeroSlides();

    heroSlides = slides
      .filter(
        (slide) =>
          slide.active &&
          slide.page === "Categories" &&
          (slide.imageUrl || slide.videoUrl)
      )
      .sort(
        (a, b) => a.order - b.order
      );
  } catch (error) {
    console.error(
      "Failed to load Categories hero slides:",
      error
    );
  }

  /* =========================================================
     ACTIVE CATEGORIES
  ========================================================= */

  const activeCategories =
    categories.filter(
      (category) =>
        category.active
    );

  /* =========================================================
     SEPARATE GOLD AND DIAMOND CATEGORIES
  ========================================================= */

  const goldCategories =
    activeCategories.filter(
      (category) =>
        category.collection ===
        "Gold"
    );

  const diamondCategories =
    activeCategories.filter(
      (category) =>
        category.collection ===
        "Diamond"
    );

  return (
    <main className="min-h-screen bg-[#f8f5ef] text-[#1c1a17]">

      {/* =====================================================
          HERO
      ===================================================== */}

      <HeroSlider
        slides={heroSlides}
      />

      {/* =====================================================
          CATEGORY COLLECTION
      ===================================================== */}

      <section className="bg-[#f8f5ef]">

        <div className="mx-auto max-w-350 px-5 py-16 sm:px-8 sm:py-20 lg:px-10">

          {activeCategories.length === 0 ? (

            /* =================================================
               EMPTY STATE
            ================================================= */

            <div className="border border-[#e5ded2] bg-[#f1ece3] px-6 py-24 text-center">

              <div className="text-3xl text-[#b08d57]">
                ◇
              </div>

              <h2 className="mt-5 font-display text-2xl font-normal text-[#1c1a17] sm:text-3xl">
                No Categories Available
              </h2>

              <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#777169]">
                Jewellery categories will appear here
                once they are added and activated from
                the admin dashboard.
              </p>

              <Link
                href="/"
                className="mt-8 inline-flex min-h-12.5 items-center justify-center bg-[#b08d57] px-7 text-[10px] font-semibold uppercase tracking-[0.18em] text-white transition-all duration-300 hover:bg-[#8f6f3f] sm:text-xs"
              >
                Back to Home
              </Link>

            </div>

          ) : (

            <>

              {/* =================================================
                  SECTION HEADER
              ================================================= */}

              <div className="mx-auto mb-12 max-w-2xl text-center">

                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#b08d57] sm:text-xs sm:tracking-[0.4em]">
                  Browse
                </p>

                <h2 className="mt-4 font-display text-4xl font-normal text-[#1c1a17] sm:text-5xl">
                  Find Your Style
                </h2>

                <div className="mx-auto mt-5 h-px w-12 bg-[#b08d57]" />

                <p className="mt-5 text-sm leading-7 text-[#777169] sm:text-base">
                  Explore our Gold and Diamond jewellery
                  categories and discover the perfect
                  style for you.
                </p>

              </div>

              {/* =================================================
                  GOLD CATEGORIES
              ================================================= */}

              {goldCategories.length > 0 && (
                <CategoryGroup
                  title="Gold Jewellery"
                  label="Gold Collection"
                  categories={
                    goldCategories
                  }
                />
              )}

              {/* =================================================
                  DIAMOND CATEGORIES
              ================================================= */}

              {diamondCategories.length > 0 && (
                <CategoryGroup
                  title="Diamond Jewellery"
                  label="Diamond Collection"
                  categories={
                    diamondCategories
                  }
                />
              )}

              {/* =================================================
                  FALLBACK
                  For categories with no collection value
              ================================================= */}

              {goldCategories.length === 0 &&
                diamondCategories.length === 0 && (
                  <CategoryGroup
                    title="Our Jewellery"
                    label="Collection"
                    categories={
                      activeCategories
                    }
                  />
                )}

            </>
          )}

        </div>

      </section>

      {/* =====================================================
          GOLD / DIAMOND CTA
      ===================================================== */}

      <section className="border-t border-[#e5ded2] bg-[#f1ece3]">

        <div className="mx-auto max-w-350 px-5 py-20 sm:px-8 sm:py-24 lg:px-10">

          <div className="mx-auto mb-12 max-w-2xl text-center">

            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#b08d57] sm:text-xs sm:tracking-[0.4em]">
              Discover More
            </p>

            <h2 className="mt-4 font-display text-4xl font-normal text-[#1c1a17] sm:text-5xl">
              Explore Our Collections
            </h2>

            <div className="mx-auto mt-5 h-px w-12 bg-[#b08d57]" />

          </div>

          <div className="grid gap-5 md:grid-cols-2">

            {/* =================================================
                GOLD
            ================================================= */}

            <div className="group border border-[#e5ded2] bg-[#f8f5ef] p-8 transition-all duration-500 hover:-translate-y-1 hover:border-[#b08d57] sm:p-10 lg:p-12">

              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#b08d57]">
                Gold
              </p>

              <h3 className="mt-4 font-display text-3xl font-normal text-[#1c1a17] sm:text-4xl">
                Gold Jewellery
              </h3>

              <div className="mt-5 h-px w-10 bg-[#b08d57] transition-all duration-300 group-hover:w-16" />

              <p className="mt-5 max-w-lg text-sm leading-7 text-[#777169] sm:text-base">
                Discover timeless gold jewellery crafted
                with elegance and attention to detail,
                designed for every special moment.
              </p>

              <Link
                href="/gold"
                className="mt-7 inline-flex min-h-12.5 items-center justify-center bg-[#b08d57] px-7 text-[10px] font-semibold uppercase tracking-[0.18em] text-white transition-all duration-300 hover:bg-[#8f6f3f] sm:text-xs"
              >
                View Gold Collection
              </Link>

            </div>

            {/* =================================================
                DIAMOND
            ================================================= */}

            <div className="group border border-[#e5ded2] bg-[#f8f5ef] p-8 transition-all duration-500 hover:-translate-y-1 hover:border-[#b08d57] sm:p-10 lg:p-12">

              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#b08d57]">
                Diamonds
              </p>

              <h3 className="mt-4 font-display text-3xl font-normal text-[#1c1a17] sm:text-4xl">
                Diamond Jewellery
              </h3>

              <div className="mt-5 h-px w-10 bg-[#b08d57] transition-all duration-300 group-hover:w-16" />

              <p className="mt-5 max-w-lg text-sm leading-7 text-[#777169] sm:text-base">
                Explore refined diamond jewellery designed
                to bring brilliance and sophistication to
                every special occasion.
              </p>

              <Link
                href="/diamond"
                className="mt-7 inline-flex min-h-12.5 items-center justify-center bg-[#b08d57] px-7 text-[10px] font-semibold uppercase tracking-[0.18em] text-white transition-all duration-300 hover:bg-[#8f6f3f] sm:text-xs"
              >
                View Diamond Collection
              </Link>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}

/* =========================================================
   CATEGORY GROUP
========================================================= */

function CategoryGroup({
  title,
  label,
  categories,
}: {
  title: string;
  label: string;
  categories: Category[];
}) {
  return (
    <section className="mb-16 last:mb-0">

      {/* Group heading */}

      <div className="mb-8 flex flex-col gap-3 border-b border-[#e5ded2] pb-5 sm:flex-row sm:items-end sm:justify-between">

        <div>

          <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#b08d57] sm:text-[10px]">
            {label}
          </p>

          <h2 className="mt-2 font-display text-3xl font-normal text-[#1c1a17] sm:text-4xl">
            {title}
          </h2>

        </div>

        <p className="text-[9px] uppercase tracking-[0.15em] text-[#918a81] sm:text-[10px]">
          {categories.length}{" "}
          {categories.length === 1
            ? "Category"
            : "Categories"}
        </p>

      </div>

      {/* Category cards */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

        {categories.map(
          (category) => {

            const categorySlug =
              category.name
                .toLowerCase()
                .trim()
                .replace(
                  /\s+/g,
                  "-"
                );

            return (
              <Link
                key={category.id}
                href={`/categories/${categorySlug}`}
                className="group relative overflow-hidden border border-[#e5ded2] bg-[#f1ece3] p-7 transition-all duration-500 hover:-translate-y-1 hover:border-[#b08d57] sm:p-8"
              >

                {/* Decorative circle */}

                <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full border border-[#b08d57]/10 transition-all duration-500 group-hover:scale-150 group-hover:border-[#b08d57]/20" />

                {/* Icon */}

                <div className="relative flex h-12 w-12 items-center justify-center border border-[#b08d57]/25 bg-[#b08d57]/5">

                  <span className="text-xl text-[#b08d57]">
                    ◇
                  </span>

                </div>

                {/* Category name */}

                <h3 className="relative mt-6 font-display text-2xl font-normal text-[#1c1a17] transition-colors duration-300 group-hover:text-[#b08d57] sm:text-3xl">
                  {category.name}
                </h3>

                {/* Description */}

                {category.description ? (

                  <p className="relative mt-3 line-clamp-3 text-sm leading-7 text-[#777169]">
                    {category.description}
                  </p>

                ) : (

                  <p className="relative mt-3 text-sm leading-7 text-[#777169]">
                    Explore our beautiful{" "}
                    {category.name} jewellery collection.
                  </p>

                )}

                {/* Explore */}

                <div className="relative mt-7 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#1c1a17] transition-colors duration-300 group-hover:text-[#b08d57] sm:text-xs">

                  <span>
                    Explore Category
                  </span>

                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>

                </div>

              </Link>
            );
          }
        )}

      </div>

    </section>
  );
}