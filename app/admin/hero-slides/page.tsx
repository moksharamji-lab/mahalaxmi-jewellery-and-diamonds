import Link from "next/link";
import HeroTable from "@/components/admin/HeroTable";
import { getHeroSlides } from "@/services/hero-slide.service";

export default async function HeroSlidesPage() {
  const slides = await getHeroSlides();

  return (
    <div className="space-y-8 text-[#302A23]">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#A47C3A]">
            Management
          </p>

          <h1 className="mt-1 text-4xl font-bold tracking-tight text-[#302A23]">
            Hero Slides
          </h1>

          <p className="mt-2 text-[#6F665B]">
            Manage homepage banners.
          </p>
        </div>

        {/* Add Hero Slide */}
        <Link
          href="/admin/hero-slides/new"
          className="inline-flex items-center justify-center rounded-xl border border-[#B08D57] bg-[#B08D57] px-6 py-3 font-semibold text-[#FFF9EF] shadow-sm transition-all duration-200 hover:border-[#8F6F3F] hover:bg-[#8F6F3F] hover:shadow-md"
        >
          + Add Hero Slide
        </Link>
      </div>

      {/* Hero Slides Table */}
      <HeroTable slides={slides} />
    </div>
  );
}