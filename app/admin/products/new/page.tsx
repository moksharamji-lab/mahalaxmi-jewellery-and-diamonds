import ProductForm from "@/components/admin/ProductForm";
import { getCategories } from "@/services/category.service";

export default async function NewProductPage() {
  const categories = await getCategories();

  return (
    <div>
      <h1 className="mb-8 text-4xl font-bold text-white">
        Add Product
      </h1>

      <ProductForm categories={categories} />
    </div>
  );
}