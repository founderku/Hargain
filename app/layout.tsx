import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Hargain - Hitung HPP & Harga Jual',
  description:
    'Kalkulator harga pokok produksi, harga jual, dan titik impas untuk UMKM. Gratis, tanpa perlu daftar akun.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
