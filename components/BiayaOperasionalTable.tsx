'use client';

import { BiayaOperasional, buatId } from '@/lib/calculations';
import styles from './EditableTable.module.css';

interface Props {
  biayaOperasional: BiayaOperasional[];
  onUbah: (biaya: BiayaOperasional[]) => void;
}

export default function BiayaOperasionalTable({ biayaOperasional, onUbah }: Props) {
  function tambahBaris() {
    onUbah([...biayaOperasional, { id: buatId(), nama: '', jumlahBulanan: 0 }]);
  }

  function ubahBaris(id: string, patch: Partial<BiayaOperasional>) {
    onUbah(biayaOperasional.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  function hapusBaris(id: string) {
    onUbah(biayaOperasional.filter((item) => item.id !== id));
  }

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>2. Biaya Operasional Bulanan</h2>
      </div>
      <p className={styles.sectionHint}>
        Biaya tetap yang tetap keluar tiap bulan berapa pun jumlah produk yang dibuat: sewa,
        listrik, gaji karyawan tetap, internet, dan sejenisnya.
      </p>

      {biayaOperasional.length === 0 ? (
        <div className={styles.emptyRow}>Belum ada biaya operasional. Tambah baris di bawah.</div>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.colName}>Nama biaya</th>
              <th className={styles.colNumber}>Per bulan (Rp)</th>
              <th className={styles.colRemove}></th>
            </tr>
          </thead>
          <tbody>
            {biayaOperasional.map((item) => (
              <tr key={item.id}>
                <td>
                  <input
                    className={styles.nameInput}
                    type="text"
                    placeholder="misal: Sewa tempat"
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
                    value={item.jumlahBulanan === 0 ? '' : item.jumlahBulanan}
                    placeholder="0"
                    onChange={(e) =>
                      ubahBaris(item.id, { jumlahBulanan: Number(e.target.value) || 0 })
                    }
                  />
                </td>
                <td>
                  <button
                    type="button"
                    className={styles.removeBtn}
                    onClick={() => hapusBaris(item.id)}
                    aria-label={`Hapus ${item.nama || 'biaya ini'}`}
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
        + Tambah biaya operasional
      </button>
    </div>
  );
}
