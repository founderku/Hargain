// Semua logika hitung HPP, harga jual, dan break-even point.
// Dipisah dari komponen UI supaya gampang dites dan gak ketimpa perubahan tampilan.

export interface BahanBaku {
  id: string;
  nama: string;
  harga: number; // harga beli per satuan (misal per kg, per liter, per pcs)
  jumlahDipakai: number; // jumlah satuan itu yang dipakai untuk 1 unit produk jadi
}

export interface BiayaOperasional {
  id: string;
  nama: string;
  jumlahBulanan: number; // Rp per bulan (sewa, listrik, gaji, dll)
}

export interface Skenario {
  id: string;
  nama: string;
  estimasiProduksiBulanan: number; // unit produk per bulan
}

export type ModeMargin = 'persen' | 'manual';

export interface PengaturanMargin {
  mode: ModeMargin;
  persenMarkup: number; // dipakai kalau mode = 'persen'. Markup dari HPP, bukan dari harga jual.
  hargaJualManual: number; // dipakai kalau mode = 'manual'
}

export interface HasilSkenario {
  skenarioId: string;
  namaSkenario: string;
  estimasiProduksiBulanan: number;
  overheadPerUnit: number;
  hppPerUnit: number;
  hargaJual: number;
  labaPerUnit: number;
  marginAktualPersen: number; // laba / harga jual x 100
  breakEvenUnit: number | null; // null kalau gak mungkin balik modal (harga jual <= biaya variabel)
  breakEvenTercapai: boolean; // apakah estimasi produksi bulanan sudah melewati break-even
}

/**
 * Total biaya variabel per 1 unit produk: bahan baku + tenaga kerja langsung.
 * Ini TIDAK termasuk overhead, karena overhead itu biaya tetap yang dialokasikan
 * terpisah tergantung skenario volume produksi.
 */
export function hitungBiayaVariabelPerUnit(
  bahanBaku: BahanBaku[],
  biayaTenagaKerjaPerUnit: number
): number {
  const totalBahanBaku = bahanBaku.reduce(
    (total, item) => total + item.harga * item.jumlahDipakai,
    0
  );
  return totalBahanBaku + biayaTenagaKerjaPerUnit;
}

/** Total biaya operasional/overhead tetap per bulan. */
export function hitungTotalOverheadBulanan(biayaOperasional: BiayaOperasional[]): number {
  return biayaOperasional.reduce((total, item) => total + item.jumlahBulanan, 0);
}

/**
 * Menghitung harga jual berdasarkan pengaturan margin.
 * Mode 'persen' pakai markup dari HPP: hargaJual = HPP x (1 + persen/100).
 * Mode 'manual' pakai harga yang diisi user langsung.
 */
export function hitungHargaJual(hppPerUnit: number, pengaturan: PengaturanMargin): number {
  if (pengaturan.mode === 'manual') {
    return pengaturan.hargaJualManual;
  }
  return hppPerUnit * (1 + pengaturan.persenMarkup / 100);
}

/**
 * Hitung hasil lengkap (HPP, harga jual, BEP) untuk satu skenario volume produksi.
 */
export function hitungSkenario(
  skenario: Skenario,
  bahanBaku: BahanBaku[],
  biayaTenagaKerjaPerUnit: number,
  biayaOperasional: BiayaOperasional[],
  pengaturanMargin: PengaturanMargin
): HasilSkenario {
  const biayaVariabelPerUnit = hitungBiayaVariabelPerUnit(bahanBaku, biayaTenagaKerjaPerUnit);
  const totalOverheadBulanan = hitungTotalOverheadBulanan(biayaOperasional);

  const estimasi = skenario.estimasiProduksiBulanan > 0 ? skenario.estimasiProduksiBulanan : 1;
  const overheadPerUnit = totalOverheadBulanan / estimasi;
  const hppPerUnit = biayaVariabelPerUnit + overheadPerUnit;

  const hargaJual = hitungHargaJual(hppPerUnit, pengaturanMargin);
  const labaPerUnit = hargaJual - hppPerUnit;
  const marginAktualPersen = hargaJual > 0 ? (hargaJual - hppPerUnit) / hargaJual * 100 : 0;

  // BEP standar: Biaya Tetap / (Harga Jual - Biaya Variabel per unit)
  // Pakai biaya variabel MURNI (bukan HPP yang sudah termasuk overhead),
  // karena overhead adalah biaya tetap yang sedang dicari titik balik modalnya.
  const kontribusiMarginPerUnit = hargaJual - biayaVariabelPerUnit;
  let breakEvenUnit: number | null = null;
  if (kontribusiMarginPerUnit > 0) {
    breakEvenUnit = totalOverheadBulanan / kontribusiMarginPerUnit;
  }

  const breakEvenTercapai =
    breakEvenUnit !== null && skenario.estimasiProduksiBulanan >= breakEvenUnit;

  return {
    skenarioId: skenario.id,
    namaSkenario: skenario.nama,
    estimasiProduksiBulanan: skenario.estimasiProduksiBulanan,
    overheadPerUnit,
    hppPerUnit,
    hargaJual,
    labaPerUnit,
    marginAktualPersen,
    breakEvenUnit,
    breakEvenTercapai,
  };
}

export function formatRupiah(nilai: number): string {
  if (!isFinite(nilai)) return 'Rp 0';
  const dibulatkan = Math.round(nilai);
  return 'Rp ' + dibulatkan.toLocaleString('id-ID');
}

export function formatUnit(nilai: number): string {
  if (!isFinite(nilai)) return '0';
  return Math.ceil(nilai).toLocaleString('id-ID');
}

export function buatId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}
