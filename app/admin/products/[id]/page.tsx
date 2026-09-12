import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import { getProduct } from "@/services/product.service";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditProductPage({
  params,
}: Props) {
  const { id } = await params;

  let product;

  try {
    product = await getProduct(id);
  } catch {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-white">
          Edit Product
        </h1>

        <p className="mt-2 text-zinc-400">
          Update your jewellery product.
        </p>
      </div>

      

      <ProductForm initialData={product} />
    </div>
  );
}