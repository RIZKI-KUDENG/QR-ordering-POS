"use client";

import { useParams } from "next/navigation";
import ProductForm from "../../ProductForm";
import { useCategories } from "@/hooks/useCategories";
import { useProduct, useUpdateProduct } from "@/hooks/useProduct";

export default function EditPage() {
  const params = useParams();
  const productId = params.id as string;

  const { data: categories = [], isLoading: loadingCategories } =
    useCategories();
  const { data: product, isLoading: loadingProduct } = useProduct(
    Number(productId)
  );

  const { mutate: updateProduct, isPending: isSaving } =
    useUpdateProduct(productId);

  const handleSubmit = (data: any) => {
    updateProduct(data);
  };
console.log(product)

  if (loadingCategories || loadingProduct) {
    return <div className="p-6">Memuat data produk...</div>;
  }

  if (!product) {
    return <div className="p-6">Produk tidak ditemukan</div>;
  }

  return (
    <div className="p-6 mx-auto max-w-2xl flex flex-col justify-center items-center">
      <h1 className="text-2xl font-bold mb-6">Edit Product</h1>

      <div className={isSaving ? "opacity-50 pointer-events-none" : ""}>
        <ProductForm
          defaultValues={product}
          categories={categories}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
