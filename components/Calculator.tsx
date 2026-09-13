'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  BahanBaku,
  BiayaOperasional,
  Skenario,
  PengaturanMargin,
  hitungBiayaVariabelPerUnit,
  hitungSkenario,
  buatId,
} from '@/lib/calculations';
import { muatData, simpanData, hapusData } from '@/lib/storage';
import BahanBakuTable from './BahanBakuTable';
import BiayaOperasionalTable from './BiayaOperasionalTable';
import MarginForm from './MarginForm';
import SkenarioManager from './SkenarioManager';
import HasilPanel from './HasilPanel';
import styles from './Calculator.module.css';

const SKENARIO_AWAL: Skenario = { id: buatId(), nama: 'Skenario 1', estimasiProduksiBulanan: 100 };

const MARGIN_AWAL: PengaturanMargin = {
  mode: 'persen',
  persenMarkup: 30,
  hargaJualManual: 0,
};

export default function Calculator() {
  const [sudahDimuat, setSudahDimuat] = useState(false);
  const [namaProduk, setNamaProduk] = useState('');
  const [bahanBaku, setBahanBaku] = useState<BahanBaku[]>([]);
  const [biayaTenagaKerjaPerUnit, setBiayaTenagaKerjaPerUnit] = useState(0);
  const [biayaOperasional, setBiayaOperasional] = useState<BiayaOperasional[]>([]);
  const [skenario, setSkenario] = useState<Skenario[]>([SKENARIO_AWAL]);
  const [pengaturanMargin, setPengaturanMargin] = useState<PengaturanMargin>(MARGIN_AWAL);

  // Muat data tersimpan dari localStorage sekali saat komponen pertama kali tampil di browser.
  useEffect(() => {
    const data = muatData();
    if (data) {
      setNamaProduk(data.namaProduk ?? '');
      setBahanBaku(data.bahanBaku ?? []);
      setBiayaTenagaKerjaPerUnit(data.biayaTenagaKerjaPerUnit ?? 0);
      setBiayaOperasional(data.biayaOperasional ?? []);
      setSkenario(data.skenario && data.skenario.length > 0 ? data.skenario : [SKENARIO_AWAL]);
      setPengaturanMargin(data.pengaturanMargin ?? MARGIN_AWAL);
    }
    setSudahDimuat(true);
  }, []);

  // Simpan otomatis ke localStorage tiap kali ada perubahan (setelah data awal dimuat).
  useEffect(() => {
    if (!sudahDimuat) return;
    simpanData({
      namaProduk,
      bahanBaku,
      biayaTenagaKerjaPerUnit,
      biayaOperasional,
      skenario,
      pengaturanMargin,
    });
  }, [sudahDimuat, namaProduk, bahanBaku, biayaTenagaKerjaPerUnit, biayaOperasional, skenario, pengaturanMargin]);

  const biayaVariabelPerUnit = useMemo(
    () => hitungBiayaVariabelPerUnit(bahanBaku, biayaTenagaKerjaPerUnit),
    [bahanBaku, biayaTenagaKerjaPerUnit]
  );

  const hasil = useMemo(
    () =>
      skenario.map((sk) =>
        hitungSkenario(sk, bahanBaku, biayaTenagaKerjaPerUnit, biayaOperasional, pengaturanMargin)
      ),
    [skenario, bahanBaku, biayaTenagaKerjaPerUnit, biayaOperasional, pengaturanMargin]
  );

  function resetSemua() {
    const yakin = window.confirm(
      'Hapus semua data yang sudah diisi? Tindakan ini tidak bisa dibatalkan.'
    );
    if (!yakin) return;
    hapusData();
    setNamaProduk('');
    setBahanBaku([]);
    setBiayaTenagaKerjaPerUnit(0);
    setBiayaOperasional([]);
    setSkenario([{ ...SKENARIO_AWAL, id: buatId() }]);
    setPengaturanMargin(MARGIN_AWAL);
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerText}>
          <h1>Hargain</h1>
          <p className={styles.headerTagline}>
            Hitung HPP, harga jual, dan titik impas usahamu. Tanpa akun, data tersimpan di
            browser ini saja.
          </p>
        </div>
        <button type="button" className={`${styles.resetBtn} no-print`} onClick={resetSemua}>
          Reset semua data
        </button>
      </header>

      <main className={styles.body}>
        <div className={`${styles.inputColumn} no-print`}>
          <input
            className={styles.produkNameInput}
            type="text"
            placeholder="Nama produk (misal: Kue Kering Nastar)"
            value={namaProduk}
            onChange={(e) => setNamaProduk(e.target.value)}
          />

          <BahanBakuTable
            bahanBaku={bahanBaku}
            onUbah={setBahanBaku}
            biayaTenagaKerjaPerUnit={biayaTenagaKerjaPerUnit}
            onUbahTenagaKerja={setBiayaTenagaKerjaPerUnit}
          />

          <BiayaOperasionalTable biayaOperasional={biayaOperasional} onUbah={setBiayaOperasional} />

          <MarginForm pengaturan={pengaturanMargin} onUbah={setPengaturanMargin} />

          <SkenarioManager skenario={skenario} onUbah={setSkenario} />
        </div>

        <div className={styles.resultColumn}>
          <HasilPanel hasil={hasil} biayaVariabelPerUnit={biayaVariabelPerUnit} namaProduk={namaProduk} />
        </div>
      </main>
    </div>
  );
}
