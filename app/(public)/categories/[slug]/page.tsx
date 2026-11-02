import Image from "next/image";
import Link from "next/link";

import {
  getCategories,
  type Category,
} from "@/services/category.service";

import {
  getProducts,
} from "@/services/product.service";

type Collection = "Gold" | "Diamond";

type Product = Awaited<ReturnType<typeof getProducts>>[number];

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    collection?: string;
  }>;
};

function getProductHref(product: Product) {
  const slug = product.slug?.trim();

  if (slug) {
    return `/products/${encodeURIComponent(slug)}`;
  }

  return `/products/${product.id}`;
}

function getProductImage(product: Product) {
  if (
    Array.isArray(product.imageUrls) &&
    product.imageUrls.length > 0
  ) {
    return product.imageUrls[0];
  }

  return "";
}

function dedupeProducts(products: Product[]) {
  const seen = new Set<string>();
  const result: Product[] = [];

  for (const product of products) {
    const key = product.id?.trim();

    if (!key || seen.has(key)) {
      continue;
    }

    seen.add(key);
    result.push(product);
  }

  return result;
}

export default async function CategoryPage({
  params,
  searchParams,
}: PageProps) {
  const { slug } = await params;
  const query = await searchParams;

  const cleanSlug = slug.trim().toLowerCase();

  let categories: Category[] = [];

  try {
    categories = await getCategories();
  } catch (error) {
    console.error(
      "[CategoryPage] Failed to load categories:",
      error
    );
  }

  /*
   * Keep all matching category records.
   *
   * This allows the same category name/slug to work
   * with both Gold and Diamond products.
   */
  const matchingCategories = categories.filter((category) => {
    const categorySlug =
      category.slug?.trim().toLowerCase();

    return (
      category.active &&
      categorySlug === cleanSlug
    );
  });

  if (matchingCategories.length === 0) {
    return (
      <main className="min-h-screen bg-[#faf9f6]">
        <section className="mx-auto flex min-h-[70vh] max-w-7xl flex-col items-center justify-center px-6 text-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.35em] text-neutral-500">
            Category
          </p>

          <h1 className="font-serif text-4xl text-neutral-900 md:text-5xl">
            Category Not Found
          </h1>

          <p className="mt-4 max-w-lg text-sm leading-7 text-neutral-600">
            The category you are looking for is not available.
          </p>

          <Link
            href="/categories"
            className="mt-8 inline-flex rounded-full border border-neutral-900 bg-neutral-900 px-7 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-neutral-800"
          >
            Back to Categories
          </Link>
        </section>
      </main>
    );
  }

  const categoryName =
    matchingCategories[0]?.name?.trim() || "Category";

  /*
   * We intentionally DO NOT use category.collection.
   *
   * Instead, we check the Products table directly for
   * Gold and Diamond products belonging to this category.
   */
  let goldProducts: Product[] = [];
  let diamondProducts: Product[] = [];

  for (const category of matchingCategories) {
    try {
      const gold = await getProducts({
        category: category.id,
        collection: "Gold",
        active: true,
      });

      goldProducts.push(...gold);
    } catch (error) {
      console.error(
        `[CategoryPage] Failed to load Gold products for category ${category.id}:`,
        error
      );
    }

    try {
      const diamond = await getProducts({
        category: category.id,
        collection: "Diamond",
        active: true,
      });

      diamondProducts.push(...diamond);
    } catch (error) {
      console.error(
        `[CategoryPage] Failed to load Diamond products for category ${category.id}:`,
        error
      );
    }
  }

  goldProducts = dedupeProducts(goldProducts);
  diamondProducts = dedupeProducts(diamondProducts);

  const hasGold = goldProducts.length > 0;
  const hasDiamond = diamondProducts.length > 0;

  const requestedCollection =
    query.collection?.trim().toLowerCase();

  const selectedCollection: Collection | null =
    requestedCollection === "gold"
      ? "Gold"
      : requestedCollection === "diamond"
        ? "Diamond"
        : null;

  const selectedProducts =
    selectedCollection === "Gold"
      ? goldProducts
      : selectedCollection === "Diamond"
        ? diamondProducts
        : [];

  const currentCategorySlug =
    matchingCategories[0]?.slug?.trim() || cleanSlug;

  const encodedCategorySlug =
    encodeURIComponent(currentCategorySlug);

  const goldUrl =
    `/categories/${encodedCategorySlug}?collection=Gold`;

  const diamondUrl =
    `/categories/${encodedCategorySlug}?collection=Diamond`;

  return (
    <main className="min-h-screen bg-[#faf9f6]">

      {/* CATEGORY HEADER */}
      <section className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-14 text-center md:px-10 md:py-20">

          <Link
            href="/categories"
            className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.22em] text-neutral-500 transition hover:text-neutral-900"
          >
            <span>←</span>
            <span>All Categories</span>
          </Link>

          <p className="mt-8 text-xs font-medium uppercase tracking-[0.4em] text-neutral-500">
            Explore Collection
          </p>

          <h1 className="mt-4 font-serif text-4xl font-medium tracking-tight text-neutral-900 md:text-6xl">
            {categoryName}
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-neutral-600 md:text-base">
            Discover our {categoryName.toLowerCase()} collection
            across Gold and Diamond jewellery.
          </p>

        </div>
      </section>

      {/* COLLECTION SELECTION */}
      {!selectedCollection && (
        <section className="bg-[#faf9f6] px-6 py-14 md:px-10 md:py-20">
          <div className="mx-auto max-w-5xl">

            <div className="text-center">
              <p className="text-xs font-medium uppercase tracking-[0.35em] text-neutral-500">
                Choose Collection
              </p>

              <h2 className="mt-3 font-serif text-3xl text-neutral-900 md:text-4xl">
                Shop {categoryName}
              </h2>
            </div>

            <div
              className={`mt-10 grid gap-6 ${
                hasGold && hasDiamond
                  ? "md:grid-cols-2"
                  : "mx-auto max-w-xl"
              }`}
            >

              {/* GOLD */}
              {hasGold && (
                <Link
                  href={goldUrl}
                  className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-8 text-center shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl md:p-12"
                >
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-neutral-300 bg-[#faf9f6] transition group-hover:border-neutral-900">
                    <span className="font-serif text-2xl text-neutral-900">
                      G
                    </span>
                  </div>

                  <p className="mt-7 text-xs font-medium uppercase tracking-[0.35em] text-neutral-500">
                    Explore
                  </p>

                  <h3 className="mt-2 font-serif text-3xl text-neutral-900">
                    Gold
                  </h3>

                  <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-neutral-600">
                    Explore our handcrafted gold jewellery
                    collection.
                  </p>

                  <span className="mt-7 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-900">
                    View Gold

                    <span className="transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </Link>
              )}

              {/* DIAMOND */}
              {hasDiamond && (
                <Link
                  href={diamondUrl}
                  className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-8 text-center shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl md:p-12"
                >
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-neutral-300 bg-[#faf9f6] transition group-hover:border-neutral-900">
                    <span className="font-serif text-2xl text-neutral-900">
                      D
                    </span>
                  </div>

                  <p className="mt-7 text-xs font-medium uppercase tracking-[0.35em] text-neutral-500">
                    Explore
                  </p>

                  <h3 className="mt-2 font-serif text-3xl text-neutral-900">
                    Diamond
                  </h3>

                  <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-neutral-600">
                    Discover our elegant diamond jewellery
                    collection.
                  </p>

                  <span className="mt-7 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-900">
                    View Diamond

                    <span className="transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </Link>
              )}

            </div>

            {!hasGold && !hasDiamond && (
              <div className="mt-10 rounded-2xl border border-neutral-200 bg-white px-6 py-14 text-center">
                <h3 className="font-serif text-2xl text-neutral-900">
                  Coming Soon
                </h3>

                <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-neutral-600">
                  Products for this category are currently
                  unavailable.
                </p>
              </div>
            )}

          </div>
        </section>
      )}

      {/* SELECTED COLLECTION PRODUCTS */}
      {selectedCollection && (
        <section className="bg-[#faf9f6] px-6 py-12 md:px-10 md:py-16">
          <div className="mx-auto max-w-7xl">

            {/* TOP BAR */}
            <div className="flex flex-col gap-5 border-b border-neutral-200 pb-7 md:flex-row md:items-center md:justify-between">

              <div>
                <Link
                  href={`/categories/${encodedCategorySlug}`}
                  className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-neutral-500 transition hover:text-neutral-900"
                >
                  <span>←</span>
                  <span>Choose Collection</span>
                </Link>

                <h2 className="mt-4 font-serif text-3xl text-neutral-900 md:text-4xl">
                  {selectedCollection} {categoryName}
                </h2>
              </div>

              {/* COLLECTION SWITCH */}
              <div className="flex flex-wrap gap-3">

                {hasGold && (
                  <Link
                    href={goldUrl}
                    className={`rounded-full border px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] transition ${
                      selectedCollection === "Gold"
                        ? "border-[#c9a227] bg-[#c9a227] text-[#1a1402] hover:bg-[#c9a227] hover:text-white"
                        : "border-[#c9a227] bg-[#fcc605] text-[#151414] hover:bg-[#c9a227] hover:text-white"
                    }`}
                  >
                    Gold
                  </Link>
                )}

                {hasDiamond && (
                  <Link
                    href={diamondUrl}
                    className={`rounded-full border px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] transition ${
                      selectedCollection === "Diamond"
                        ? "border-[#c9a227] bg-[#c9a227] text-[#1a1402] hover:bg-[#c9a227] hover:text-white"
                        : "border-[#c9a227] bg-[#f5c105] text-[#080701] hover:bg-[#c9a227] hover:text-white"
                    }`}
                  >
                    Diamond
                  </Link>
                )}

              </div>
            </div>

            {/* PRODUCTS */}
            {selectedProducts.length > 0 ? (
              <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 md:gap-x-6">

                {selectedProducts.map((product) => {
                  const image = getProductImage(product);

                  return (
                    <Link
                      key={product.id}
                      href={getProductHref(product)}
                      className="group"
                    >
                      <article>

                        {/* PRODUCT IMAGE */}
                        <div className="relative aspect-4/5 overflow-hidden rounded-xl bg-white">

                          {image ? (
                            <Image
                              src={image}
                              alt={product.name}
                              fill
                              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                              unoptimized
                              className="object-cover transition duration-700 group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-neutral-100">
                              <span className="font-serif text-2xl text-neutral-400">
                                {selectedCollection}
                              </span>
                            </div>
                          )}

                          {/* COLLECTION BADGE */}
                          <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1.5 backdrop-blur">
                            <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-neutral-800">
                              {selectedCollection}
                            </span>
                          </div>

                        </div>

                        {/* PRODUCT INFO */}
                        <div className="px-1 pt-4">

                          <h3 className="font-serif text-base text-neutral-900 transition group-hover:text-neutral-600 md:text-lg">
                            {product.name}
                          </h3>

                          {product.purity && (
                            <p className="mt-1.5 text-xs uppercase tracking-[0.14em] text-neutral-500">
                              {product.purity}
                            </p>
                          )}

                          {product.description && (
                            <p className="mt-2 line-clamp-2 text-xs leading-5 text-neutral-500">
                              {product.description}
                            </p>
                          )}

                          <span className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-800">
                            View Product

                            <span className="transition-transform group-hover:translate-x-1">
                              →
                            </span>
                          </span>

                        </div>

                      </article>
                    </Link>
                  );
                })}

              </div>
            ) : (
              <div className="mt-12 rounded-2xl border border-neutral-200 bg-white px-6 py-16 text-center">

                <h3 className="font-serif text-2xl text-neutral-900">
                  No Products Available
                </h3>

                <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-neutral-600">
                  There are currently no active{" "}
                  {selectedCollection.toLowerCase()} products
                  in this category.
                </p>

                <Link
                  href={`/categories/${encodedCategorySlug}`}
                  className="mt-7 inline-flex rounded-full border border-neutral-900 bg-neutral-900 px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-neutral-800"
                >
                  Back to Collection
                </Link>

              </div>
            )}

          </div>
        </section>
      )}

      {/* BOTTOM CTA */}
      <section className="border-t border-neutral-200 bg-white px-6 py-16 md:px-10 md:py-20">
        <div className="mx-auto max-w-3xl text-center">

          <p className="text-xs font-medium uppercase tracking-[0.35em] text-neutral-500">
            Mahalaxmi Jewellers & Diamonds
          </p>

          <h2 className="mt-4 font-serif text-3xl text-neutral-900 md:text-4xl">
            Explore More Jewellery
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-neutral-600">
            Discover more categories and find a piece that
            speaks to you.
          </p>

          <Link
            href="/categories"
            className="mt-8 inline-flex rounded-full border border-neutral-900 bg-neutral-900 px-7 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-neutral-800"
          >
            Browse All Categories
          </Link>

        </div>
      </section>

    </main>
  );

}
