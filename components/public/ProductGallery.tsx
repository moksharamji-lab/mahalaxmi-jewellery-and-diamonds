"use client";

import { useState } from "react";
import Image from "next/image";

type ProductGalleryProps = {
  images: string[];
  video?: string;
  productName: string;
};

export default function ProductGallery({
  images,
  video,
  productName,
}: ProductGalleryProps) {
  const [selectedItem, setSelectedItem] = useState(0);

  const totalItems = images.length + (video ? 1 : 0);

  if (!totalItems) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-2xl border border-[#dfd5c4] bg-[#eee8dc] text-[#8a8174]">
        No image or video available
      </div>
    );
  }

  const isVideoSelected =
    video && selectedItem === images.length;

  return (
    <div className="space-y-4">
      {/* =====================================================
          MAIN MEDIA
      ===================================================== */}

      <div className="relative aspect-square overflow-hidden rounded-2xl border border-[#dfd5c4] bg-white shadow-[0_15px_50px_rgba(80,60,30,0.06)]">
        {isVideoSelected ? (
          <video
            src={video}
            controls
            playsInline
            preload="metadata"
            className="h-full w-full object-contain"
          />
        ) : (
          <Image
            src={images[selectedItem]}
            alt={productName}
            fill
            priority
            unoptimized
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        )}
      </div>

      {/* =====================================================
          THUMBNAILS
      ===================================================== */}

      {totalItems > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {/* =================================================
              IMAGE THUMBNAILS
          ================================================= */}

          {images.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setSelectedItem(index)}
              aria-label={`View ${productName} image ${index + 1}`}
              className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 bg-[#eee8dc] transition ${
                selectedItem === index
                  ? "border-[#b08a3c]"
                  : "border-[#dfd5c4] hover:border-[#b08a3c]"
              }`}
            >
              <Image
                src={image}
                alt={`${productName} image ${index + 1}`}
                fill
                unoptimized
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}

          {/* =================================================
              VIDEO THUMBNAIL
          ================================================= */}

          {video && (
            <button
              type="button"
              onClick={() => setSelectedItem(images.length)}
              aria-label={`Play ${productName} video`}
              className={`relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 bg-[#1c1a17] transition ${
                selectedItem === images.length
                  ? "border-[#b08a3c]"
                  : "border-[#dfd5c4] hover:border-[#b08a3c]"
              }`}
            >
              <video
                src={video}
                muted
                preload="metadata"
                playsInline
                className="absolute inset-0 h-full w-full object-cover opacity-60"
              />

              {/* Play button */}

              <span className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[#b08a3c] text-lg text-white shadow-lg">
                ▶
              </span>

              <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[9px] font-semibold uppercase tracking-wider text-white">
                Video
              </span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}