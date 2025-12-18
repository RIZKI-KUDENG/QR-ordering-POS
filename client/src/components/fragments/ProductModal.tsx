"use client";

import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Image from "next/image";
import { useCartStore } from "@/store/useCartStore";

interface ProductModalProps {
  product: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductModal({
  product,
  isOpen,
  onClose,
}: ProductModalProps) {
  const { addItem } = useCartStore();
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<number, any>>(
    {}
  );

  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setSelectedOptions({});
    }
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  const totalPrice = useMemo(() => {
    let extra = 0;
    Object.values(selectedOptions).forEach((opt: any) => {
      extra += Number(opt.extra_price);
    });
    return (Number(product.price) + extra) * quantity;
  }, [product, selectedOptions, quantity]);

  const handleOptionSelect = (variantId: number, option: any) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [variantId]: option,
    }));
  };

  const handleAddToCart = () => {
    const missingVariants = product.variants.filter(
      (v: any) => v.is_required && !selectedOptions[v.id]
    );

    if (missingVariants.length > 0) {
      alert(`Mohon pilih ${missingVariants[0].name}`);
      return;
    }

    const optionsToSave = Object.values(selectedOptions).map((opt: any) => ({
      id: opt.id,
      name: opt.name,
      extraPrice: Number(opt.extra_price),
    }));

    addItem({
      productId: product.id,
      name: product.name,
      price: Number(product.price),
      quantity: quantity,
      selectedOptions: optionsToSave,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-md rounded-xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Gambar */}
        <div className="relative h-48 w-full shrink-0">
          <Image
            src={product.image_url || "/placeholder.png"}
            alt={product.name}
            fill
            className="object-cover"
          />
          <Button
            size="icon"
            variant="secondary"
            className="absolute top-2 right-2 rounded-full h-8 w-8"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Konten Scrollable */}
        <div className="p-4 overflow-y-auto flex-1">
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-xl font-bold">{product.name}</h2>
            <p className="font-semibold text-primary">
              Rp {Number(product.price).toLocaleString("id-ID")}
            </p>
          </div>

          {/* Variants */}
          <div className="space-y-6 mt-4">
            {product.variants?.map((variant: any) => (
              <div key={variant.id}>
                <h3 className="font-medium mb-3 flex items-center justify-between">
                  {variant.name}
                  {variant.is_required && (
                    <span className="text-xs text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
                      Wajib
                    </span>
                  )}
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {variant.options.map((option: any) => {
                    const isSelected =
                      selectedOptions[variant.id]?.id === option.id;
                    return (
                      <div
                        key={option.id}
                        onClick={() => handleOptionSelect(variant.id, option)}
                        className={`
                          cursor-pointer border rounded-lg p-3 flex justify-between items-center transition-all
                          ${
                            isSelected
                              ? "border-primary bg-primary/5 ring-1 ring-primary"
                              : "border-gray-200 hover:border-gray-300"
                          }
                        `}
                      >
                        <span className="text-sm font-medium">
                          {option.name}
                        </span>
                        {Number(option.extra_price) > 0 && (
                          <span className="text-xs text-gray-500">
                            +Rp{" "}
                            {Number(option.extra_price).toLocaleString("id-ID")}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t bg-white shrink-0">
          <div className="flex items-center gap-4 mb-4">
            <span className="font-medium text-sm">Jumlah</span>
            <div className="flex items-center gap-3 ml-auto">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </Button>
              <span className="w-8 text-center font-bold">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </Button>
            </div>
          </div>
          <Button className="w-full h-12 text-base" onClick={handleAddToCart}>
            Tambah Pesanan - Rp {totalPrice.toLocaleString("id-ID")}
          </Button>
        </div>
      </div>
    </div>
  );
}
