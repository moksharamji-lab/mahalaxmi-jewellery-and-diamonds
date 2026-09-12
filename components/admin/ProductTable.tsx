import Image from "next/image";
import Link from "next/link";

import DeleteProductButton from "@/components/admin/DeleteProductButton";
import type { Product } from "@/types/product";

type Props = {
  products: Product[];
  emptyMessage?: string;
};

export default function ProductTable({
  products,
  emptyMessage,
}: Props) {
  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-[#D8C9B5] bg-[#FAF6EE] p-8 text-center text-[#6F665B] shadow-[0_4px_18px_rgba(80,60,30,0.04)]">
        {emptyMessage ?? "No products found."}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-[#D8C9B5] bg-[#FAF6EE] shadow-[0_4px_18px_rgba(80,60,30,0.04)]">
      <table className="w-full min-w-[1200px]">
        <thead className="bg-[#EDE3D3]">
          <tr className="border-b border-[#D8C9B5]">
            <th className="p-4 text-left text-sm font-semibold text-[#A47C3A]">
              Image
            </th>
            <th className="p-4 text-left text-sm font-semibold text-[#A47C3A]">
              Name
            </th>
            <th className="p-4 text-left text-sm font-semibold text-[#A47C3A]">
              Collection
            </th>
            <th className="p-4 text-left text-sm font-semibold text-[#A47C3A]">
              Category
            </th>
            <th className="p-4 text-left text-sm font-semibold text-[#A47C3A]">
              Brand
            </th>
            <th className="p-4 text-left text-sm font-semibold text-[#A47C3A]">
              Purity
            </th>
            <th className="p-4 text-left text-sm font-semibold text-[#A47C3A]">
              Weight
            </th>
            <th className="p-4 text-left text-sm font-semibold text-[#A47C3A]">
              Status
            </th>
            <th className="p-4 text-left text-sm font-semibold text-[#A47C3A]">
              Featured
            </th>
            <th className="p-4 text-center text-sm font-semibold text-[#A47C3A]">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr
              key={product.id}
              className="border-b border-[#E3D7C5] transition-colors duration-200 last:border-b-0 hover:bg-[#F7F1E7]"
            >
              {/* Image */}
              <td className="p-4">
                {product.images.length > 0 ? (
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    width={70}
                    height={70}
                    unoptimized
                    className="h-16 w-16 rounded-xl border border-[#D8C9B5] bg-[#F8F2E8] object-cover shadow-sm"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-[#D8C9B5] bg-[#F8F2E8] text-xs font-medium text-[#817668]">
                    No Image
                  </div>
                )}
              </td>

              {/* Name */}
              <td className="p-4">
                <span className="font-semibold text-[#302A23]">
                  {product.name}
                </span>
              </td>

              {/* Collection */}
              <td className="p-4">
                <span className="font-medium capitalize text-[#554C42]">
                  {product.collection}
                </span>
              </td>

              {/* Category */}
              <td className="p-4">
                <span className="text-[#5F574D]">
                  {product.categoryName || "—"}
                </span>
              </td>

              {/* Brand */}
              <td className="p-4">
                <span className="text-[#5F574D]">
                  {product.brandName || "—"}
                </span>
              </td>

              {/* Purity */}
              <td className="p-4">
                <span className="font-medium text-[#554C42]">
                  {product.purity}
                </span>
              </td>

              {/* Weight */}
              <td className="p-4">
                <span className="font-medium text-[#554C42]">
                  {product.weight} g
                </span>
              </td>

              {/* Status */}
              <td className="p-4">
                {product.active ? (
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

              {/* Featured */}
              <td className="p-4">
                {product.featured ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#CDB17D] bg-[#F5EBD8] px-3 py-1 text-sm font-semibold text-[#8A6529]">
                    <span>★</span>
                    Featured
                  </span>
                ) : (
                  <span className="inline-flex rounded-full border border-[#D8C9B5] bg-[#F0E9DE] px-3 py-1 text-sm font-medium text-[#756B5E]">
                    Normal
                  </span>
                )}
              </td>

              {/* Actions */}
              <td className="p-4">
                <div className="flex justify-center gap-3">
                  <Link
                    href={`/admin/products/${product.id}`}
                    className="rounded-lg border border-[#B08D57] bg-[#B08D57] px-4 py-2 text-sm font-semibold text-[#FFF9EF] transition-all duration-200 hover:border-[#8F6F3F] hover:bg-[#8F6F3F] hover:shadow-sm"
                  >
                    ✏ Edit
                  </Link>

                  <DeleteProductButton id={product.id} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}