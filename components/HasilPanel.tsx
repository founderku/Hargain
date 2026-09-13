'use client';

import { HasilSkenario, formatRupiah, formatUnit } from '@/lib/calculations';
import styles from './HasilPanel.module.css';

interface Props {
  hasil: HasilSkenario[];
  biayaVariabelPerUnit: number;
  namaProduk: string;
}

export default function HasilPanel({ hasil, biayaVariabelPerUnit, namaProduk }: Props) {
  if (hasil.length === 0) {
    return (
      <div className={styles.panel}>
        <h2 className={styles.panelTitle}>Hasil Perhitungan</h2>
        <p className={styles.emptyState}>
          Tambah minimal satu skenario produksi di sebelah kiri untuk melihat hasil hitungannya
          di sini.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.panel} id="hasil-panel">
      <h2 className={styles.panelTitle}>{namaProduk || 'Hasil Perhitungan'}</h2>
      <p className={styles.panelSubtitle}>
        Biaya variabel per unit (bahan baku + tenaga kerja): {formatRupiah(biayaVariabelPerUnit)}
      </p>

      {hasil.map((h) => (
        <div className={styles.skenarioBlock} key={h.skenarioId}>
          <h3 className={styles.skenarioName}>{h.namaSkenario}</h3>

          <div className={styles.row}>
            <span className={styles.rowLabel}>Biaya variabel / unit</span>
            <span className={styles.rowValue}>{formatRupiah(biayaVariabelPerUnit)}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.rowLabel}>
              Overhead / unit ({formatUnit(h.estimasiProduksiBulanan)} unit/bln)
            </span>
            <span className={styles.rowValue}>{formatRupiah(h.overheadPerUnit)}</span>
          </div>
          <hr className={styles.rowDivider} />
          <div className={`${styles.row} ${styles.rowTotal}`}>
            <span className={styles.rowLabel}>HPP per unit</span>
            <span className={styles.rowValue}>{formatRupiah(h.hppPerUnit)}</span>
          </div>

          <div className={`${styles.row} ${styles.hargaJualRow}`}>
            <span className={styles.rowLabel}>Harga jual disarankan</span>
            <span className={styles.rowValue}>{formatRupiah(h.hargaJual)}</span>
          </div>

          <div className={styles.row}>
            <span className={styles.rowLabel}>Laba / unit</span>
            <span className={`${styles.rowValue} ${styles.labaValue}`}>
              {formatRupiah(h.labaPerUnit)}
            </span>
          </div>
          <div className={styles.row}>
            <span className={styles.rowLabel}>Margin aktual</span>
            <span className={styles.rowValue}>{h.marginAktualPersen.toFixed(1)}%</span>
          </div>

          <div
            className={`${styles.bepBox} ${
              h.breakEvenTercapai ? styles.bepBoxTercapai : styles.bepBoxBelum
            }`}
          >
            {h.breakEvenUnit === null ? (
              <>
                <div className={styles.bepBoxTitle}>Titik impas tidak tercapai</div>
                <div>Harga jual masih di bawah biaya variabel per unit. Naikkan harga jual.</div>
              </>
            ) : (
              <>
                <div className={styles.bepBoxTitle}>
                  Titik impas (BEP): {formatUnit(h.breakEvenUnit)} unit/bulan
                </div>
                <div>
                  {h.breakEvenTercapai
                    ? `Estimasi produksi ${formatUnit(h.estimasiProduksiBulanan)} unit sudah melewati titik impas.`
                    : `Estimasi produksi ${formatUnit(h.estimasiProduksiBulanan)} unit masih di bawah titik impas.`}
                </div>
              </>
            )}
          </div>
        </div>
      ))}

      {hasil.length > 1 && (
        <div className={styles.skenarioBlock}>
          <h3 className={styles.skenarioName}>Perbandingan Skenario</h3>
          <table className={styles.compareTable}>
            <thead>
              <tr>
                <th>Skenario</th>
                <th>HPP/unit</th>
                <th>Harga jual</th>
                <th>Laba/unit</th>
                <th>BEP (unit)</th>
              </tr>
            </thead>
            <tbody>
              {hasil.map((h) => (
                <tr key={h.skenarioId}>
                  <td>{h.namaSkenario}</td>
                  <td>{formatRupiah(h.hppPerUnit)}</td>
                  <td>{formatRupiah(h.hargaJual)}</td>
                  <td>{formatRupiah(h.labaPerUnit)}</td>
                  <td>{h.breakEvenUnit === null ? '-' : formatUnit(h.breakEvenUnit)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <button type="button" className={styles.printBtn} onClick={() => window.print()}>
        Cetak / Simpan sebagai PDF
      </button>
    </div>
  );
}
