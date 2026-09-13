'use client';

import { PengaturanMargin } from '@/lib/calculations';
import tableStyles from './EditableTable.module.css';
import styles from './MarginForm.module.css';

interface Props {
  pengaturan: PengaturanMargin;
  onUbah: (pengaturan: PengaturanMargin) => void;
}

export default function MarginForm({ pengaturan, onUbah }: Props) {
  return (
    <div className={tableStyles.section}>
      <div className={tableStyles.sectionHeader}>
        <h2 className={tableStyles.sectionTitle}>3. Margin & Harga Jual</h2>
      </div>
      <p className={tableStyles.sectionHint}>
        Pilih mau tentuin harga jual pakai persentase markup dari HPP, atau isi manual harga
        yang sudah kamu tentukan sendiri.
      </p>

      <div className={styles.toggleRow}>
        <button
          type="button"
          className={`${styles.toggleBtn} ${pengaturan.mode === 'persen' ? styles.toggleBtnActive : ''}`}
          onClick={() => onUbah({ ...pengaturan, mode: 'persen' })}
        >
          Pakai persentase
        </button>
        <button
          type="button"
          className={`${styles.toggleBtn} ${pengaturan.mode === 'manual' ? styles.toggleBtnActive : ''}`}
          onClick={() => onUbah({ ...pengaturan, mode: 'manual' })}
        >
          Isi harga manual
        </button>
      </div>

      {pengaturan.mode === 'persen' ? (
        <>
          <div className={styles.fieldRow}>
            <input
              className={styles.marginInput}
              type="number"
              min="0"
              inputMode="decimal"
              value={pengaturan.persenMarkup === 0 ? '' : pengaturan.persenMarkup}
              placeholder="0"
              onChange={(e) =>
                onUbah({ ...pengaturan, persenMarkup: Number(e.target.value) || 0 })
              }
            />
            <span className={styles.percentSuffix}>% markup dari HPP</span>
          </div>
          <p className={styles.helpText}>
            Contoh: HPP Rp 10.000 dengan markup 30% jadi harga jual Rp 13.000.
          </p>
        </>
      ) : (
        <div className={styles.fieldRow}>
          <span className={styles.rpPrefix}>Rp</span>
          <input
            className={styles.marginInput}
            type="number"
            min="0"
            inputMode="decimal"
            value={pengaturan.hargaJualManual === 0 ? '' : pengaturan.hargaJualManual}
            placeholder="0"
            onChange={(e) =>
              onUbah({ ...pengaturan, hargaJualManual: Number(e.target.value) || 0 })
            }
          />
        </div>
      )}
    </div>
  );
}
