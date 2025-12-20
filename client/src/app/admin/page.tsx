"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/lib/axios";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    revenue: 0,
    ordersCount: 0,
    topProducts: [],
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/dashboard/stats");
        setStats(res.data);
      } catch (err) {
        console.error("Gagal load dashboard", err);
      }
    };
    fetchStats();
  }, []);

  const formatRupiah = (val: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(val);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard Hari Ini</h1>

      {/* Kartu Statistik Utama */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Pendapatan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatRupiah(stats.revenue)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Pesanan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.ordersCount} Transaksi</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabel Produk Terlaris */}
      <Card>
        <CardHeader>
          <CardTitle>Menu Terlaris</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.topProducts.map((product: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between border-b pb-2 last:border-0">
                <span className="font-medium">
                  {idx + 1}. {product.name}
                </span>
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                  Terjual {product.sold}
                </span>
              </div>
            ))}
            {stats.topProducts.length === 0 && (
              <p className="text-gray-500 text-sm">Belum ada data penjualan.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}