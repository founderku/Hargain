'use client';

import { Skenario, buatId } from '@/lib/calculations';
import tableStyles from './EditableTable.module.css';
import styles from './SkenarioManager.module.css';

interface Props {
  skenario: Skenario[];
  onUbah: (skenario: Skenario[]) => void;
}

export default function SkenarioManager({ skenario, onUbah }: Props) {
  function tambah() {
    const nomor = skenario.length + 1;
    onUbah([
      ...skenario,
      { id: buatId(), nama: `Skenario ${nomor}`, estimasiProduksiBulanan: 100 },
    ]);
  }

  function ubah(id: string, patch: Partial<Skenario>) {
    onUbah(skenario.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  function hapus(id: string) {
    onUbah(skenario.filter((item) => item.id !== id));
  }

  return (
    <div className={tableStyles.section}>
      <div className={tableStyles.sectionHeader}>
        <h2 className={tableStyles.sectionTitle}>4. Skenario Produksi</h2>
      </div>
      <p className={tableStyles.sectionHint}>
        Bikin beberapa skenario perkiraan jumlah produksi per bulan untuk lihat bagaimana HPP
        dan titik impas berubah kalau skala produksi naik atau turun.
      </p>

      {skenario.length === 0 ? (
        <div className={tableStyles.emptyRow}>
          Belum ada skenario. Tambah minimal satu untuk melihat hasil perhitungan.
        </div>
      ) : (
        <div className={styles.list}>
          {skenario.map((item) => (
            <div className={styles.card} key={item.id}>
              <input
                className={styles.cardName}
                type="text"
                value={item.nama}
                onChange={(e) => ubah(item.id, { nama: e.target.value })}
              />
              <div className={styles.cardEstimasi}>
                <input
                  className={styles.cardEstimasiInput}
                  type="number"
                  min="0"
                  inputMode="numeric"
                  value={item.estimasiProduksiBulanan === 0 ? '' : item.estimasiProduksiBulanan}
                  placeholder="0"
                  onChange={(e) =>
                    ubah(item.id, { estimasiProduksiBulanan: Number(e.target.value) || 0 })
                  }
                />
                <span className={styles.cardEstimasiLabel}>unit/bulan</span>
              </div>
              <button
                type="button"
                className={styles.removeBtn}
                onClick={() => hapus(item.id)}
                aria-label={`Hapus ${item.nama}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <button type="button" className={tableStyles.addBtn} onClick={tambah}>
        + Tambah skenario
      </button>
    </div>
  );
}
