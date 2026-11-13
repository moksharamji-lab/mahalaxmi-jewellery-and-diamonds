
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
  const [zoomPosition, setZoomPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [mobileViewer, setMobileViewer] = useState(false);
  const [mobileZoom, setMobileZoom] = useState(1);

  const totalItems = images.length + (video ? 1 : 0);

  const safeSelectedItem =
    selectedItem < totalItems ? selectedItem : 0;

  if (!totalItems) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-2xl border border-[#dfd5c4] bg-[#eee8dc] text-[#8a8174]">
        No image or video available
      </div>
    );
  }

  const isVideoSelected =
    Boolean(video) && safeSelectedItem === images.length;

  const selectedImage = images[safeSelectedItem];

  function handleMouseMove(
    event: React.MouseEvent<HTMLDivElement>
  ) {
    if (isVideoSelected || !selectedImage) return;

    const rect = event.currentTarget.getBoundingClientRect();

    const x = Math.max(
      0,
      Math.min(100, ((event.clientX - rect.left) / rect.width) * 100)
    );

    const y = Math.max(
      0,
      Math.min(100, ((event.clientY - rect.top) / rect.height) * 100)
    );

    setZoomPosition({ x, y });
  }

  function handleImageChange(index: number) {
    setSelectedItem(index);
    setZoomPosition(null);
  }

  return (
    <div className="space-y-4">
      {/* MAIN IMAGE AND AMAZON-STYLE MAGNIFIER */}

      <div className="relative">
        <div
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setZoomPosition(null)}
          onClick={() => {
            if (!isVideoSelected && selectedImage) {
              setMobileViewer(true);
              setMobileZoom(1);
            }
          }}
          className={`relative aspect-square rounded-2xl border border-[#dfd5c4] bg-white shadow-[0_15px_50px_rgba(80,60,30,0.06)] ${
            !isVideoSelected && selectedImage
              ? "cursor-crosshair"
              : ""
          }`}
        >
          <div className="relative h-full w-full overflow-hidden rounded-2xl">
            {isVideoSelected ? (
              <video
                src={video}
                controls
                playsInline
                preload="metadata"
                className="h-full w-full object-contain"
              />
            ) : selectedImage ? (
              <Image
                src={selectedImage}
                alt={productName}
                fill
                priority
                unoptimized
                draggable={false}
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-[#8a8174]">
                No image available
              </div>
            )}
          </div>

          {/* DESKTOP ZOOM LENS */}

          {zoomPosition && (
            <div
              className="pointer-events-none absolute z-20 hidden rounded-full border-2 border-[#b08a3c] bg-[#b08a3c]/15 shadow-lg lg:block"
              style={{
                width: "30%",
                height: "30%",
                left: `${zoomPosition.x}%`,
                top: `${zoomPosition.y}%`,
                transform: "translate(-50%, -50%)",
              }}
            />
          )}

          {/* MOBILE VIEWER HINT */}

          {!isVideoSelected && selectedImage && (
            <div className="absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-2 text-xs text-white lg:hidden">
              Tap to zoom <span className="ml-1">⌕</span>
            </div>
          )}
        </div>

        {/* AMAZON-STYLE MAGNIFIED PREVIEW */}

        {zoomPosition && selectedImage && (
          <div
            className="pointer-events-none absolute left-full top-0 z-50 ml-4 hidden aspect-square w-full overflow-hidden rounded-2xl border border-[#dfd5c4] bg-white shadow-2xl lg:block"
            style={{
              backgroundImage: `url("${selectedImage}")`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "250% 250%",
              backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
            }}
          >
            <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-[#9a762f] shadow">
              Detailed View
            </div>
          </div>
        )}
      </div>

      {/* THUMBNAILS */}

      {totalItems > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => handleImageChange(index)}
              aria-label={`View ${productName} image ${index + 1}`}
              className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 bg-[#eee8dc] transition ${
                safeSelectedItem === index
                  ? "border-[#b08a3c]"
                  : "border-[#dfd5c4] hover:border-[#b08a3c]"
              }`}
            >
              <Image
                src={image}
                alt={`${productName} image ${index + 1}`}
                fill
                unoptimized
                className="object-contain"
                sizes="80px"
              />
            </button>
          ))}

          {video && (
            <button
              type="button"
              onClick={() => handleImageChange(images.length)}
              aria-label={`Play ${productName} video`}
              className={`relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 bg-[#1c1a17] transition ${
                safeSelectedItem === images.length
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

      {/* MOBILE / FULL IMAGE VIEWER */}

      {mobileViewer && selectedImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4"
          onClick={() => setMobileViewer(false)}
        >
          <button
            type="button"
            onClick={() => setMobileViewer(false)}
            aria-label="Close image viewer"
            className="absolute right-5 top-5 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-2xl text-white"
          >
            ×
          </button>

          <div
            className="relative h-[75vh] w-full max-w-5xl overflow-hidden"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={selectedImage}
              alt={`${productName} enlarged view`}
              fill
              unoptimized
              draggable={false}
              className="object-contain transition-transform duration-200"
              style={{
                transform: `scale(${mobileZoom})`,
              }}
              sizes="100vw"
            />
          </div>

          <div
            className="absolute bottom-8 flex items-center gap-5"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() =>
                setMobileZoom((value) => Math.max(1, value - 0.5))
              }
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-2xl text-[#1c1a17]"
              aria-label="Zoom out"
            >
              −
            </button>

            <span className="min-w-14 text-center text-sm text-white">
              {Math.round(mobileZoom * 100)}%
            </span>

            <button
              type="button"
              onClick={() =>
                setMobileZoom((value) => Math.min(4, value + 0.5))
              }
              className="flex h-12 w-12 items-center justify-center rounded-full bg-[#b08a3c] text-2xl text-white"
              aria-label="Zoom in"
            >
              +
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
