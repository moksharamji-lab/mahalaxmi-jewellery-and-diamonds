
import Image from "next/image";
import Link from "next/link";

import {
  getCategories,
  type Category,
} from "@/services/category.service";

import { getProducts } from "@/services/product.service";

type Product = Awaited<ReturnType<typeof getProducts>>[number];
type Collection = "Gold" | "Diamond";

export default async function CategoriesPage() {
  let categories: Category[] = [];
  let goldProducts: Product[] = [];
  let diamondProducts: Product[] = [];

  try {
    categories = await getCategories();
  } catch (error) {
    console.error("[CategoriesPage] Failed to load categories:", error);
  }

  try {
    goldProducts = await getProducts({
      collection: "Gold",
      active: true,
    });
  } catch (error) {
    console.error("[CategoriesPage] Failed to load Gold products:", error);
  }

  try {
    diamondProducts = await getProducts({
      collection: "Diamond",
      active: true,
    });
  } catch (error) {
    console.error(
      "[CategoriesPage] Failed to load Diamond products:",
      error
    );
  }

  const goldCategories = categories
    .filter(
      (category) =>
        category.active && category.collection === "Gold"
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  const diamondCategories = categories
    .filter(
      (category) =>
        category.active && category.collection === "Diamond"
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  function getCategorySlug(category: Category) {
    const existingSlug = category.slug?.trim();

    if (existingSlug) return existingSlug;

    return category.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function getProductHref(product: Product) {
    const slug = product.slug?.trim();

    if (slug) {
      return `/products/${encodeURIComponent(slug)}`;
    }

    return `/products/${encodeURIComponent(product.id)}`;
  }

  function getProductImage(product: Product) {
    if (Array.isArray(product.imageUrls) && product.imageUrls.length > 0) {
      return product.imageUrls[0];
    }

    if (product.imageUrl?.trim()) {
      return product.imageUrl;
    }

    return "";
  }

  function getProductsForCategory(
    products: Product[],
    category: Category
  ) {
    return products.filter((product) => {
      if (product.category === category.id) {
        return true;
      }

      return (
        product.categoryName?.trim().toLowerCase() ===
        category.name.trim().toLowerCase()
      );
    });
  }

  function ProductCard({
    product,
    collection,
  }: {
    product: Product;
    collection: Collection;
  }) {
    const image = getProductImage(product);

    return (
      <Link
        href={getProductHref(product)}
        className="group block"
      >
        <article>
          <div className="relative aspect-[4/5] overflow-hidden bg-[#f4f1eb]">
            {image ? (
              <Image
                src={image}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                unoptimized
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[#f3efe7]">
                <div className="text-center">
                  <span className="text-3xl text-[#b08d57]">◇</span>
                  <p className="mt-2 text-[9px] uppercase tracking-[0.25em] text-neutral-400">
                    {collection}
                  </p>
                </div>
              </div>
            )}

            <div className="absolute left-3 top-3 bg-white/90 px-3 py-1.5 backdrop-blur-sm">
              <span className="text-[8px] font-semibold uppercase tracking-[0.2em] text-neutral-700">
                {collection}
              </span>
            </div>

            <div className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center bg-white/90 text-neutral-800 opacity-0 transition-all duration-300 group-hover:opacity-100">
              →
            </div>
          </div>

          <div className="pt-4">
            <h4 className="font-serif text-lg leading-tight text-neutral-900 transition-colors duration-300 group-hover:text-[#a37b32] sm:text-xl">
              {product.name}
            </h4>

            {product.purity && (
              <p className="mt-1.5 text-[9px] font-medium uppercase tracking-[0.18em] text-neutral-500">
                {product.purity}
              </p>
            )}
          </div>
        </article>
      </Link>
    );
  }

  function renderCollectionSection({
    collection,
    categories,
    products,
  }: {
    collection: Collection;
    categories: Category[];
    products: Product[];
  }) {
    const isGold = collection === "Gold";

    return (
      <section className={isGold ? "bg-[#F8F5EF]" : "bg-white"}>
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
          <div className="mb-12">
            <div className="flex items-center gap-4">
              <span className="h-px w-10 bg-[#D6B878]" />
              <p className="text-[9px] font-semibold uppercase tracking-[0.35em] text-[#A37B32]">
                {isGold
                  ? "01 — Gold Collection"
                  : "02 — Diamond Collection"}
              </p>
            </div>

            <div className="mt-5 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="font-serif text-4xl font-normal text-[#1C1A17] sm:text-5xl">
                  {isGold ? "Gold Jewellery" : "Diamond Jewellery"}
                </h2>

                <p className="mt-4 max-w-xl text-sm leading-7 text-[#5C554B]">
                  {isGold
                    ? "Discover timeless gold craftsmanship across our carefully curated jewellery categories."
                    : "Explore refined diamond jewellery designed to capture light, elegance and individuality."}
                </p>
              </div>

              <Link
                href={isGold ? "/gold" : "/diamond"}
                className="inline-flex shrink-0 items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#1C1A17] transition-colors hover:text-[#A37B32]"
              >
                View Collection <span>→</span>
              </Link>
            </div>
          </div>

          {categories.length === 0 ? (
            <div className="border border-dashed border-neutral-300 px-6 py-16 text-center">
              <span className="text-3xl text-[#D6B878]">◇</span>

              <h3 className="mt-4 font-serif text-2xl text-[#1C1A17]">
                No Categories Available
              </h3>

              <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#5C554B]">
                Categories from this collection will appear here once they
                are activated.
              </p>
            </div>
          ) : (
            <div className="space-y-16">
              {categories.map((category, categoryIndex) => {
                const categoryProducts = getProductsForCategory(
                  products,
                  category
                );

                if (categoryProducts.length === 0) {
                  return null;
                }

                return (
                  <section
                    key={category.id}
                    className="border-t border-neutral-200 pt-8"
                  >
                    <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] font-medium tracking-[0.2em] text-neutral-400">
                          {String(categoryIndex + 1).padStart(2, "0")}
                        </span>

                        <div>
                          <h3 className="font-serif text-2xl font-normal text-[#1C1A17] sm:text-3xl">
                            {category.name}
                          </h3>

                          <p className="mt-1 text-xs text-[#5C554B]">
                            {categoryProducts.length}{" "}
                            {categoryProducts.length === 1
                              ? "piece"
                              : "pieces"}
                          </p>
                        </div>
                      </div>

                      <Link
                        href={`/categories/${encodeURIComponent(
                          getCategorySlug(category)
                        )}`}
                        className="inline-flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#5C554B] transition-colors hover:text-[#A37B32]"
                      >
                        View All <span>→</span>
                      </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
                      {categoryProducts.slice(0, 8).map((product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          collection={collection}
                        />
                      ))}
                    </div>

                    {categoryProducts.length > 8 && (
                      <div className="mt-8 text-center">
                        <Link
                          href={`/categories/${encodeURIComponent(
                            getCategorySlug(category)
                          )}`}
                          className="inline-flex items-center gap-3 border border-[#D6B878] px-6 py-3 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#1C1A17] transition-all hover:border-[#D6B878] hover:bg-[#D6B878] hover:text-[#211E1A]"
                        >
                          View All {categoryProducts.length} Products
                          <span>→</span>
                        </Link>
                      </div>
                    )}
                  </section>
                );
              })}
            </div>
          )}
        </div>
      </section>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F5EF] text-[#1C1A17]">

      {/* Page introduction */}
      <section className="bg-[#F8F5EF]">
        <div className="mx-auto max-w-7xl px-6 py-20 text-center sm:px-8 sm:py-24 lg:px-10 lg:py-28">
          <p className="text-[9px] font-semibold uppercase tracking-[0.4em] text-[#A37B32] sm:text-[10px]">
            Mahalaxmi Jewellers &amp; Diamonds
          </p>

          <h1 className="mt-5 font-serif text-5xl font-normal tracking-[-0.03em] text-[#1C1A17] sm:text-6xl md:text-7xl">
            Our Collections
          </h1>

          <div className="mx-auto mt-7 h-px w-14 bg-[#D6B878]" />

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-[#5C554B] sm:text-base sm:leading-8">
            Explore our Gold and Diamond jewellery collections,
            thoughtfully curated for every occasion and every expression
            of elegance.
          </p>
        </div>
      </section>

      {/* Gold products */}
      {renderCollectionSection({
        collection: "Gold",
        categories: goldCategories,
        products: goldProducts,
      })}

      {/* Diamond products */}
      {renderCollectionSection({
        collection: "Diamond",
        categories: diamondCategories,
        products: diamondProducts,
      })}

      {/* Final call to action */}
      <section className="bg-[#F8F5EF]">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center sm:px-8 sm:py-24">
          <p className="text-[9px] font-semibold uppercase tracking-[0.4em] text-[#A37B32]">
            Since 1996
          </p>

          <h2 className="mt-5 font-serif text-4xl font-normal text-[#1C1A17] sm:text-5xl">
            Jewellery That Becomes
            <br />
            Part of Your Story
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#5C554B]">
            Discover the complete collections from Mahalaxmi Jewellers
            &amp; Diamonds.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/gold"
              className="inline-flex min-h-12 items-center justify-center border border-[#D6B878] bg-[#D6B878] px-8 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#211E1A] transition hover:bg-[#C9A86A]"
            >
              Explore Gold
            </Link>

            <Link
              href="/diamond"
              className="inline-flex min-h-12 items-center justify-center border border-[#D6B878] bg-[#D6B878] px-8 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#211E1A] transition hover:bg-[#C9A86A]"
            >
              Explore Diamond
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
