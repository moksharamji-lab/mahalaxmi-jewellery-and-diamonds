"use client";

import Link from "next/link";
import {
  useEffect,
  useState,
} from "react";

import type { HeroSlide } from "@/types/hero-slide";

type Props = {
  slides: HeroSlide[];
};

export default function HeroSlider({
  slides,
}: Props) {
  const [currentIndex, setCurrentIndex] =
    useState(0);

  const activeSlides = slides.filter(
    (slide) =>
      slide.active &&
      (
        slide.videoUrl ||
        slide.imageUrl
      )
  );

  const slideCount =
    activeSlides.length;

  const safeIndex =
    slideCount > 0 &&
    currentIndex < slideCount
      ? currentIndex
      : 0;

  /* =====================================================
     AUTOMATIC SLIDER
  ===================================================== */

  useEffect(() => {
    if (slideCount <= 1) {
      return;
    }

    const interval =
      window.setInterval(() => {
        setCurrentIndex(
          (current) =>
            current >= slideCount - 1
              ? 0
              : current + 1
        );
      }, 7000);

    return () => {
      window.clearInterval(
        interval
      );
    };
  }, [slideCount]);

  /* =====================================================
     FALLBACK
  ===================================================== */

  if (slideCount === 0) {
    return (
      <section className="relative min-h-[650px] overflow-hidden border-b border-[#e5ded2] bg-[#f8f5ef] sm:min-h-[700px] lg:min-h-[760px]">

        <div className="pointer-events-none absolute left-[-180px] top-[-160px] h-[420px] w-[420px] rounded-full bg-[#d6b878]/10 blur-3xl" />

        <div className="pointer-events-none absolute bottom-[-180px] right-[-180px] h-[420px] w-[420px] rounded-full bg-[#b08d57]/10 blur-3xl" />

        <div className="relative z-10 mx-auto flex min-h-[650px] max-w-[1400px] items-center px-5 py-24 sm:min-h-[700px] sm:px-8 sm:py-28 lg:min-h-[760px] lg:px-10">

          <div className="mx-auto w-full max-w-5xl text-center">

            {/* LABEL */}

            <div className="flex items-center justify-center gap-3 sm:gap-4">

              <span className="h-px w-8 bg-[#b08d57] sm:w-14" />

              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#b08d57] sm:text-xs sm:tracking-[0.4em]">
                The Art of Jewellery
              </p>

              <span className="h-px w-8 bg-[#b08d57] sm:w-14" />

            </div>

            {/* TITLE */}

            <h1 className="mt-8 font-display text-5xl font-normal leading-[1.02] tracking-[-0.03em] text-[#1c1a17] sm:text-6xl md:text-7xl lg:text-[82px]">
              Timeless Elegance

              <span className="mt-2 block text-[#b08d57]">
                Crafted For You
              </span>
            </h1>

            {/* DESCRIPTION */}

            <p className="mx-auto mt-8 max-w-2xl text-sm leading-7 text-[#777169] sm:text-base sm:leading-8 md:text-lg">
              Discover exquisite gold and
              diamond jewellery designed to
              celebrate your most precious
              moments.
            </p>

            {/* BUTTONS */}

            <div className="mx-auto mt-10 flex w-full max-w-xl flex-col gap-3 sm:flex-row sm:gap-4">

              <Link
                href="/gold"
                className="flex min-h-[52px] flex-1 items-center justify-center bg-[#b08d57] px-7 text-xs font-semibold uppercase tracking-[0.18em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#8f6f3f]"
              >
                Explore Gold
              </Link>

              <Link
                href="/diamond"
                className="flex min-h-[52px] flex-1 items-center justify-center bg-[#b08d57] px-7 text-xs font-semibold uppercase tracking-[0.18em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#8f6f3f]"
              >
                Explore Diamonds
              </Link>

            </div>

            {/* DECORATIVE DIVIDER */}

            <div className="mx-auto mt-14 flex items-center justify-center gap-3">

              <span className="h-px w-10 bg-[#e5ded2]" />

              <span className="text-sm text-[#d6b878]">
                ✦
              </span>

              <span className="h-px w-10 bg-[#e5ded2]" />

            </div>

          </div>

        </div>

      </section>
    );
  }

  const slide =
    activeSlides[safeIndex];

  return (
    <section className="relative min-h-[650px] overflow-hidden border-b border-[#e5ded2] bg-[#1c1a17] sm:min-h-[700px] lg:min-h-[760px]">

      {/* =================================================
          MEDIA
      ================================================= */}

      <div className="absolute inset-0">

        {slide.videoUrl ? (
          <video
            key={slide.videoUrl}
            src={slide.videoUrl}
            poster={
              slide.imageUrl ||
              undefined
            }
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="h-full w-full object-cover"
          />
        ) : slide.imageUrl ? (
          <img
            src={slide.imageUrl}
            alt={
              slide.title ||
              "Mahalaxmi Jewellers and Diamonds"
            }
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-[#1c1a17]" />
        )}

        {/* DARK OVERLAY */}

        <div className="absolute inset-0 bg-[#1c1a17]/45" />

        {/* GRADIENT */}

        <div className="absolute inset-0 bg-gradient-to-r from-[#1c1a17]/70 via-[#1c1a17]/35 to-[#1c1a17]/20" />

      </div>

      {/* =================================================
          CONTENT
      ================================================= */}

      <div className="relative z-10 mx-auto flex min-h-[650px] max-w-[1400px] items-center px-5 py-24 sm:min-h-[700px] sm:px-8 sm:py-28 lg:min-h-[760px] lg:px-10">

        <div
          key={slide.id}
          className="mx-auto w-full max-w-5xl text-center"
        >

          {/* LABEL */}

          <div className="flex items-center justify-center gap-3 sm:gap-4">

            <span className="h-px w-8 bg-[#d6b878] sm:w-14" />

            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#d6b878] sm:text-xs sm:tracking-[0.4em]">
              {slide.subtitle ||
                "The Art of Jewellery"}
            </p>

            <span className="h-px w-8 bg-[#d6b878] sm:w-14" />

          </div>

          {/* TITLE */}

          <h1 className="mt-8 font-display text-5xl font-normal leading-[1.02] tracking-[-0.03em] text-white sm:text-6xl md:text-7xl lg:text-[82px]">
            {slide.title ||
              "Timeless Elegance"}
          </h1>

          {/* DESCRIPTION */}

          <p className="mx-auto mt-8 max-w-2xl text-sm leading-7 text-[#f5f0e8] sm:text-base sm:leading-8 md:text-lg">
            Discover exquisite gold and
            diamond jewellery designed to
            celebrate your most precious
            moments.
          </p>

          {/* GOLD + DIAMOND BUTTONS */}

          <div className="mx-auto mt-10 flex w-full max-w-xl flex-col gap-3 sm:flex-row sm:gap-4">

            <Link
              href="/gold"
              className="flex min-h-[52px] flex-1 items-center justify-center bg-[#b08d57] px-7 text-xs font-semibold uppercase tracking-[0.18em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#8f6f3f]"
            >
              Explore Gold
            </Link>

            <Link
              href="/diamond"
              className="flex min-h-[52px] flex-1 items-center justify-center bg-[#b08d57] px-7 text-xs font-semibold uppercase tracking-[0.18em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#8f6f3f]"
            >
              Explore Diamonds
            </Link>

          </div>

          {/* DIVIDER */}

          <div className="mx-auto mt-14 flex items-center justify-center gap-3">

            <span className="h-px w-10 bg-white/30" />

            <span className="text-sm text-[#d6b878]">
              ✦
            </span>

            <span className="h-px w-10 bg-white/30" />

          </div>

        </div>

      </div>

      {/* =================================================
          SLIDE INDICATORS
      ================================================= */}

      {slideCount > 1 && (
        <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">

          {activeSlides.map(
            (item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() =>
                  setCurrentIndex(index)
                }
                aria-label={`Go to hero slide ${
                  index + 1
                }`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === safeIndex
                    ? "w-8 bg-white"
                    : "w-2 bg-white/50"
                }`}
              />
            )
          )}

        </div>
      )}

    </section>
  );
}