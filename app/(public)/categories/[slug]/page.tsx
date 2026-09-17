import Link from "next/link";

import HeroSlider from "@/components/public/HeroSlider";
import { getHeroSlides } from "@/services/hero-slide.service";
import { getCategories } from "@/services/category.service";
import { getProducts } from "@/services/product.service";

import type { HeroSlide } from "@/types/hero-slide";
import type { Product } from "@/types/product";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function CategoryPage({
  params,
}: Props) {
  const { slug } = await params;

  const categories = await getCategories();

  const category = categories.find(
    (item) =>
      item.slug === slug &&
      item.active
  );

  if (!category) {
    return (
      <main className="min-h-screen bg-[#f8f5ef] px-5 py-24">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-sm uppercase tracking-[0.25em] text-[#b08d57]">
            Category Not Found
          </p>

          <h1 className="mt-4 font-display text-5xl text-[#1c1a17]">
            Category Not Found
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-[#777169]">
            The jewellery category you are looking for
            could not be found or is currently inactive.
          </p>

          <Link
            href="/categories"
            className="mt-8 inline-flex min-h-[52px] items-center justify-center bg-[#b08d57] px-8 text-xs font-semibold uppercase tracking-[0.18em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#8f6f3f]"
          >
            Back to Categories
          </Link>
        </div>
      </main>
    );
  }

  /* =========================================================
     CATEGORY HERO SLIDES
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
        (a, b) =>
          a.order - b.order
      );
  } catch (error) {
    console.error(
      "Failed to load category hero slides:",
      error
    );
  }

  /* =========================================================
     CATEGORY PRODUCTS
  ========================================================= */

  let products: Product[] = [];

  try {
    products = await getProducts({
      category: category.id,
      active: true,
    });
  } catch (error) {
    console.error(
      `Failed to load products for category ${category.name}:`,
      error
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f5ef]">
      {/* =====================================================
          HERO
      ===================================================== */}

      <HeroSlider
        slides={heroSlides}
      />

      {/* =====================================================
          CATEGORY HEADER
      ===================================================== */}

      <section className="border-b border-[#e5ded2] bg-[#f8f5ef]">
        <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 sm:py-24 lg:px-10">
          <div className="mx-auto max-w-4xl text-center">
            <div className="flex items-center justify-center gap-3 sm:gap-4">
              <span className="h-px w-8 bg-[#b08d57] sm:w-14" />

              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#b08d57] sm:text-xs sm:tracking-[0.4em]">
                Jewellery Collection
              </p>

              <span className="h-px w-8 bg-[#b08d57] sm:w-14" />
            </div>

            <h1 className="mt-7 font-display text-5xl font-normal leading-[1.05] tracking-[-0.03em] text-[#1c1a17] sm:text-6xl md:text-7xl">
              {category.name}
            </h1>

            {category.description && (
              <p className="mx-auto mt-7 max-w-2xl text-sm leading-7 text-[#777169] sm:text-base sm:leading-8">
                {category.description}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* =====================================================
          PRODUCTS
      ===================================================== */}

      <section className="bg-white">
        <div className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
          <div className="mb-10 flex flex-col gap-3 border-b border-[#e5ded2] pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#b08d57] sm:text-xs sm:tracking-[0.4em]">
                Collection
              </p>

              <h2 className="mt-2 font-display text-3xl font-normal text-[#1c1a17] sm:text-4xl">
                {category.name}
              </h2>
            </div>

            <p className="text-[10px] uppercase tracking-[0.18em] text-[#918a81] sm:text-xs">
              {products.length}{" "}
              {products.length === 1
                ? "Piece"
                : "Pieces"}
            </p>
          </div>

          {products.length === 0 ? (
            <div className="border border-[#e5ded2] bg-[#f8f5ef] px-6 py-24 text-center">
              <div className="text-3xl text-[#b08d57]">
                ◇
              </div>

              <h3 className="mt-5 font-display text-2xl font-normal text-[#1c1a17] sm:text-3xl">
                Collection Coming Soon
              </h3>

              <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#777169]">
                We are currently adding beautiful
                pieces to this collection. Please
                check back soon.
              </p>

              <Link
                href="/categories"
                className="mt-8 inline-flex min-h-[48px] items-center justify-center bg-[#b08d57] px-7 text-[10px] font-semibold uppercase tracking-[0.18em] text-white transition-all duration-300 hover:bg-[#8f6f3f] sm:text-xs"
              >
                Browse Categories
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
              {products.map(
                (product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                )
              )}
            </div>
          )}
        </div>
      </section>

      {/* =====================================================
          COLLECTION NAVIGATION
      ===================================================== */}

      <section className="border-t border-[#e5ded2] bg-[#f8f5ef]">
        <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 sm:py-24 lg:px-10">
          <div className="mx-auto max-w-3xl text-center">
            <div className="flex items-center justify-center gap-3">
              <span className="h-px w-10 bg-[#e5ded2]" />

              <span className="text-sm text-[#d6b878]">
                ✦
              </span>

              <span className="h-px w-10 bg-[#e5ded2]" />
            </div>

            <h2 className="mt-7 font-display text-4xl font-normal tracking-[-0.02em] text-[#1c1a17] sm:text-5xl">
              Explore More
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#777169] sm:text-base sm:leading-8">
              Discover more jewellery from our Gold
              and Diamond collections.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
              <Link
                href="/gold"
                className="inline-flex min-h-[52px] items-center justify-center bg-[#b08d57] px-8 text-xs font-semibold uppercase tracking-[0.18em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#8f6f3f]"
              >
                Gold Collection
              </Link>

              <Link
                href="/diamond"
                className="inline-flex min-h-[52px] items-center justify-center border border-[#b08d57] bg-transparent px-8 text-xs font-semibold uppercase tracking-[0.18em] text-[#8f6f3f] transition-all duration-300 hover:bg-[#b08d57] hover:text-white"
              >
                Diamond Collection
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

/* =========================================================
   PRODUCT CARD
========================================================= */

function ProductCard({
  product,
}: {
  product: Product;
}) {
  const imageUrl =
    product.imageUrls?.[0] ||
    product.imageUrl ||
    "";

  const productHref =
    `/products/${product.slug || product.id}`;

  return (
    <Link
      href={productHref}
      className="group block"
    >
      <div className="relative overflow-hidden border border-[#e5ded2] bg-[#f1ece3]">
        <div className="aspect-square overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="text-4xl text-[#b08d57]">
                ◇
              </span>
            </div>
          )}
        </div>

        {product.featured && (
          <div className="absolute left-3 top-3 bg-[#b08d57] px-3 py-1.5 text-[8px] font-semibold uppercase tracking-[0.16em] text-white">
            Featured
          </div>
        )}
      </div>

      <div className="px-1 pt-4">
        <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#b08d57]">
          {product.categoryName ||
            categoryLabel(product.collection)}
        </p>

        <h3 className="mt-2 line-clamp-2 font-display text-lg font-normal leading-tight text-[#1c1a17] transition-colors duration-300 group-hover:text-[#b08d57] sm:text-xl">
          {product.name}
        </h3>

        {product.purity && (
          <p className="mt-2 text-[10px] uppercase tracking-[0.12em] text-[#777169]">
            {product.purity}
          </p>
        )}

        <div className="mt-3 flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#1c1a17] transition-colors duration-300 group-hover:text-[#b08d57] sm:text-[10px]">
          <span>
            View Details
          </span>

          <span className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </div>
      </div>
    </Link>
  );
}

/* =========================================================
   COLLECTION LABEL
========================================================= */

function categoryLabel(
  collection?: string
): string {
  if (
    collection?.toLowerCase() ===
    "diamond"
  ) {
    return "Diamond Jewellery";
  }

  if (
    collection?.toLowerCase() ===
    "gold"
  ) {
    return "Gold Jewellery";
  }

  return "Jewellery";
}