import { notFound } from "next/navigation";

import CategoryForm from "@/components/admin/CategoryForm";
import { getCategoryById } from "@/services/category.service";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditCategoryPage({
  params,
}: Props) {
  const { id } = await params;

  let category;

  try {
    category = await getCategoryById(id);
  } catch (error) {
    console.error(
      "Failed to load category:",
      error
    );

    notFound();
  }

  if (!category) {
    notFound();
  }

  return (
    <div className="text-[#302A23]">
      {/* Page Header */}
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#A47C3A]">
          Categories
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#302A23]">
          Edit Category
        </h1>

        <p className="mt-2 text-sm text-[#6F665B]">
          Update the category information used by
          your jewellery website.
        </p>
      </div>

      {/* Category Form */}
      <CategoryForm category={category} />
    </div>
  );
}