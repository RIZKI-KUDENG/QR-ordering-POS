# QR Ordering POS System

Sistem Point of Sale (POS) modern yang terintegrasi dengan pemesanan berbasis QR Code. Aplikasi ini dirancang untuk restoran atau kafe, memungkinkan pelanggan memesan langsung dari meja mereka, sementara pesanan dikelola secara *real-time* oleh dapur dan kasir.

Project ini dibangun dengan arsitektur **Monorepo**, memisahkan `client` (Frontend) dan `server` (Backend).

## 🌟 Fitur Utama

### 📱 Pelanggan (Customer Interface)
* **Scan & Order:** Pelanggan memindai QR Code unik per meja untuk mengakses menu.
* **Digital Menu:** Melihat daftar produk, varian, dan kategori.
* **Cart System:** Menambahkan item ke keranjang dan melakukan checkout.
* **Order Tracking:** Memantau status pesanan secara real-time.

### 🛡️ Admin Dashboard
* **Manajemen Produk:** CRUD (Create, Read, Update, Delete) produk, varian, dan kategori.
* **Manajemen Meja:** Membuat meja dan generate QR Code unik.
* **Manajemen Shift:** Memantau shift kasir dan ringkasan penjualan harian.
* **Laporan:** Dashboard statistik penjualan.

### 👨‍🍳 Tampilan Dapur (Kitchen Display)
* **Real-time Orders:** Pesanan masuk muncul secara otomatis tanpa refresh (polling/socket).
* **Status Update:** Mengubah status pesanan (Pending -> Cooking -> Ready -> Served).

### 🖥️ Kasir (Cashier Point)
* **Proses Pembayaran:** Menangani pembayaran pesanan.
* **Cetak Struk:** Fitur untuk mencetak struk pemesanan (*Receipt Printing*).
* **Manajemen Pesanan:** Melihat semua pesanan aktif dan riwayat.

## 🛠️ Teknologi yang Digunakan

### Frontend (Client)
* **Framework:** [Next.js 14/15](https://nextjs.org/) (App Router)
* **Language:** TypeScript
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **UI Components:** [Shadcn/ui](https://ui.shadcn.com/)
* **State Management:** Zustand (via `useCartStore`)
* **HTTP Client:** Axios
* **Form Handling:** React Hook Form + Zod

### Backend (Server)
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database ORM:** [Prisma](https://www.prisma.io/)
* **Database:** PostgreSQL / MySQL (Tergantung konfigurasi `schema.prisma`)
* **Authentication:** JWT (JSON Web Token)
* **Security:** Bcrypt (Hashing password)

## 📋 Prasyarat Instalasi

Sebelum memulai, pastikan Anda telah menginstal:
* [Node.js](https://nodejs.org/) (Versi 18 atau lebih baru disarankan)
* Package manager (`npm`, `yarn`, atau `pnpm`)
* Database (PostgreSQL atau MySQL) yang sudah berjalan

## 🚀 Panduan Instalasi & Menjalankan

Karena ini adalah monorepo, Anda perlu menjalankan backend dan frontend secara terpisah.

### 1. Setup Backend (Server)

Masuk ke folder server dan install dependencies:

```bash
cd server
npm install

Buat file .env di dalam folder server/ dan sesuaikan konfigurasinya:

Cuplikan kode

PORT=5000
DATABASE_URL="postgresql://user:password@localhost:5432/qr_ordering_db?schema=public"
JWT_SECRET="rahasia_super_aman"
CLIENT_URL="http://localhost:3000"

Jalankan migrasi database (Prisma):

Bash

npx prisma migrate dev --name init

Jalankan server:

Bash

npm run dev
# Server akan berjalan di http://localhost:5000

2. Setup Frontend (Client)
Buka terminal baru, masuk ke folder client dan install dependencies:

Bash

cd client
npm install
Buat file .env.local di dalam folder client/:

Cuplikan kode

NEXT_PUBLIC_API_URL="http://localhost:5000/api"
Jalankan aplikasi frontend:

Bash

npm run dev
# Aplikasi akan berjalan di http://localhost:3000
📂 Susunan Project
Plaintext

qr-ordering-pos/
├── client/                 # Frontend Next.js Application
│   ├── src/
│   │   ├── app/            # App Router (Pages & Layouts)
│   │   │   ├── (auth)/     # Login pages
│   │   │   ├── admin/      # Admin dashboard routes
│   │   │   ├── cashier/    # Cashier interface
│   │   │   ├── kitchen/    # Kitchen display system
│   │   │   └── menu/       # Customer QR menu interface
│   │   ├── components/     # UI Components (Shadcn, Fragments)
│   │   ├── hooks/          # Custom React Hooks
│   │   ├── lib/            # Utilities & Axios setup
│   │   └── store/          # State management (Zustand)
│   └── ...
│
├── server/                 # Backend Express Application
│   ├── prisma/             # Database Schema & Migrations
│   ├── src/
│   │   ├── controllers/    # Logic handler request
│   │   ├── middleware/     # Auth & Validation middleware
│   │   ├── routes/         # API Endpoints definition
│   │   ├── services/       # Business logic layer
│   │   └── utils/          # Helper functions
│   └── ...
└── ...

💡 Contoh Alur Penggunaan
Admin Setup: Login ke /admin, buat data Kategori dan Produk. Kemudian masuk ke menu Meja (Tables) dan buat meja baru. Download/Print QR Code meja tersebut.

Pelanggan: Scan QR Code. Pelanggan akan diarahkan ke /menu/[tableToken]. Pilih makanan -> Masuk Keranjang -> Pesan.

Dapur: Buka halaman /kitchen. Pesanan baru akan muncul. Koki mengubah status menjadi "Cooking" lalu "Ready".

Pelanggan: Melihat status pesanan berubah di layar HP mereka.

Kasir: Buka halaman /cashier. Saat pelanggan ingin membayar, kasir memilih meja/pesanan tersebut, memproses pembayaran, dan mencetak struk.

🤝 Kontribusi
Kontribusi sangat diterima! Jika Anda ingin meningkatkan fitur atau memperbaiki bug:

Fork repository ini.

Buat branch fitur baru (git checkout -b fitur-keren).

Commit perubahan Anda (git commit -m 'Menambahkan fitur keren').

Push ke branch (git push origin fitur-keren).

Buat Pull Request.

📄 Lisensi
Project ini dilisensikan di bawah lisensi MIT. Silakan lihat file LICENSE untuk detail lebih lanjut.