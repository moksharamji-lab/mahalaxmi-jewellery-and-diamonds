import Image from "next/image";
import Link from "next/link";

import DeleteHeroButton from "./DeleteHeroButton";
import type { HeroSlide } from "@/types/hero-slide";

type Props = {
  slides: HeroSlide[];
};

export default function HeroTable({ slides }: Props) {
  if (slides.length === 0) {
    return (
      <div className="rounded-2xl border border-[#D8C9B5] bg-[#FAF6EE] p-8 text-center text-[#6F665B] shadow-[0_4px_18px_rgba(80,60,30,0.04)]">
        No hero slides found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-[#D8C9B5] bg-[#FAF6EE] shadow-[0_4px_18px_rgba(80,60,30,0.04)]">
      <table className="w-full min-w-[900px]">
        <thead className="bg-[#EDE3D3]">
          <tr className="border-b border-[#D8C9B5]">
            <th className="p-4 text-left text-sm font-semibold text-[#A47C3A]">
              Image
            </th>

            <th className="p-4 text-left text-sm font-semibold text-[#A47C3A]">
              Title
            </th>

            <th className="p-4 text-left text-sm font-semibold text-[#A47C3A]">
              Order
            </th>

            <th className="p-4 text-left text-sm font-semibold text-[#A47C3A]">
              Status
            </th>

            <th className="p-4 text-center text-sm font-semibold text-[#A47C3A]">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {slides.map((slide) => (
            <tr
              key={slide.id}
              className="border-b border-[#E3D7C5] last:border-b-0 transition-colors duration-200 hover:bg-[#F7F1E7]"
            >
              {/* Image */}
              <td className="p-4">
                {slide.imageUrl ? (
                  <div className="flex h-[70px] w-[130px] items-center justify-center overflow-hidden rounded-xl border border-[#D8C9B5] bg-[#F8F2E8]">
                    <Image
                      src={slide.imageUrl}
                      alt={slide.title}
                      width={120}
                      height={60}
                      unoptimized
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-[70px] w-[130px] items-center justify-center rounded-xl border border-[#D8C9B5] bg-[#F8F2E8] text-sm font-medium text-[#817668]">
                    No Image
                  </div>
                )}
              </td>

              {/* Title */}
              <td className="p-4">
                <span className="font-semibold text-[#302A23]">
                  {slide.title}
                </span>
              </td>

              {/* Order */}
              <td className="p-4">
                <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-lg border border-[#D8C9B5] bg-[#F0E9DE] px-2 font-semibold text-[#554C42]">
                  {slide.order}
                </span>
              </td>

              {/* Status */}
              <td className="p-4">
                {slide.active ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#8EAF8F] bg-[#E8F1E6] px-3 py-1 text-sm font-semibold text-[#47704A]">
                    <span className="text-xs">●</span>
                    Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D5A3A0] bg-[#F7E9E7] px-3 py-1 text-sm font-semibold text-[#9A4F49]">
                    <span className="text-xs">●</span>
                    Inactive
                  </span>
                )}
              </td>

              {/* Actions */}
              <td className="p-4">
                <div className="flex justify-center gap-3">
                  <Link
                    href={`/admin/hero-slides/${slide.id}`}
                    className="rounded-lg border border-[#B08D57] bg-[#B08D57] px-4 py-2 text-sm font-semibold text-[#FFF9EF] transition-all duration-200 hover:border-[#8F6F3F] hover:bg-[#8F6F3F] hover:shadow-sm"
                  >
                    ✏ Edit
                  </Link>

                  <DeleteHeroButton id={slide.id} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}