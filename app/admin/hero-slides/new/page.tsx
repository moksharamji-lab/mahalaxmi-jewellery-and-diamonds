import HeroForm from "@/components/admin/HeroForm";

export default function NewHeroSlidePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-white">
          Add Hero Slide
        </h1>

        <p className="mt-2 text-zinc-400">
          Create a new homepage banner.
        </p>
      </div>

      <HeroForm />
    </div>
  );
}