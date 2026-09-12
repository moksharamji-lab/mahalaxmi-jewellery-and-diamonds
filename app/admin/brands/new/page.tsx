import BrandForm from "@/components/admin/BrandForm";

export default function NewBrandPage() {
  return (
    <div className="space-y-6 text-[#302A23]">
      {/* Page Header */}
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#A47C3A]">
          Brands
        </p>

        <h1 className="mt-1 text-4xl font-bold tracking-tight text-[#302A23]">
          Add Brand
        </h1>

        <p className="mt-2 text-[#6F665B]">
          Create a new jewellery brand.
        </p>
      </div>

      {/* Brand Form */}
      <BrandForm />
    </div>
  );
}