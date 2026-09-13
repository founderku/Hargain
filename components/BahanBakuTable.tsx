'use client';

import { BahanBaku, buatId } from '@/lib/calculations';
import styles from './EditableTable.module.css';

interface Props {
  bahanBaku: BahanBaku[];
  onUbah: (bahanBaku: BahanBaku[]) => void;
  biayaTenagaKerjaPerUnit: number;
  onUbahTenagaKerja: (nilai: number) => void;
}

export default function BahanBakuTable({
  bahanBaku,
  onUbah,
  biayaTenagaKerjaPerUnit,
  onUbahTenagaKerja,
}: Props) {
  function tambahBaris() {
    onUbah([...bahanBaku, { id: buatId(), nama: '', harga: 0, jumlahDipakai: 0 }]);
  }

  function ubahBaris(id: string, patch: Partial<BahanBaku>) {
    onUbah(bahanBaku.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  function hapusBaris(id: string) {
    onUbah(bahanBaku.filter((item) => item.id !== id));
  }

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>1. Bahan Baku</h2>
      </div>
      <p className={styles.sectionHint}>
        Isi bahan yang dipakai untuk membuat 1 unit produk jadi. Harga diisi per satuan beli,
        lalu isi berapa banyak satuan itu yang terpakai untuk 1 unit produk.
      </p>

      {bahanBaku.length === 0 ? (
        <div className={styles.emptyRow}>Belum ada bahan baku. Tambah baris di bawah.</div>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.colName}>Nama bahan</th>
              <th className={styles.colNumber}>Harga beli (Rp)</th>
              <th className={styles.colNumber}>Terpakai / unit</th>
              <th className={styles.colRemove}></th>
            </tr>
          </thead>
          <tbody>
            {bahanBaku.map((item) => (
              <tr key={item.id}>
                <td>
                  <input
                    className={styles.nameInput}
                    type="text"
                    placeholder="misal: Tepung terigu"
                    value={item.nama}
                    onChange={(e) => ubahBaris(item.id, { nama: e.target.value })}
                  />
                </td>
                <td>
                  <input
                    className={styles.numberInput}
                    type="number"
                    min="0"
                    inputMode="decimal"
                    value={item.harga === 0 ? '' : item.harga}
                    placeholder="0"
                    onChange={(e) => ubahBaris(item.id, { harga: Number(e.target.value) || 0 })}
                  />
                </td>
                <td>
                  <input
                    className={styles.numberInput}
                    type="number"
                    min="0"
                    step="any"
                    inputMode="decimal"
                    value={item.jumlahDipakai === 0 ? '' : item.jumlahDipakai}
                    placeholder="0"
                    onChange={(e) =>
                      ubahBaris(item.id, { jumlahDipakai: Number(e.target.value) || 0 })
                    }
                  />
                </td>
                <td>
                  <button
                    type="button"
                    className={styles.removeBtn}
                    onClick={() => hapusBaris(item.id)}
                    aria-label={`Hapus ${item.nama || 'bahan ini'}`}
                  >
                    ×
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button type="button" className={styles.addBtn} onClick={tambahBaris}>
        + Tambah bahan baku
      </button>

      <div className={styles.inlineField}>
        <label className={styles.inlineLabel} htmlFor="tenaga-kerja">
          Tenaga kerja langsung
          <span className={styles.inlineLabelHint}>Ongkos kerja per 1 unit produk (opsional)</span>
        </label>
        <div className={styles.inlineInputWrap}>
          <span className={styles.rpPrefix}>Rp</span>
          <input
            id="tenaga-kerja"
            className={styles.standaloneInput}
            type="number"
            min="0"
            inputMode="decimal"
            value={biayaTenagaKerjaPerUnit === 0 ? '' : biayaTenagaKerjaPerUnit}
            placeholder="0"
            onChange={(e) => onUbahTenagaKerja(Number(e.target.value) || 0)}
          />
        </div>
      </div>
    </div>
  );
}
