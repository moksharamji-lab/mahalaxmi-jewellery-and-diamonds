import Link from "next/link";
import CategoryTable from "@/components/admin/CategoryTable";
import { getCategories } from "@/services/category.service";

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-6 text-[#302A23]">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#A47C3A]">
            Management
          </p>

          <h1 className="mt-1 text-4xl font-bold tracking-tight text-[#302A23]">
            Categories
          </h1>

          <p className="mt-2 text-[#6F665B]">
            Manage all jewellery categories.
          </p>
        </div>

        {/* Add Category */}
        <Link
          href="/admin/categories/new"
          className="inline-flex items-center justify-center rounded-xl border border-[#B08D57] bg-[#B08D57] px-6 py-3 font-semibold text-[#FFF9EF] shadow-sm transition-all duration-200 hover:border-[#8F6F3F] hover:bg-[#8F6F3F] hover:shadow-md"
        >
          + Add Category
        </Link>
      </div>

      {/* Category Table */}
      <CategoryTable categories={categories} />
    </div>
  );
}