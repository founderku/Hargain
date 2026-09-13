// Helper simpan/muat data dari localStorage browser.
// Gak ada server/akun - semua data nempel di device & browser yang dipakai user.

import { BahanBaku, BiayaOperasional, Skenario, PengaturanMargin } from './calculations';

const STORAGE_KEY = 'hargain-data-v1';

export interface DataTersimpan {
  namaProduk: string;
  bahanBaku: BahanBaku[];
  biayaTenagaKerjaPerUnit: number;
  biayaOperasional: BiayaOperasional[];
  skenario: Skenario[];
  pengaturanMargin: PengaturanMargin;
}

export function muatData(): DataTersimpan | null {
  if (typeof window === 'undefined') return null;
  try {
    const mentah = window.localStorage.getItem(STORAGE_KEY);
    if (!mentah) return null;
    return JSON.parse(mentah) as DataTersimpan;
  } catch (error) {
    console.error('Gagal memuat data tersimpan:', error);
    return null;
  }
}

export function simpanData(data: DataTersimpan): boolean {
  if (typeof window === 'undefined') return false;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Gagal menyimpan data:', error);
    return false;
  }
}

export function hapusData(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Gagal menghapus data:', error);
    return false;
  }
}
