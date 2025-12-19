"use client";
import { useTableByToken } from "@/hooks/useTable";
import { useProducts } from "@/hooks/useProduct";
import Image from "next/image";
import { useCategories } from "@/hooks/useCategories";
import { useState, useMemo } from "react";
import ProductModal from "@/components/fragments/ProductModal"; // Import Modal
import ProductCard from "@/components/fragments/ProductCard";   // Import Card Baru
import FloatingCart from "@/components/fragments/FloatingCart";

export default function MenuClient({ token }: { token: string }) {
  const { data: table, isLoading, isError } = useTableByToken(token);
  const { data: products = [] } = useProducts();
  const { data: categories = [] } = useCategories();
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    if (activeCategory === "ALL") return products;
    return products.filter(
      (product: any) => product.category?.name === activeCategory
    );
  }, [products, activeCategory]);

  const handleOpenModal = (product: any) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  if (isLoading) return <div className="p-6">Memuat menu...</div>;
  if (isError) return <div className="p-6 text-red-500">QR Code tidak valid</div>;

  return (
    <div className="min-h-screen bg-slate-50 relative pb-32"> 
      
      {/* HEADER */}
      <div className="bg-white shadow-sm sticky top-0 z-30">
        <div className="flex flex-col items-center py-4">
          <Image
            src="https://upload.wikimedia.org/wikipedia/id/thumb/5/5c/LogoMieGacoan.png/500px-LogoMieGacoan.png"
            width={120}
            height={120}
            alt="logo"
            priority
            className="w-28 h-28 object-contain"
          />
          <h1 className="text-2xl font-extrabold tracking-tight mt-2">
            Menu Gacoan
          </h1>
        </div>
      </div>

      {/* INFO MEJA */}
      <div className="flex justify-center my-4">
        <div className="px-6 py-2 rounded-full bg-slate-900 text-white font-semibold text-sm shadow">
          Meja No. {table?.number}
        </div>
      </div>

      {/* KATEGORI */}
      <div className="sticky top-40 z-20 bg-slate-50 pt-2 pb-4">
        <div className="px-4">
          <ul className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
            <li
              onClick={() => setActiveCategory("ALL")}
              className={`shrink-0 px-4 py-2 rounded-full font-semibold text-sm cursor-pointer transition select-none
                ${activeCategory === "ALL" ? "bg-slate-900 text-white" : "bg-white border border-slate-200 text-slate-700 shadow-sm"}`}
            >
              Semua
            </li>
            {categories.map((category: any) => (
              <li
                key={category.id}
                onClick={() => setActiveCategory(category.name)}
                className={`shrink-0 px-4 py-2 rounded-full font-semibold text-sm cursor-pointer transition select-none
                  ${activeCategory === category.name ? "bg-slate-900 text-white" : "bg-white border border-slate-200 text-slate-700 shadow-sm"}`}
              >
                {category.name}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* LIST PRODUK */}
      <div className="px-4">
        <div className="grid grid-cols-2 gap-4">
          {filteredProducts.map((product: any) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onOpenModal={handleOpenModal} 
            />
          ))}
        </div>
      </div>

      {/* MODAL */}
      <ProductModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={selectedProduct}
      />
      
          {
            !isModalOpen ? <FloatingCart  tableToken={token} /> : null
          }
    </div>
  );
}