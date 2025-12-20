import React from "react";


interface ReceiptProps {
  order: any; 
}

export const Receipt = React.forwardRef<HTMLDivElement, ReceiptProps>(
  ({ order }, ref) => {
    const formatRupiah = (val: number) =>
      new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(val);
    
    return (
      <div ref={ref} className="p-4 bg-white text-black font-mono text-xs w-[58mm] min-h-0">
        {/* Header Struk */}
        <div className="text-center mb-4 border-b border-dashed border-gray-400 pb-2">
          <h2 className="text-lg font-bold">NAMA CAFE ANDA</h2>
          <p>Jl. Contoh No. 123, Kota</p>
          <p>Telp: 0812-3456-7890</p>
        </div>

        {/* Info Transaksi */}
        <div className="mb-2 border-b border-dashed border-gray-400 pb-2">
          <div className="flex justify-between">
            <span>Order ID:</span>
            <span>#{order.id}</span>
          </div>
          <div className="flex justify-between">
            <span>Meja:</span>
            <span>{order.table?.number || "-"}</span>
          </div>
          <div className="flex justify-between">
            <span>Tanggal:</span>
            <span>{new Date(order.created_at).toLocaleString('id-ID', {
              day: 'numeric', month: 'numeric', hour: '2-digit', minute: '2-digit'
            })}</span>
          </div>
          <div className="flex justify-between">
            <span>Kasir:</span>
            <span>Admin</span>
          </div>
        </div>

        {/* Daftar Item */}
        <div className="mb-2 border-b border-dashed border-gray-400 pb-2">
          {order.items?.map((item: any, index: number) => (
            <div key={index} className="mb-2">
              <div className="font-bold">{item.product?.name}</div>
              
              {/* Varian Produk */}
              {item.selectedOptions?.map((opt: any, idx: number) => (
                <div key={idx} className="text-[10px] text-gray-600 pl-2">
                  + {opt.variantOption?.name}
                </div>
              ))}

              <div className="flex justify-between mt-1">
                <span>
                  {item.quantity} x {formatRupiah(Number(item.price))}
                </span>
                <span>{formatRupiah(Number(item.price) * item.quantity)}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Total & Rincian */}
        <div className="mb-4">
          <div className="flex justify-between font-bold text-sm">
            <span>TOTAL</span>
            <span>{formatRupiah(Number(order.total_amount))}</span>
          </div>
          <div className="flex justify-between text-[10px] mt-1">
            <span>Metode:</span>
            <span>{order.payment_method || "CASH"}</span>
          </div>
          <div className="flex justify-between text-[10px]">
            <span>Status:</span>
            <span>{order.status}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center border-t border-dashed border-gray-400 pt-2">
          <p>Terima Kasih</p>
          <p>Silakan Datang Kembali</p>
          <p className="mt-2 text-[10px] text-gray-400">Powered by QR POS</p>
        </div>
      </div>
    );
  }
);

Receipt.displayName = "Receipt";