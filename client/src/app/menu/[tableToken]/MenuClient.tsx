"use client"
import { useTableByToken } from "@/hooks/useTable";

export default function MenuClient({token} : {token: string}){
    const {data, isLoading, isError} = useTableByToken(token);
      if (isLoading) {
    return <div className="p-6">Memuat menu...</div>;
  }
  if (isError) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold">QR Code tidak valid</h1>
        <p className="text-gray-500">Silakan hubungi kasir</p>
      </div>
    );
  }
  return (
      <div>
        <h1>menu</h1>
      </div>
  )
}