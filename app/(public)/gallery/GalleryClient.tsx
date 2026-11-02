"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import type { GalleryImage } from "@/types/gallery";

type GalleryClientProps = {
  images: GalleryImage[];
};

export default function GalleryClient({
  images,
}: GalleryClientProps) {
  const [selectedImage, setSelectedImage] =
    useState<GalleryImage | null>(null);

  useEffect(() => {
    if (!selectedImage) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSelectedImage(null);
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      document.body.style.overflow = "";

      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [selectedImage]);

  return (
    <>
      <div className="columns-1 gap-4 sm:columns-2 sm:gap-5 lg:columns-3 lg:gap-6">
        {images.map((item, index) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setSelectedImage(item)}
            className="group mb-4 block w-full overflow-hidden rounded-2xl bg-white text-left shadow-sm outline-none transition duration-300 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-[#b08a3c] focus-visible:ring-offset-4 sm:mb-5 lg:mb-6"
            aria-label={`Open gallery image ${index + 1}`}
          >
            <div className="relative overflow-hidden">
              {item.image ? (
                <Image
                  src={item.image}
                  alt=""
                  width={800}
                  height={1000}
                  priority={index < 3}
                  unoptimized
                  className="block h-auto w-full object-cover transition duration-700 ease-out group-hover:scale-[1.035]"
                />
              ) : (
                <div className="flex aspect-4/5 items-center justify-center bg-[#f1ede6] text-sm text-[#81786d]">
                  Image unavailable
                </div>
              )}

              <div className="pointer-events-none absolute inset-0 bg-black/0 transition duration-500 group-hover:bg-black/10" />

              <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition duration-500 group-hover:opacity-100">
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/70 bg-white/90 text-[#302921] shadow-lg backdrop-blur-sm">
                  <svg
                    width="19"
                    height="19"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
                      stroke="currentColor"
                      strokeWidth="1.6"
                    />

                    <path
                      d="M20.5 20.5L17 17"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />

                    <path
                      d="M11 7.5V14.5M7.5 11H14.5"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/90 p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label="Gallery image viewer"
          onClick={() => setSelectedImage(null)}
        >
          <button
            type="button"
            onClick={() => setSelectedImage(null)}
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20 sm:right-7 sm:top-7"
            aria-label="Close image"
          >
            <svg
              width="21"
              height="21"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M6 6L18 18"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />

              <path
                d="M18 6L6 18"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </svg>
          </button>

          <div
            className="relative flex max-h-[92vh] max-w-[94vw] items-center justify-center"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <Image
              src={selectedImage.image}
              alt=""
              width={1600}
              height={1600}
              unoptimized
              className="max-h-[92vh] max-w-[94vw] rounded-lg object-contain shadow-2xl"
            />
          </div>
        </div>
      )}
    </>
  );
}
