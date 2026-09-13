# Hargain

Kalkulator HPP (Harga Pokok Produksi), harga jual, dan titik impas (BEP) untuk UMKM.
Tanpa akun/login. Semua data tersimpan di browser masing-masing user (localStorage),
bukan di server.

## Isi Project

- `app/` - halaman utama (Next.js App Router)
- `components/` - semua komponen tampilan (form input, panel hasil)
- `lib/calculations.ts` - rumus HPP, harga jual, dan BEP. Sudah divalidasi dengan
  perhitungan manual.
- `lib/storage.ts` - logika simpan/muat data dari localStorage browser
- `next.config.js` - dikonfigurasi untuk "static export", artinya hasil build-nya
  berupa file HTML/CSS/JS statis biasa, bukan aplikasi server. Ini bikin hosting-nya
  lebih murah, lebih cepat, dan lebih aman (gak ada server yang bisa diserang).

## Cara Deploy (Rekomendasi: Vercel)

Vercel itu layanan hosting gratis yang paling gampang buat project Next.js,
dan otomatis pas ganti kode baru (kalau nanti mau update).

1. Upload folder ini ke akun GitHub kamu (bikin repository baru, upload semua isi
   folder ini KECUALI folder `node_modules`, `.next`, dan `out` kalau ada -
   itu semua file yang otomatis ke-generate ulang, gak perlu diupload).
2. Buka [vercel.com](https://vercel.com), daftar/login pakai akun GitHub.
3. Klik "Add New Project", pilih repository yang tadi diupload.
4. Vercel otomatis mendeteksi ini project Next.js, tinggal klik "Deploy".
5. Setelah selesai deploy, buka menu "Settings" > "Domains" di project itu,
   tambahkan `hargain.founderku.com`.
6. Vercel bakal kasih tau kamu record DNS yang perlu ditambahkan (biasanya CNAME).
   Tambahkan record itu di pengaturan DNS domain founderku.com kamu (di tempat kamu
   beli/kelola domain, misal Niagahoster/Cloudflare/dll).
7. Tunggu beberapa menit sampai DNS aktif, lalu hargain.founderku.com sudah bisa diakses.

## Kalau Mau Coba Dulu di Komputer Sendiri

Butuh Node.js terinstall. Lalu dari dalam folder ini jalankan:

```
npm install
npm run dev
```

Buka `http://localhost:3000` di browser.

## Cara Build Manual (Tanpa Vercel)

```
npm install
npm run build
```

Hasilnya ada di folder `out/` - ini file statis (HTML/CSS/JS) yang bisa diupload
ke hosting statis manapun (Netlify, Cloudflare Pages, hosting cPanel biasa, dll),
gak wajib pakai Vercel.

## Catatan Teknis Penting

- Karena data disimpan di browser (localStorage) dan bukan di server, kalau user
  ganti device atau hapus cache browser, datanya hilang. Ini pilihan yang disengaja
  supaya gak perlu bikin sistem akun dulu di versi awal ini.
- Semua rumus perhitungan (HPP, harga jual, BEP) ada di satu file:
  `lib/calculations.ts`. Kalau nanti ada perubahan logika bisnis, cukup ubah file
  ini saja, gak perlu sentuh tampilan.
