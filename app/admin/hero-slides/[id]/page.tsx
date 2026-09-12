import { notFound } from "next/navigation";

import HeroForm from "@/components/admin/HeroForm";
import { getHeroSlide } from "@/services/hero-slide.service";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

async function getHeroSlideOrNotFound(id: string) {
  try {
    return await getHeroSlide(id);
  } catch {
    notFound();
  }
}

export default async function EditHeroSlidePage({
  params,
}: Props) {
  const { id } = await params;

  const slide = await getHeroSlideOrNotFound(id);

  return (
    <div className="space-y-6 text-[#302A23]">
      {/* Page Header */}
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#A47C3A]">
          Hero Slides
        </p>

        <h1 className="mt-1 text-4xl font-bold tracking-tight text-[#302A23]">
          Edit Hero Slide
        </h1>

        <p className="mt-2 text-[#6F665B]">
          Update your homepage banner.
        </p>
      </div>

      {/* Hero Form */}
      <HeroForm initialData={slide} />
    </div>
  );
}