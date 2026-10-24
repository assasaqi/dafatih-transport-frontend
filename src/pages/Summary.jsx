// src/pages/Summary.jsx

import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { sendBookingToWhatsApp } from '@/utils/whatsapp';

const Summary = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Mengambil data formData dari location state
  const formData = location.state || {};

  const {
    custName = '',
    custWa = '',
    pickupDate = '',
    pickupTime = '',
    pickupLoc = '',
    dropLoc = '',
    passengers = '',
    notes = '',
    price = 0,
    discountAmount = 0,
    finalPrice,
  } = formData;

  // Format Tampilan Nomor WA
  const displayWa = custWa ? (custWa.startsWith('+') ? custWa : `+${custWa}`) : '-';

  // Format Angka Rupiah
  const formatRupiah = (val) => {
    const num = Number(val);
    if (isNaN(num) || num <= 0) return 'Rp 0';
    return `Rp ${new Intl.NumberFormat('id-ID').format(num)}`;
  };

  const normalPriceNum = Number(price) || 0;
  const discountNum = Number(discountAmount) || 0;

  // Total Tarif Akhir
  const totalPriceNum =
    finalPrice !== undefined && finalPrice !== null
      ? Number(finalPrice)
      : Math.max(0, normalPriceNum - discountNum);

  const handleEdit = () => {
    // Kembali ke halaman formulir pemesanan sambil membawa state data yang sudah diisi
    navigate('/pesan', { state: formData });
  };

  const handleConfirm = () => {
    // Kirim data ke WhatsApp Admin
    sendBookingToWhatsApp(formData);
  };

  // Tampilan jika pengguna langsung mengakses URL tanpa mengisi formulir
  if (!formData || Object.keys(formData).length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 pt-20 text-center">
        <i className="fa-solid fa-file-circle-exclamation mb-3 text-4xl text-slate-300"></i>
        <h2 className="text-lg font-bold text-slate-800">Tidak Ada Ringkasan Pemesanan</h2>
        <p className="mt-1 text-xs text-slate-500">Silakan isi formulir pemesanan terlebih dahulu.</p>
        <button
          onClick={() => navigate('/pesan')}
          className="mt-4 rounded-full bg-sky-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-sky-700 cursor-pointer"
        >
          Ke Halaman Pemesanan
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 pt-20 pb-12 md:pt-24">
      <div className="mx-auto max-w-lg rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        {/* Header Halaman Ringkasan */}
        <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-3">
          <h1 className="flex items-center gap-2 text-base font-bold text-slate-900 sm:text-lg">
            <i className="fa-solid fa-file-invoice text-sky-600"></i>
            Ringkasan Pemesanan
          </h1>
          <span className="rounded-full bg-sky-50 px-2.5 py-1 text-[0.7rem] font-bold text-sky-600 border border-sky-100">
            Langkah Terakhir
          </span>
        </div>

        {/* Detail Rincian Pemesanan */}
        <div className="mb-5 flex flex-col gap-2 rounded-xl border border-slate-100 bg-slate-50 p-3.5 sm:p-4">
          <div className="flex items-center justify-between text-xs sm:text-sm text-slate-700">
            <span className="font-medium text-slate-500">Nama Pemesan:</span>
            <span className="max-w-[60%] break-words text-right font-semibold">
              {custName || '-'}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs sm:text-sm text-slate-700">
            <span className="font-medium text-slate-500">No. WhatsApp:</span>
            <span className="max-w-[60%] break-words text-right font-semibold">
              {displayWa}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs sm:text-sm text-slate-700">
            <span className="font-medium text-slate-500">Jadwal Penjemputan:</span>
            <span className="max-w-[60%] break-words text-right font-semibold">
              {pickupDate || '-'} {pickupTime ? `- ${pickupTime} WITA` : ''}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs sm:text-sm text-slate-700">
            <span className="font-medium text-slate-500">Lokasi Jemput:</span>
            <span className="max-w-[60%] break-words text-right font-semibold">
              {pickupLoc || '-'}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs sm:text-sm text-slate-700">
            <span className="font-medium text-slate-500">Lokasi Tujuan:</span>
            <span className="max-w-[60%] break-words text-right font-semibold">
              {dropLoc || '-'}
            </span>
          </div>

          {passengers && (
            <div className="flex items-center justify-between text-xs sm:text-sm text-slate-700">
              <span className="font-medium text-slate-500">Jumlah Penumpang:</span>
              <span className="max-w-[60%] break-words text-right font-semibold">
                {passengers} Orang
              </span>
            </div>
          )}

          {notes && (
            <div className="flex items-start justify-between text-xs sm:text-sm text-slate-700">
              <span className="font-medium text-slate-500">Catatan/Penerbangan:</span>
              <span className="max-w-[60%] break-words text-right font-semibold text-slate-800">
                {notes}
              </span>
            </div>
          )}

          {/* Perhitungan Tarif */}
          <div className="mt-2 flex flex-col gap-1 border-t border-dashed border-slate-300 pt-2.5 text-xs sm:text-sm">
            {discountNum > 0 && (
              <>
                <div className="flex items-center justify-between text-slate-600">
                  <span className="font-medium">Tarif Normal:</span>
                  <span className="line-through">
                    {formatRupiah(normalPriceNum)}
                  </span>
                </div>
                <div className="flex items-center justify-between font-semibold text-emerald-600">
                  <span>Diskon Tarif:</span>
                  <span>
                    -{formatRupiah(discountNum)}
                  </span>
                </div>
              </>
            )}

            <div className="flex items-center justify-between pt-1">
              <span className="font-bold text-slate-700">Total Estimasi Tarif:</span>
              <span className="text-sm font-extrabold text-sky-600 sm:text-base">
                {totalPriceNum > 0 ? formatRupiah(totalPriceNum) : 'Hubungi Kami'}
              </span>
            </div>
          </div>
        </div>

        {/* Tombol Aksi */}
        <div className="flex gap-3">
          <button
            type="button"
            className="h-11 flex-1 cursor-pointer rounded-xl border border-slate-300 bg-white p-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50 sm:text-sm"
            onClick={handleEdit}
          >
            <i className="fa-solid fa-pen-to-square mr-1"></i> Ubah Data
          </button>
          <button
            type="button"
            className="flex h-11 flex-[1.3] cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-[#25d366] p-2 text-xs font-bold text-white transition-all hover:bg-[#20bd5a] shadow-md sm:text-sm"
            onClick={handleConfirm}
          >
            <i className="fa-brands fa-whatsapp text-base"></i> Kirim ke WA
          </button>
        </div>
      </div>
    </div>
  );
};

export default Summary;
