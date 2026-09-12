import { notFound } from "next/navigation";

import BrandForm from "@/components/admin/BrandForm";
import { getBrand } from "@/services/brand.service";

type Props = {
  params: Promise<{ id: string }>;
};

async function getBrandOrNotFound(id: string) {
  try {
    return await getBrand(id);
  } catch {
    notFound();
  }
}

export default async function EditBrandPage({
  params,
}: Props) {
  const { id } = await params;
  const brand = await getBrandOrNotFound(id);

  return (
    <div className="space-y-6 text-[#302A23]">
      {/* Page Header */}
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#A47C3A]">
          Brands
        </p>

        <h1 className="mt-1 text-4xl font-bold tracking-tight text-[#302A23]">
          Edit Brand
        </h1>

        <p className="mt-2 text-[#6F665B]">
          Update your jewellery brand.
        </p>
      </div>

      {/* Brand Form */}
      <BrandForm initialData={brand} />
    </div>
  );
}