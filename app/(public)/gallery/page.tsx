import { getActiveGalleryImages } from "@/services/gallery.service";

import GalleryClient from "./GalleryClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Gallery | Mahalaxmi Jewellers & Diamonds",
  description:
    "Explore the elegance, craftsmanship and timeless beauty of Mahalaxmi Jewellers & Diamonds.",
};

export default async function GalleryPage() {
  const images = await getActiveGalleryImages();

  return (
    <main className="min-h-screen bg-[#f8f6f1]">
      <section className="border-b border-[#e8e0d4] bg-[#f8f6f1] px-5 pb-10 pt-14 sm:px-8 sm:pb-14 sm:pt-20 lg:px-12">
        <div className="mx-auto max-w-7xl text-center">
          <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.38em] text-[#a17a35] sm:text-xs">
            Mahalaxmi Jewellers & Diamonds
          </p>

          <h1 className="font-serif text-4xl font-medium tracking-tight text-[#211c17] sm:text-5xl lg:text-6xl">
            Gallery
          </h1>

          <div className="mx-auto mt-5 h-px w-16 bg-[#b08a3c]" />

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#746d64] sm:text-base">
            A glimpse into our world of timeless jewellery,
            craftsmanship and elegance.
          </p>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 sm:py-12 lg:px-10 lg:py-16">
        <div className="mx-auto max-w-7xl">
          {images.length === 0 ? (
            <div className="flex min-h-90 items-center justify-center rounded-2xl border border-[#e3dbcf] bg-white">
              <div className="text-center">
                <p className="font-serif text-2xl text-[#302921]">
                  Our Gallery
                </p>

                <p className="mt-2 text-sm text-[#81786d]">
                  Beautiful moments are coming soon.
                </p>
              </div>
            </div>
          ) : (
            <GalleryClient images={images} />
          )}
        </div>
      </section>
    </main>
  );
}