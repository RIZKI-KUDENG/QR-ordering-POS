"use client";

import { useState } from "react"; // [Baru] Import useState
import { useOrders, useUpdateOrderStatus } from "@/hooks/useOrders";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // [Baru] Pastikan import Input
import { Label } from "@/components/ui/label"; // [Baru] Pastikan import Label
import Link from "next/link";
import PrintOrderButton from "@/components/fragments/PrintOrderButton";

export default function CashierPage() {
  const { data: orders = [], isLoading } = useOrders();
  const { mutate: updateStatus } = useUpdateOrderStatus();

  // [Baru] State untuk Modal Pembayaran
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [cashReceived, setCashReceived] = useState("");
  
  const sortedOrders = [...orders].sort((a: any, b: any) => b.id - a.id);

  const formatRupiah = (val: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(val);

  // [Baru] Logika Pembayaran
  const handleOpenPayment = (order: any) => {
    setSelectedOrder(order);
    setCashReceived(""); // Reset input
    setIsPaymentModalOpen(true);
  };

  const handleConfirmPayment = () => {
    if (!selectedOrder) return;

    const total = Number(selectedOrder.total_amount);
    const received = Number(cashReceived);

    if (received < total) {
      alert("Uang yang diterima kurang dari total tagihan!");
      return;
    }

    const change = received - total;

    updateStatus({ 
      id: selectedOrder.id, 
      status: "PAID",
      cashReceived: received,
      change: change
    });

    setIsPaymentModalOpen(false);
    setSelectedOrder(null);
  };

  // [Baru] Hitung kembalian realtime untuk display
  const calculateChange = () => {
    if (!selectedOrder || !cashReceived) return 0;
    return Math.max(0, Number(cashReceived) - Number(selectedOrder.total_amount));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex relative">
      {/* Sidebar (Tetap sama) */}
      <aside className="w-20 md:w-64 bg-white border-r min-h-screen p-4 flex flex-col justify-between">
        <div>
          <h1 className="text-xl font-bold mb-8 text-center md:text-left">
            Kasir
          </h1>
          <Link href="/admin/products">
            <Button variant="ghost" className="w-full justify-start mb-2">
              ← Kembali ke Admin
            </Button>
          </Link>
        </div>
      </aside>

      <main className="flex-1 p-6">
        <h2 className="text-2xl font-bold mb-6">Daftar Transaksi</h2>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-left">
  <thead className="bg-gray-100 border-b">
    <tr>
      <th className="p-4">Order ID</th>
      <th className="p-4">Meja</th>
      <th className="p-4">Total</th>
      {/* [PERBAIKAN 1] Ubah judul kolom ini dari "Status" jadi "Metode" */}
      <th className="p-4">Metode</th> 
      <th className="p-4">Status</th>
      <th className="p-4">Waktu</th>
      <th className="p-4">Aksi</th>
    </tr>
  </thead>
  <tbody className="divide-y">
    {isLoading ? (
      <tr>
        <td colSpan={7} className="p-4 text-center">
          Loading...
        </td>
      </tr>
    ) : (
      sortedOrders.map((order: any) => (
        <tr key={order.id} className="hover:bg-gray-50">
          <td className="p-4 font-mono">#{order.id}</td>
          <td className="p-4 font-bold text-lg">
            {order.table?.number}
          </td>
          <td className="p-4 font-semibold text-green-700">
            {formatRupiah(order.total_amount)}
          </td>
          
          {/* Kolom Metode Pembayaran */}
          <td className="p-4">
            <span
              className={`px-2 py-1 rounded text-xs font-bold border ${
                order.payment_method === "CASH"
                  ? "bg-gray-100 text-gray-700 border-gray-300"
                  : "bg-blue-50 text-blue-600 border-blue-200"
              }`}
            >
              {order.payment_method}
            </span>
          </td>

          {/* Kolom Status Order */}
          <td className="p-4">
            <span
              className={`px-2 py-1 rounded-full text-xs font-bold ${
                order.status === "COMPLETED"
                  ? "bg-green-100 text-green-800"
                  : order.status === "PAID"
                  ? "bg-blue-100 text-blue-800"
                  : order.status === "COOKING"
                  ? "bg-orange-100 text-orange-800"
                  : order.status === "SERVED"
                  ? "bg-purple-100 text-purple-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {order.status}
            </span>
          </td>
          <td className="p-4 text-sm text-gray-500">
            {new Date(order.created_at).toLocaleTimeString()}
          </td>
          <td className="p-4 flex flex-wrap gap-2">
            <PrintOrderButton order={order} />
            
            {order.status === "PENDING" && (
              <>
                {order.payment_method === "CASH" ? (
                  <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => handleOpenPayment(order)}
                  >
                    Terima Bayar (Cash)
                  </Button>
                ) : (
                  <span className="text-sm text-orange-600 font-medium animate-pulse">
                    Menunggu Pembayaran Online...
                  </span>
                )}
              </>
            )}

            {(order.status === "PAID" || order.status === "COOKING") && (
              <span className="text-sm font-medium text-gray-500 italic">
                {order.status === "PAID"
                  ? "Menunggu Dapur..."
                  : "Sedang Dimasak..."}
              </span>
            )}
            
            {order.status === "SERVED" && (
              <Button
                size="sm"
                variant="outline"
                className="border-green-600 text-green-600 hover:bg-green-50"
                onClick={() => {
                  if (
                    confirm(
                      `Selesaikan transaksi meja ${order.table?.number}?`
                    )
                  ) {
                    updateStatus({
                      id: order.id,
                      status: "COMPLETED",
                    });
                  }
                }}
              >
                Selesaikan Order
              </Button>
            )}
            {order.status === "COMPLETED" && (
              <span className="text-green-600 font-bold text-sm">
                Lunas & Selesai
              </span>
            )}
          </td>
        </tr>
      ))
    )}
  </tbody>
</table>
        </div>
      </main>

      {/* [BARU] MODAL PEMBAYARAN */}
      {isPaymentModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4">Pembayaran Meja {selectedOrder.table?.number}</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-gray-50 p-3 rounded">
                <span className="text-gray-600">Total Tagihan</span>
                <span className="text-xl font-bold text-blue-600">
                  {formatRupiah(selectedOrder.total_amount)}
                </span>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cash">Uang Diterima (Cash)</Label>
                <Input
                  id="cash"
                  type="number"
                  placeholder="Masukkan nominal..."
                  value={cashReceived}
                  onChange={(e) => setCashReceived(e.target.value)}
                  className="text-lg"
                  autoFocus
                />
              </div>

              <div className="flex justify-between items-center pt-2 border-t">
                <span className="font-semibold text-gray-700">Kembalian</span>
                <span className={`text-xl font-bold ${calculateChange() < 0 ? 'text-red-500' : 'text-green-600'}`}>
                  {formatRupiah(calculateChange())}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <Button 
                variant="outline" 
                onClick={() => setIsPaymentModalOpen(false)}
              >
                Batal
              </Button>
              <Button 
                onClick={handleConfirmPayment}
                className="bg-blue-600 hover:bg-blue-700"
                disabled={!cashReceived || Number(cashReceived) < Number(selectedOrder.total_amount)}
              >
                Konfirmasi Bayar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}