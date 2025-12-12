"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
export default function ProductAdminPage() {
  const [products, serProducts] = useState([]);

  const fetchProducts = async () => {
    const res = await fetch("http://localhost:3001/products");
    const data = await res.json();
    serProducts(data);
  };

  const removeProduct = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    await fetch(`http://localhost:3001/products/${id}`, {
      method: "DELETE",
    });
    fetchProducts();
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
     <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Produk</h1>
        <a href="/admin/products/create">
          <Button>+ Tambah Produk</Button>
        </a>
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
          {products.map((p: any) => (
            <tr key={p.id}>
              <td className="p-3 border">{p.name}</td>
              <td className="p-3 border">{p.price}</td>
              <td className="p-3 border">{p.category?.name}</td>
              <td className="p-3 border space-x-3">
                <a href={`/admin/products/${p.id}`}>
                  <Button variant="secondary">Edit</Button>
                </a>

                <Button variant="destructive" onClick={() => removeProduct(p.id)}>
                  Hapus
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
