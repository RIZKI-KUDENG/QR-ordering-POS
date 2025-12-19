"use client";

import { Button } from "@/components/ui/button";
import { useProducts, useDeleteProduct } from "@/hooks/useProduct";
import Link from "next/link"; 

export default function ProductListPage() {
  const { data: products = [], isLoading, isError } = useProducts();
  const { mutate: deleteProduct } = useDeleteProduct();

  const handleRemove = (id: number) => {
    if (confirm("Hapus produk ini?")) {
      deleteProduct(id);
    }
  };

  if (isLoading) return <div className="p-6">Memuat daftar produk...</div>;
  if (isError) return <div className="p-6 text-red-500">Gagal memuat data.</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Produk</h1>
        <Link href="/admin/products/create">
          <Button>+ Tambah Produk</Button>
        </Link>
      </div>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-3 border">Nama</th>
            <th className="p-3 border">Harga</th>
            <th className="p-3 border">Kategori</th>
            <th className="p-3 border">Aksi</th>
          </tr>
        </thead>

        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan={4} className="p-4 text-center text-gray-500">
                Belum ada produk.
              </td>
            </tr>
          ) : (
            products.map((p: any) => (
              <tr key={p.id}>
                <td className="p-3 border">{p.name}</td>
                <td className="p-3 border">
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  }).format(p.price)}
                </td>
                <td className="p-3 border">{p.category?.name || "-"}</td>
                <td className="p-3 border space-x-3">
                  <Link href={`/admin/products/${p.id}`}>
                    <Button variant="secondary" size="sm">
                      Edit
                    </Button>
                  </Link>

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemove(p.id)}
                  >
                    Hapus
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}