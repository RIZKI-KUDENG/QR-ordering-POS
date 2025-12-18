"use client";

import { useCartStore } from "@/store/useCartStore";
import { Button } from "@/components/ui/button";
import { X, Trash2 } from "lucide-react";

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartModal({ isOpen, onClose }: CartModalProps) {
  const { items, removeItem, totalPrice, decreaseItem } = useCartStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-md h-[80vh] sm:h-auto sm:max-h-[80vh] sm:rounded-xl rounded-t-xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom">
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between bg-white sticky top-0 z-10">
          <h2 className="text-lg font-bold">Rincian Pesanan</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* List Item */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              Keranjang kosong. Yuk pesan sesuatu!
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.uniqueId}
                className="flex gap-4 border-b pb-4 last:border-0"
              >
                {/* Info Item */}
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-slate-900">
                      {item.name}
                    </h3>
                    <p className="font-bold text-sm">
                      Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                    </p>
                  </div>

                  {/* Variant & Opsi */}
                  {item.selectedOptions && item.selectedOptions.length > 0 && (
                    <p className="text-xs text-slate-500 mt-1">
                      {item.selectedOptions.map((opt) => opt.name).join(", ")}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-3">
                    {/* Kontrol Quantity (- 1 +) */}
                    <div className="flex items-center border border-gray-200 rounded-full px-1 py-0.5 shadow-sm">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-full text-slate-600 hover:bg-slate-100"
                        onClick={() => decreaseItem(item.uniqueId)} // <-- Pakai decreaseItem di sini
                      >
                        -
                      </Button>

                      <span className="text-sm font-bold w-6 text-center">
                        {item.quantity}
                      </span>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-full text-slate-600 hover:bg-slate-100"
                        onClick={() => useCartStore.getState().addItem(item)} // <-- Pakai addItem untuk (+)
                      >
                        +
                      </Button>
                    </div>

                    {/* Tombol Hapus (Sampah) */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-600 hover:bg-red-50 h-8 px-2 ml-auto"
                      onClick={() => removeItem(item.uniqueId)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" /> Hapus
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Checkout */}
        <div className="p-4 border-t bg-slate-50">
          <div className="flex justify-between mb-4 text-sm">
            <span className="font-semibold text-slate-600">
              Total Pembayaran
            </span>
            <span className="font-bold text-lg text-slate-900">
              Rp {totalPrice().toLocaleString("id-ID")}
            </span>
          </div>
          <Button
            className="w-full font-bold h-12 text-lg"
            disabled={items.length === 0}
          >
            Konfirmasi Pesanan
          </Button>
        </div>
      </div>
    </div>
  );
}
