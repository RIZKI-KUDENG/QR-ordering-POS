# QR Ordering POS System

Sistem Point of Sale (POS) modern yang terintegrasi dengan pemesanan berbasis QR Code. Aplikasi ini dirancang untuk restoran atau kafe, memungkinkan pelanggan memesan langsung dari meja mereka, sementara pesanan dikelola secara *real-time* oleh dapur dan kasir.

Project ini dibangun dengan arsitektur **Monorepo**, memisahkan `client` (Frontend) dan `server` (Backend).

## 🌟 Fitur Utama

### 📱 Pelanggan (Customer Interface)
* **Scan & Order:** Pelanggan memindai QR Code unik per meja untuk mengakses menu.
* **Digital Menu:** Melihat daftar produk, varian, dan kategori dengan antarmuka yang responsif.
* **Cart System:** Menambahkan item ke keranjang dan melakukan checkout.
* **Order Tracking:** Memantau status pesanan secara real-time (Pending -> Cooking -> Ready).

### 🛡️ Admin Dashboard
* **Manajemen Produk:** CRUD (Create, Read, Update, Delete) produk, varian harga, dan kategori menu.
* **Manajemen Meja:** Membuat data meja dan generate QR Code unik untuk dicetak.
* **Manajemen Shift:** Memantau shift kasir dan ringkasan penjualan harian.
* **Laporan:** Dashboard statistik penjualan dan performa item.

### 👨‍🍳 Tampilan Dapur (Kitchen Display)
* **Real-time Orders:** Pesanan masuk muncul secara otomatis di layar dapur.
* **Status Update:** Koki dapat mengubah status pesanan (Cooking -> Ready -> Served) yang langsung update di sisi pelanggan.

### 🖥️ Kasir (Cashier Point)
* **Proses Pembayaran:** Menangani pembayaran pesanan (Tunai/Non-tunai).
* **Cetak Struk:** Fitur untuk mencetak struk pemesanan (*Receipt Printing*) secara termal.
* **Manajemen Pesanan:** Melihat semua pesanan aktif dan riwayat transaksi.

---

## 🛠️ Teknologi yang Digunakan

### Frontend (Client)
* **Framework:** [Next.js](https://nextjs.org/) (App Router)
* **Language:** TypeScript
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **UI Components:** [Shadcn/ui](https://ui.shadcn.com/)
* **State Management:** Zustand
* **Form & Validation:** React Hook Form + Zod
* **HTTP Client:** Axios

### Backend (Server)
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database ORM:** [Prisma](https://www.prisma.io/)
* **Database:** PostgreSQL (Disarankan) atau MySQL
* **Authentication:** JWT (JSON Web Token)
* **Security:** Bcrypt (Hashing password) & CORS

---

## 📋 Prasyarat Instalasi

Sebelum memulai, pastikan sistem Anda memiliki:
1.  **Node.js** (Versi 18 atau lebih baru).
2.  **Package Manager** (npm, yarn, atau pnpm).
3.  **Database** (PostgreSQL disarankan) yang sudah berjalan.

---

## 🚀 Panduan Instalasi & Menjalankan

Karena ini adalah monorepo, Anda perlu menjalankan backend dan frontend secara terpisah (atau menggunakan concurrently jika dikonfigurasi).

### 1. Setup Backend (Server)

Buka terminal dan masuk ke direktori server:

```bash
cd server
npm install
```

Buat file .env di dalam folder server/ dan sesuaikan konfigurasinya:

```bash
PORT=5000
DATABASE_URL="postgresql://user:password@localhost:5432/qr_ordering_db?schema=public"
JWT_SECRET="rahasia_super_aman"
CLIENT_URL="http://localhost:3000"
```

Jalankan migrasi database (Prisma):

```bash
npx prisma migrate dev --name init
```

Jalankan server:

```bash
npm run start
```

### 2. Setup FrontEnd (Client)

```bash
cd client
npm install
```

Buat file .env.local di dalam folder client/:

```bash
NEXT_PUBLIC_API_URL="http://localhost:5000/api"
```

Jalankan aplikasi frontend:

```bash
npm run dev
```

## 📁 Susunan Project

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

## 💡 Contoh Alur Penggunaan

1. Admin Setup: Login ke /admin, buat data Kategori dan Produk. Kemudian masuk ke menu Meja (Tables) dan buat meja baru. Download/Print QR Code meja tersebut.

2. Pelanggan: Scan QR Code. Pelanggan akan diarahkan ke /menu/[tableToken]. Pilih makanan -> Masuk Keranjang -> Pesan.

3. Dapur: Buka halaman /kitchen. Pesanan baru akan muncul. Koki mengubah status menjadi "Cooking" lalu "Ready".

4. Pelanggan: Melihat status pesanan berubah di layar HP mereka.

5. Kasir: Buka halaman /cashier. Saat pelanggan ingin membayar, kasir memilih meja/pesanan tersebut, memproses pembayaran, dan mencetak struk.

## 🤝 Kontribusi
1. Kontribusi sangat diterima! Jika Anda ingin meningkatkan fitur atau memperbaiki bug:

2. Fork repository ini.

3. Buat branch fitur baru (git checkout -b fitur-keren).

4. Commit perubahan Anda (git commit -m 'Menambahkan fitur keren').

5. Push ke branch (git push origin fitur-keren).

6. Buat Pull Request.

## 📄 Lisensi
Project ini dilisensikan di bawah lisensi MIT. Silakan lihat file LICENSE untuk detail lebih lanjut.

Dibuat dengan ❤️ oleh Kudeng