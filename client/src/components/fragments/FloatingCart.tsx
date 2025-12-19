"use client";

import { useCartStore } from "@/store/useCartStore";
import { ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import CartModal from "./CartModal";

interface FloatingCartProps {
  tableToken: string;
}

export default function FloatingCart({ tableToken }: FloatingCartProps) {
  const [mounted, setMounted] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const { items, totalPrice } = useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const totalQty = items.reduce((acc, item) => acc + item.quantity, 0);

  if (totalQty === 0) return null;

  return (
    <>
      {/* Floating Bar */}
      <div className="fixed bottom-4 left-4 right-4 z-50 animate-in slide-in-from-bottom fade-in duration-300">
        <div 
          onClick={() => setIsCartOpen(true)}
          className="bg-slate-900 text-white rounded-full shadow-2xl p-4 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-transform border border-slate-700/50"
        >
          <div className="flex flex-col ml-2">
            <span className="font-bold text-white text-base">
              {totalQty} Item
            </span>
            <span className="text-xs text-slate-300 font-medium">
              Total: Rp {totalPrice().toLocaleString("id-ID")}
            </span>
          </div>

          <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full font-semibold text-sm backdrop-blur-sm">
            <ShoppingBag className="w-4 h-4" />
            <span>Lihat Pesanan</span>
          </div>
        </div>
      </div>

      {/* Modal Rincian */}
      <CartModal 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)}
        tableToken={tableToken}
      />
    </>
  );
}