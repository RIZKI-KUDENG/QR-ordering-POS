"use client";
import { useTableByToken } from "@/hooks/useTable";
import { useProducts } from "@/hooks/useProduct";
import Image from "next/image";
import { useCategories } from "@/hooks/useCategories";
import { Menu } from "lucide-react";

export default function MenuClient({ token }: { token: string }) {
  const { data: table, isLoading, isError } = useTableByToken(token);
  const { data: products = [] } = useProducts();
  const { data: categories = [] } = useCategories();
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
  console.log(table);
  console.log(products);
  return (
   <div>
     <div className="w-full bg-slate-50">
      <div className="flex flex-col items-center justify-center py-4">
        <Image
          src={
            "https://upload.wikimedia.org/wikipedia/id/thumb/5/5c/LogoMieGacoan.png/500px-LogoMieGacoan.png"
          }
          width={100}
          height={100}
          alt="logo"
          loading="eager"
          className="w-40 h-40 md:w-60 md:h-60 rounded-2xl"
        ></Image>
        <h1 className="text-2xl md:text-4xl font-bold py-4">Menu Gacoan</h1>
      </div>
    </div>
    <div>
      <div className="flex flex-col items-center justify-center py-4 ">
        <h5 className="text-xl md:text-2xl font-bold p-4 border rounded bg-slate-100 ">
         Nomor Meja: {table?.number}
        </h5>
      </div>
      <div className=" max-sm:px-2 flex items-center justify-center">
        <ul className="flex gap-8 text-center overflow-x-scroll">
          <li className="font-bold text-xl md:text-2xl whitespace-nowrap">All Category</li>
          {
            categories.map((category: any) => (
              <li className="text-xl md:text-2xl font-bold whitespace-nowrap" key={category.id}>
                {category.name}
              </li>
            ))
          }
        </ul>
      </div>
      <div className="py-5">
        <div className=" px-3 gird grid-cols-2  ">
          {
            products.map((product: any) => (
              <div key={product.id} className="">
                <Image src={product.image_url} alt="Mie" width={100} height={100} className="p-2 border"/>
              </div>
            ))
          }
        </div>
      </div>
    </div>
   </div>
  );
}
