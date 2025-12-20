"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const menuItems = [
    { name: "Dashboard", href: "/admin", exact: true },
    { name: "Produk", href: "/admin/products" },
    { name: "Meja (QR Code)", href: "/admin/tables" },
    { name: "→ Halaman Kasir", href: "/cashier", highlight: true },
    { name: "→ Halaman Dapur", href: "/kitchen", highlight: true },
  ];

  const SidebarContent = () => (
    <nav className="p-4 space-y-2">
      {menuItems.map((item) => (
        <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
          <Button
            variant={
              item.href === "/admin"
                ? pathname === "/admin"
                  ? "default"
                  : "ghost"
                : pathname.startsWith(item.href)
                ? "default"
                : "ghost"
            }
            className={`w-full justify-start ${
              item.highlight ? "text-blue-600 font-semibold" : ""
            }`}
          >
            {item.name}
          </Button>
        </Link>
      ))}
      <div className="pt-4 mt-4 border-t">
        <Button
          variant="destructive"
          className="w-full justify-start"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ===== MOBILE HEADER ===== */}
      <header className="md:hidden flex items-center justify-between p-4 bg-white border-b shadow-sm">
        <h1 className="font-bold text-primary">POS Admin</h1>
        <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
          <Menu />
        </Button>
      </header>

      {/* ===== MOBILE DRAWER ===== */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-64 bg-white shadow-lg">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="font-bold">Menu</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(false)}
              >
                <X />
              </Button>
            </div>
            <SidebarContent />
          </aside>
        </div>
      )}

      <div className="flex">
        {/* ===== DESKTOP SIDEBAR ===== */}
        <aside className="hidden md:block w-64 bg-white border-r shadow-sm fixed h-full">
          <div className="p-6 border-b">
            <h1 className="text-xl font-bold text-primary">POS Admin</h1>
          </div>
          <SidebarContent />
        </aside>

        {/* ===== MAIN CONTENT ===== */}
        <main className="flex-1 md:ml-64 p-4 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
