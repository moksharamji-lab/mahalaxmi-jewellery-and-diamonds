import CategoryForm from "@/components/admin/CategoryForm";

export default function NewCategoryPage() {
  return (
    <div className="space-y-6 text-[#302A23]">
      {/* Page Header */}
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#A47C3A]">
          Categories
        </p>

        <h1 className="mt-1 text-4xl font-bold tracking-tight text-[#302A23]">
          Add Category
        </h1>

        <p className="mt-2 text-[#6F665B]">
          Create a new jewellery category.
        </p>
      </div>

      {/* Category Form */}
      <CategoryForm />
    </div>
  );
}