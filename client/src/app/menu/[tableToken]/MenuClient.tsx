"use client";
import { useTableByToken } from "@/hooks/useTable";
import { useProducts } from "@/hooks/useProduct";
import Image from "next/image";
import { useCategories } from "@/hooks/useCategories";
import { useState, useMemo } from "react";

export default function MenuClient({ token }: { token: string }) {
  const { data: table, isLoading, isError } = useTableByToken(token);
  const { data: products = [] } = useProducts();
  const { data: categories = [] } = useCategories();
  const [activeCategory, setActiveCategory] = useState<string>("ALL");

  const filteredProducts = useMemo(() => {
    if (activeCategory === "ALL") return products;

    return products.filter(
      (product: any) => product.category?.name === activeCategory
    );
  }, [products, activeCategory]);

  if (isLoading) {
    return <div className="p-6">Memuat menu...</div>;
  }
  if (isError) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold">QR Code tidak valid</h1>
        <p className="text-gray-500">Silakan hubungi kasir</p>
      </div>
    );
  }
  console.log(table);
  console.log(products);
  return (
    <div className="min-h-screen bg-slate-50">
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
      <div className="sticky top-[200px] z-20 ">
        <div className="px-4 pb-3">
          <ul className="flex gap-3 overflow-x-auto no-scrollbar">
            <li
              onClick={() => setActiveCategory("ALL")}
              className={`shrink-0 px-4 py-2 rounded-full font-semibold text-sm cursor-pointer transition
      ${
        activeCategory === "ALL"
          ? "bg-slate-900 text-white"
          : "bg-white border text-slate-700"
      }
    `}
            >
              Semua
            </li>

            {categories.map((category: any) => (
              <li
                key={category.id}
                onClick={() => setActiveCategory(category.name)}
                className={`shrink-0 px-4 py-2 rounded-full font-semibold text-sm cursor-pointer transition
        ${
          activeCategory === category.name
            ? "bg-slate-900 text-white"
            : "bg-white border text-slate-700"
        }
      `}
              >
                {category.name}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* PRODUK */}
      <div className="px-4 pb-24">
        <div className="grid grid-cols-2 gap-4">
          {filteredProducts.map((product: any) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-sm overflow-hidden active:scale-[0.98] transition"
            >
              <div className="relative w-full h-32">
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-3">
                <h3 className="font-semibold text-sm line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-slate-500 text-xs mt-1">
                  Rp {product.price?.toLocaleString("id-ID")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
