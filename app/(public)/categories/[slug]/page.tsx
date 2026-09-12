import Link from "next/link";
import { notFound } from "next/navigation";

import {
  getCategories,
  type Category,
} from "@/services/category.service";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

function createSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-");
}

export default async function CategoryPage({
  params,
}: Props) {
  const { slug } = await params;

  let categories: Category[] = [];

  try {
    categories = await getCategories();
  } catch (error) {
    console.error("Failed to load categories:", error);
  }

  const category = categories.find(
    (item) =>
      item.active &&
      createSlug(item.name) === slug
  );

  if (!category) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#f8f5ef] text-[#1c1a17]">

      {/* HERO */}
      <section className="px-5 pb-16 pt-20 sm:px-8 sm:pt-24 lg:px-12 lg:pt-28">
        <div className="mx-auto max-w-5xl text-center">

          <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.35em] text-[#b08d57]">
            Explore
          </p>

          <h1 className="font-display text-5xl font-normal tracking-[-0.03em] text-[#1c1a17] sm:text-6xl lg:text-7xl">
            Discover {category.name}
          </h1>

          <div className="mx-auto my-7 h-px w-14 bg-[#b08d57]" />

          <p className="mx-auto max-w-2xl text-sm leading-7 text-[#777169] sm:text-base">
            Explore this category across our jewellery collections.
          </p>

        </div>
      </section>


      {/* COLLECTION OPTIONS */}
      <section className="px-5 pb-20 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">

          <div className="grid gap-6 md:grid-cols-2">

            {/* GOLD */}
            <CollectionCard
              href={`/gold?category=${encodeURIComponent(
                category.name
              )}`}
              label="Gold Collection"
              title={`Gold ${category.name}`}
              description={`Discover beautiful ${category.name.toLowerCase()} crafted in gold, designed with timeless elegance and attention to detail.`}
              action="Explore Gold"
            />

            {/* DIAMOND */}
            <CollectionCard
              href={`/diamond?category=${encodeURIComponent(
                category.name
              )}`}
              label="Diamond Collection"
              title={`Diamond ${category.name}`}
              description={`Explore elegant ${category.name.toLowerCase()} in diamonds, created to add brilliance and sophistication to every special moment.`}
              action="Explore Diamonds"
            />

          </div>

        </div>
      </section>


      {/* BACK TO CATEGORIES */}
      <section className="px-5 pb-20 text-center sm:px-8">
        <Link
          href="/categories"
          className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-[#1c1a17] transition-colors hover:text-[#b08d57]"
        >
          <span>←</span>
          Back to All Categories
        </Link>
      </section>


      {/* BOTTOM CTA */}
      <section className="border-t border-[#e5ded2] bg-[#f1ece3] px-5 py-20 sm:px-8 lg:py-24">
        <div className="mx-auto max-w-3xl text-center">

          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#b08d57]">
            Find Your Perfect Piece
          </p>

          <h2 className="font-display text-4xl font-normal tracking-[-0.02em] text-[#1c1a17] sm:text-5xl">
            Something Beautiful Awaits
          </h2>

          <div className="mx-auto my-6 h-px w-12 bg-[#b08d57]" />

          <p className="mx-auto mb-8 max-w-xl text-sm leading-7 text-[#777169]">
            Explore our complete jewellery collections and discover
            something made for your special moments.
          </p>

          <div className="flex flex-col justify-center gap-3 sm:flex-row">

            <Link
              href="/gold"
              className="inline-flex min-h-[50px] items-center justify-center bg-[#b08d57] px-8 text-xs font-semibold uppercase tracking-[0.18em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#8f6f3f]"
            >
              Explore Gold
            </Link>

            <Link
              href="/diamond"
              className="inline-flex min-h-[50px] items-center justify-center bg-[#b08d57] px-8 text-xs font-semibold uppercase tracking-[0.18em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#8f6f3f]"
            >
              Explore Diamonds
            </Link>

          </div>

        </div>
      </section>

    </main>
  );
}


function CollectionCard({
  href,
  label,
  title,
  description,
  action,
}: {
  href: string;
  label: string;
  title: string;
  description: string;
  action: string;
}) {
  return (
    <Link
      href={href}
      className="group relative block min-h-[430px] overflow-hidden border border-[#e5ded2] bg-[#f1ece3] p-8 transition-all duration-500 hover:-translate-y-1 hover:border-[#b08d57] sm:p-10 lg:p-12"
    >

      {/* Decorative circle */}
      <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full border border-[#e5ded2] transition-transform duration-700 group-hover:scale-110" />

      {/* Diamond icon */}
      <div className="relative mb-10 flex h-16 w-16 items-center justify-center border border-[#d6c8b5]">
        <span className="text-xl text-[#b08d57]">◇</span>
      </div>

      <div className="relative">

        <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#b08d57]">
          {label}
        </p>

        <h2 className="font-display text-4xl font-normal leading-tight tracking-[-0.02em] text-[#1c1a17] sm:text-5xl">
          {title}
        </h2>

        <div className="my-6 h-px w-11 bg-[#b08d57]" />

        <p className="max-w-xl text-sm leading-7 text-[#777169]">
          {description}
        </p>

        <div className="mt-9 text-xs font-semibold uppercase tracking-[0.2em] text-[#1c1a17] transition-colors group-hover:text-[#b08d57]">
          {action} →
        </div>

      </div>

    </Link>
  );
}