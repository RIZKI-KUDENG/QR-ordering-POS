"use client";

import ProductForm from "../../ProductForm";
import { useCategories } from "@/hooks/useCategories";
import { useCreateProduct } from "@/hooks/useProduct";

export default function CreatePage() {
  const { data: categories = [], isLoading: isLoadingCategories } =
    useCategories();

  const { mutate: createProduct, isPending: isSaving } = useCreateProduct();

  const handleSubmit = (data: any) => {
    createProduct(data);
  };

  if (isLoadingCategories) {
    return <div className="p-6">Memuat kategori...</div>;
  }

  

  return (
    <div className="p-6 h-screen flex flex-col justify-center items-center">
      <h1 className="text-2xl font-bold mb-6">Create Product</h1>
      <div className={isSaving ? "opacity-50 pointer-events-none" : ""}>
        <ProductForm categories={categories} onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
