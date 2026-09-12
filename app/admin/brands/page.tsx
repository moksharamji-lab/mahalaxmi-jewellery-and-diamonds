import Link from "next/link";
import BrandTable from "@/components/admin/BrandTable";
import { getBrands } from "@/services/brand.service";

export default async function BrandsPage() {
  const brands = await getBrands();

  return (
    <div className="space-y-6 text-[#302A23]">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#A47C3A]">
            Management
          </p>

          <h1 className="mt-1 text-4xl font-bold tracking-tight text-[#302A23]">
            Brands
          </h1>

          <p className="mt-2 text-[#6F665B]">
            Manage all jewellery brands.
          </p>
        </div>

        {/* Add Brand */}
        <Link
          href="/admin/brands/new"
          className="inline-flex items-center justify-center rounded-xl border border-[#B08D57] bg-[#B08D57] px-6 py-3 font-semibold text-[#FFF9EF] shadow-sm transition-all duration-200 hover:border-[#8F6F3F] hover:bg-[#8F6F3F] hover:shadow-md"
        >
          + Add Brand
        </Link>
      </div>

      {/* Brand Table */}
      <BrandTable brands={brands} />
    </div>
  );
}