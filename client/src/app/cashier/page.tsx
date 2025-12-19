"use client";

import { useOrders, useUpdateOrderStatus } from "@/hooks/useOrders";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CashierPage() {
  const { data: orders = [], isLoading } = useOrders();
  const { mutate: updateStatus } = useUpdateOrderStatus();
 


  const sortedOrders = [...orders].sort((a: any, b: any) => b.id - a.id);

  const formatRupiah = (val: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(val);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-20 md:w-64 bg-white border-r min-h-screen p-4 flex flex-col justify-between">
        <div>
           <h1 className="text-xl font-bold mb-8 text-center md:text-left">Kasir</h1>
           <Link href="/admin/products"><Button variant="ghost" className="w-full justify-start mb-2">← Kembali ke Admin</Button></Link>
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
                <th className="p-4">Status</th>
                <th className="p-4">Waktu</th>
                <th className="p-4">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {isLoading ? (
                <tr><td colSpan={6} className="p-4 text-center">Loading...</td></tr>
              ) : sortedOrders.map((order: any) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="p-4 font-mono">#{order.id}</td>
                  <td className="p-4 font-bold text-lg">{order.table?.number}</td>
                  <td className="p-4 font-semibold text-green-700">
                    {formatRupiah(order.total_amount)}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                      order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleTimeString()}
                  </td>
                  <td className="p-4">
                    {order.status !== "COMPLETED" ? (
                      <Button 
                        size="sm" 
                        onClick={() => {
                          if(confirm(`Konfirmasi pembayaran meja ${order.table?.number}?`)) {
                             updateStatus({ id: order.id, status: "COMPLETED" });
                          }
                        }}
                      >
                        Bayar
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" disabled>Lunas</Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}