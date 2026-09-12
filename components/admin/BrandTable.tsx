"use client";

import Link from "next/link";

import DeleteBrandButton from "./DeleteBrandButton";
import type { Brand } from "@/types/brand";

type Props = {
  brands: Brand[];
};

export default function BrandTable({ brands }: Props) {
  if (brands.length === 0) {
    return (
      <div className="rounded-2xl border border-[#D8C9B5] bg-[#FAF6EE] p-8 text-center text-[#6F665B] shadow-[0_4px_18px_rgba(80,60,30,0.04)]">
        No brands found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-[#D8C9B5] bg-[#FAF6EE] shadow-[0_4px_18px_rgba(80,60,30,0.04)]">
      <table className="w-full min-w-[700px]">
        <thead className="bg-[#EDE3D3]">
          <tr className="border-b border-[#D8C9B5]">
            <th className="px-6 py-4 text-left text-sm font-semibold text-[#A47C3A]">
              Name
            </th>

            <th className="px-6 py-4 text-left text-sm font-semibold text-[#A47C3A]">
              Slug
            </th>

            <th className="px-6 py-4 text-left text-sm font-semibold text-[#A47C3A]">
              Status
            </th>

            <th className="px-6 py-4 text-right text-sm font-semibold text-[#A47C3A]">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {brands.map((brand) => (
            <tr
              key={brand.id}
              className="border-b border-[#E3D7C5] last:border-b-0 transition-colors duration-200 hover:bg-[#F7F1E7]"
            >
              {/* Name */}
              <td className="px-6 py-4">
                <span className="font-semibold text-[#302A23]">
                  {brand.name}
                </span>
              </td>

              {/* Slug */}
              <td className="px-6 py-4">
                <span className="rounded-md border border-[#D8C9B5] bg-[#F0E9DE] px-2.5 py-1 font-mono text-sm text-[#5F574D]">
                  {brand.slug}
                </span>
              </td>

              {/* Status */}
              <td className="px-6 py-4">
                {brand.active ? (
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
              <td className="px-6 py-4">
                <div className="flex justify-end gap-3">
                  <Link
                    href={`/admin/brands/${brand.id}`}
                    className="rounded-lg border border-[#B08D57] bg-[#B08D57] px-4 py-2 text-sm font-semibold text-[#FFF9EF] transition-all duration-200 hover:border-[#8F6F3F] hover:bg-[#8F6F3F] hover:shadow-sm"
                  >
                    ✏ Edit
                  </Link>

                  <DeleteBrandButton id={brand.id} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}