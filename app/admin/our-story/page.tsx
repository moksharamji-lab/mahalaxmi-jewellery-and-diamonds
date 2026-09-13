import { getOurStoryForAdmin } from "@/services/our-story.service";

import OurStoryForm from "@/components/admin/our-story/OurStoryForm";

export default async function AdminOurStoryPage() {
  const story = await getOurStoryForAdmin();

  return (
    <div className="max-w-5xl text-[#302A23]">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#A47C3A]">
          Home Page Management
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#302A23] md:text-4xl">
          Our Story
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6F665B]">
          Manage the Our Story content displayed
          on the Home page.
        </p>
      </div>

      <OurStoryForm story={story} />
    </div>
  );
}