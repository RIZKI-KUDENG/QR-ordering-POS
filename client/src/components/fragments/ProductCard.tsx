"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/useCartStore";
import { Plus, Minus } from "lucide-react";

interface ProductCardProps {
  product: any;
  onOpenModal: (product: any) => void;
}

export default function ProductCard({ product, onOpenModal }: ProductCardProps) {
  const { items, addItem, decreaseItem } = useCartStore();
  const hasVariants = product.variants && product.variants.length > 0;
  const cartUniqueId = `${product.id}-`; 
  const cartItem = items.find((item) => item.uniqueId === cartUniqueId);
  const quantity = cartItem ? cartItem.quantity : 0;

  const handleAddDirectly = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      productId: product.id,
      name: product.name,
      price: Number(product.price),
      quantity: 1,
      selectedOptions: [], 
    });
  };

  const handleDecraseDirectly = (e: React.MouseEvent) => {
    e.stopPropagation();
    decreaseItem(cartUniqueId);
  };
  

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden active:scale-[0.99] transition border border-transparent hover:border-gray-200 flex flex-col h-full">
      <div className="relative w-full h-32 shrink-0 bg-gray-100">
        <Image
          src={product.image_url || "/placeholder.png"}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>

      <div className="p-3 flex flex-col flex-1">
        <h3 className="font-semibold text-sm line-clamp-2 leading-tight">
          {product.name}
        </h3>
        <p className="text-slate-900 font-bold text-sm mt-1">
          Rp {Number(product.price).toLocaleString("id-ID")}
        </p>

        <div className="mt-auto pt-3">
          {hasVariants ? (
            /* SKENARIO A: PRODUK DENGAN VARIANT (MIE / MINUMAN CUSTOM) */
            <Button 
              size="sm" 
              className="w-full rounded-full font-semibold border-primary text-primary hover:bg-primary hover:text-white"
              variant="outline"
              onClick={() => onOpenModal(product)}
            >
              Tambah
            </Button>
          ) : (
            /* SKENARIO B: PRODUK TANPA VARIANT (DIMSUM) */
            quantity === 0 ? (
              <Button 
                size="sm" 
                variant="outline"
                className="w-full rounded-full font-semibold border-primary text-primary hover:bg-primary hover:text-white"
                onClick={handleAddDirectly}
              >
                Tambah
              </Button>
            ) : (
              <div className="flex items-center justify-between bg-white border border-gray-200 rounded-full px-1 py-1 shadow-sm">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6 rounded-full hover:bg-gray-100"
                  onClick={handleDecraseDirectly}
                >
                  <Minus className="w-3 h-3" />
                </Button>
                <span className="font-semibold text-sm w-4 text-center">{quantity}</span>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6 rounded-full hover:bg-gray-100"
                  onClick={handleAddDirectly}
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}