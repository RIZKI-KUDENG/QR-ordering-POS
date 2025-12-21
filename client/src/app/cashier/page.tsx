"use client";

import { useState, useEffect } from "react";
import { useOrders, useUpdateOrderStatus } from "@/hooks/useOrders";
import { getCurrentShift, startShift, endShift } from "@/service/shiftService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import PrintOrderButton from "@/components/fragments/PrintOrderButton";
import { LogOut, Wallet } from "lucide-react"; // Import icon tambahan

export default function CashierPage() {
  // --- EXISTING STATE ---
  const [currentPage, setCurrentPage] = useState(1);
  const { data: response, isLoading: isLoadingOrders } = useOrders(currentPage);
  const { mutate: updateStatus } = useUpdateOrderStatus();
  
  const orders = response?.data || [];
  const pagination = response?.pagination || { totalPages: 1, currentPage: 1, totalItems: 0 };
  
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [cashReceived, setCashReceived] = useState("");

  // --- NEW SHIFT STATE ---
  const [activeShift, setActiveShift] = useState<any>(null);
  const [isLoadingShift, setIsLoadingShift] = useState(true);
  
  // Modal State
  const [isStartShiftOpen, setIsStartShiftOpen] = useState(false);
  const [isEndShiftOpen, setIsEndShiftOpen] = useState(false);
  const [shiftInputCash, setShiftInputCash] = useState("");
  
  // Summary Report State (Setelah End Shift)
  const [shiftSummary, setShiftSummary] = useState<any>(null);

  // --- HELPER FORMAT RUPIAH ---
  const formatRupiah = (val: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(val);

  // --- SHIFT LOGIC ---
  
  // 1. Cek Shift saat load
  useEffect(() => {
    fetchShiftStatus();
  }, []);

  const fetchShiftStatus = async () => {
    try {
      setIsLoadingShift(true);
      const res = await getCurrentShift();
      if (res.data) {
        setActiveShift(res.data);
      } else {
        setActiveShift(null);
        setIsStartShiftOpen(true); // Otomatis buka modal start jika tidak ada shift
      }
    } catch (error) {
      console.error("Gagal mengambil data shift", error);
    } finally {
      setIsLoadingShift(false);
    }
  };

  // 2. Handle Start Shift
  const handleStartShift = async () => {
    try {
      const modal = Number(shiftInputCash);
      if (isNaN(modal)) return alert("Masukkan nominal yang valid");

      await startShift(modal);
      setShiftInputCash("");
      setIsStartShiftOpen(false);
      fetchShiftStatus(); // Refresh status
    } catch (error: any) {
      alert(error.response?.data?.message || "Gagal memulai shift");
    }
  };

  // 3. Handle End Shift
  const handleEndShift = async () => {
    try {
      const actualCash = Number(shiftInputCash);
      if (isNaN(actualCash)) return alert("Masukkan nominal yang valid");

      const res = await endShift(actualCash);
      setShiftSummary(res.data); // Simpan data laporan untuk ditampilkan
      setActiveShift(null);
      setIsEndShiftOpen(false);
      setShiftInputCash("");
    } catch (error: any) {
      alert(error.response?.data?.message || "Gagal mengakhiri shift");
    }
  };

  // 4. Logout / Tutup Laporan
  const handleCloseSummary = () => {
    setShiftSummary(null);
    // Opsional: Redirect ke login atau paksa start shift lagi
    setIsStartShiftOpen(true);
  };


  // --- EXISTING LOGIC (Payment & Pagination) ---
  const handleOpenPayment = (order: any) => {
    setSelectedOrder(order);
    setCashReceived("");
    setIsPaymentModalOpen(true);
  };

  const calculateChange = () => {
    if (!selectedOrder || !cashReceived) return 0;
    return Math.max(0, Number(cashReceived) - Number(selectedOrder.total_amount));
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
      change: change,
    });

    setIsPaymentModalOpen(false);
    setSelectedOrder(null);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < pagination.totalPages) setCurrentPage((prev) => prev + 1);
  };

  // --- RENDER ---
  
  // Jika sedang loading status shift, tampilkan loader sederhana
  if (isLoadingShift) {
    return <div className="min-h-screen flex items-center justify-center">Loading Shift Data...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex relative">
      {/* Sidebar */}
      <aside className="w-20 md:w-64 bg-white border-r min-h-screen p-4 flex flex-col justify-between shadow-sm z-20">
        <div>
          <h1 className="text-xl font-bold mb-8 text-center md:text-left flex items-center gap-2">
            <Wallet className="w-6 h-6 text-blue-600" />
            <span className="hidden md:inline">Kasir POS</span>
          </h1>
          
          <div className="space-y-2">
             <Link href="/admin/products">
              <Button variant="ghost" className="w-full justify-start">
                ← Ke Admin
              </Button>
            </Link>
          </div>
        </div>

        {/* Info Shift & Tombol End Shift */}
        <div className="border-t pt-4">
          {activeShift ? (
            <div className="space-y-3">
              <div className="text-xs text-gray-500 hidden md:block">
                <p>Shift Aktif Sejak:</p>
                <p className="font-semibold text-gray-700">
                  {new Date(activeShift.startTime).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})}
                </p>
                <p className="mt-1">Modal: {formatRupiah(activeShift.startCash)}</p>
              </div>
              
              <Button 
                variant="destructive" 
                className="w-full justify-start gap-2"
                onClick={() => {
                  setShiftInputCash("");
                  setIsEndShiftOpen(true);
                }}
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline">End Shift</span>
              </Button>
            </div>
          ) : (
            <div className="text-center text-sm text-red-500 font-bold">
              Shift Belum Aktif
            </div>
          )}
        </div>
      </aside>

      <main className={`flex-1 p-6 flex flex-col h-screen overflow-hidden transition-opacity ${!activeShift ? 'opacity-50 pointer-events-none' : ''}`}>
        <h2 className="text-2xl font-bold mb-6">Daftar Transaksi</h2>
        
        {/* ... (TABEL TRANSAKSI SAMA SEPERTI SEBELUMNYA) ... */}
        {/* Gunakan kode tabel existing Anda di sini */}
        <div className="bg-white rounded-lg shadow flex-1 overflow-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-100 border-b sticky top-0 z-10">
              <tr>
                <th className="p-4">No. Antrian</th>
                <th className="p-4">Meja</th>
                <th className="p-4">Total</th>
                <th className="p-4">Metode</th>
                <th className="p-4">Status</th>
                <th className="p-4">Waktu</th>
                <th className="p-4">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {isLoadingOrders ? (
                <tr><td colSpan={7} className="p-4 text-center">Loading Data...</td></tr>
              ) : orders.length === 0 ? (
                 <tr><td colSpan={7} className="p-4 text-center text-gray-500">Belum ada transaksi hari ini.</td></tr>
              ) : (
                orders.map((order: any) => (
                  <tr key={order.id} className={`hover:bg-gray-50 ${order.status === 'CANCELLED' ? 'bg-red-50' : ''}`}>
                    <td className="p-4">
                      <div className="font-mono font-bold text-lg text-blue-600">
                        #{String(order.daily_counter || order.id).padStart(3, '0')}
                      </div>
                    </td>
                    <td className="p-4 font-bold">{order.table?.number}</td>
                    <td className="p-4 font-semibold text-green-700">{formatRupiah(order.total_amount)}</td>
                    <td className="p-4">
                      <span className="px-2 py-1 rounded text-xs font-bold border bg-gray-100">
                        {order.payment_method}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold 
                        ${order.status === 'PAID' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-500">
                       {new Date(order.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="p-4 flex gap-2">
                       <PrintOrderButton order={order} />
                       {order.status === "PENDING" && order.payment_method === "CASH" && (
                          <Button size="sm" onClick={() => handleOpenPayment(order)}>Terima Bayar</Button>
                       )}
                       {order.status === "SERVED" && (
                         <Button size="sm" variant="outline" onClick={() => updateStatus({ id: order.id, status: "COMPLETED" })}>Selesai</Button>
                       )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {!isLoadingOrders && orders.length > 0 && (
          <div className="mt-4 flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border">
            <div className="text-sm text-gray-500">Halaman {pagination.currentPage} dari {pagination.totalPages}</div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handlePrevPage} disabled={currentPage === 1}>Sebelumnya</Button>
              <Button variant="outline" size="sm" onClick={handleNextPage} disabled={currentPage >= pagination.totalPages}>Selanjutnya</Button>
            </div>
          </div>
        )}
      </main>

      {/* --- MODAL START SHIFT (Blocking) --- */}
      {isStartShiftOpen && !activeShift && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8 animate-in zoom-in duration-300">
            <div className="text-center mb-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wallet className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Mulai Shift Kasir</h2>
              <p className="text-gray-500">Silakan masukkan modal awal di laci kasir.</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="startCash">Modal Awal (Rp)</Label>
                <Input
                  id="startCash"
                  type="number"
                  placeholder="Contoh: 200000"
                  value={shiftInputCash}
                  onChange={(e) => setShiftInputCash(e.target.value)}
                  className="text-lg font-mono text-center"
                  autoFocus
                />
              </div>
              <Button 
                onClick={handleStartShift} 
                className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700"
                disabled={!shiftInputCash}
              >
                Buka Kasir
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL END SHIFT --- */}
      {isEndShiftOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4 text-red-600">Akhiri Shift</h3>
            <p className="text-gray-600 mb-4 text-sm">
              Pastikan Anda telah menghitung seluruh uang tunai yang ada di laci (Modal Awal + Penjualan Tunai).
            </p>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="endCash">Total Uang Tunai di Laci (Rp)</Label>
                <Input
                  id="endCash"
                  type="number"
                  placeholder="Masukkan hasil hitungan fisik..."
                  value={shiftInputCash}
                  onChange={(e) => setShiftInputCash(e.target.value)}
                  className="text-lg font-mono"
                  autoFocus
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Button variant="outline" onClick={() => setIsEndShiftOpen(false)}>Batal</Button>
                <Button variant="destructive" onClick={handleEndShift} disabled={!shiftInputCash}>
                  Tutup Shift
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL SUMMARY REPORT (Setelah End Shift) --- */}
      {shiftSummary && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in slide-in-from-bottom-4">
            <div className="bg-gray-900 text-white p-6 text-center">
              <h2 className="text-xl font-bold">Laporan Shift</h2>
              <p className="text-gray-400 text-sm">
                {new Date(shiftSummary.startTime).toLocaleString()} - {new Date(shiftSummary.endTime).toLocaleString()}
              </p>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-gray-500">Modal Awal</div>
                <div className="text-right font-medium">{formatRupiah(shiftSummary.startCash)}</div>
                
                <div className="text-gray-500">Penjualan Tunai</div>
                <div className="text-right font-medium text-green-600">+ {formatRupiah(shiftSummary.cashSales)}</div>

                <div className="text-gray-500 font-bold border-t pt-2">Seharusnya (Sistem)</div>
                <div className="text-right font-bold border-t pt-2">{formatRupiah(shiftSummary.expectedCash)}</div>

                <div className="text-gray-500 font-bold">Aktual (Laci)</div>
                <div className="text-right font-bold text-blue-600">{formatRupiah(shiftSummary.endCash)}</div>
              </div>

              <div className={`p-3 rounded-lg flex justify-between items-center font-bold border
                ${Number(shiftSummary.difference) === 0 
                  ? 'bg-green-50 border-green-200 text-green-700' 
                  : 'bg-red-50 border-red-200 text-red-700'}`}>
                <span>Selisih</span>
                <span>{Number(shiftSummary.difference) > 0 ? '+' : ''}{formatRupiah(shiftSummary.difference)}</span>
              </div>
              
              <div className="text-center text-xs text-gray-400">
                Total Omzet (Tunai + Non-Tunai): {formatRupiah(shiftSummary.totalSales)}
              </div>
            </div>

            <div className="p-4 bg-gray-50 border-t">
              <Button className="w-full" onClick={handleCloseSummary}>
                Tutup & Mulai Shift Baru
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL PEMBAYARAN EXISTING --- */}
      {isPaymentModalOpen && selectedOrder && (
         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
               <h3 className="font-bold mb-4">Pembayaran Meja {selectedOrder.table?.number}</h3>
               <div className="space-y-4">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span><span>{formatRupiah(selectedOrder.total_amount)}</span>
                  </div>
                  <Input type="number" value={cashReceived} onChange={e => setCashReceived(e.target.value)} placeholder="Uang diterima" autoFocus />
                  <div className="flex justify-between font-bold">
                    <span>Kembalian</span><span className={calculateChange() < 0 ? "text-red-500" : "text-green-600"}>{formatRupiah(calculateChange())}</span>
                  </div>
                  <Button className="w-full" onClick={handleConfirmPayment} disabled={Number(cashReceived) < Number(selectedOrder.total_amount)}>Bayar</Button>
               </div>
               <Button variant="ghost" className="w-full mt-2" onClick={() => setIsPaymentModalOpen(false)}>Batal</Button>
            </div>
         </div>
      )}
    </div>
  );
}