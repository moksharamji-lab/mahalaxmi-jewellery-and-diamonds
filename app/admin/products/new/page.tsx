import ProductForm from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div>
      <h1 className="mb-8 text-4xl font-bold text-white">
        Add Product
      </h1>

      <ProductForm />
    </div>
  );
}