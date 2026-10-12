// src/components/ModalSummary.jsx

import React from 'react';

const ModalSummary = ({ formData = {}, onClose, onConfirm }) => {
  // Mengambil SELURUH data MURNI dari formData yang dikirim oleh Form Booking
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

  // Format Tampilan Nomor WA dari Form
  const displayWa = custWa ? (custWa.startsWith('+') ? custWa : `+${custWa}`) : '-';

  // Format Angka Rupiah
  const formatRupiah = (val) => {
    const num = Number(val);
    if (isNaN(num) || num <= 0) return 'Rp 0';
    return `Rp ${new Intl.NumberFormat('id-ID').format(num)}`;
  };

  const normalPriceNum = Number(price) || 0;
  const discountNum = Number(discountAmount) || 0;

  // Total Tarif Akhir diambil langsung dari finalPrice form atau dihitung murni dari harga form
  const totalPriceNum =
    finalPrice !== undefined && finalPrice !== null
      ? Number(finalPrice)
      : Math.max(0, normalPriceNum - discountNum);

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-slate-900/65 p-4 backdrop-blur-sm">
      <div className="flex w-full max-w-[440px] animate-[modalPop_0.25s_ease-out_forwards] flex-col rounded-2xl bg-white p-4 shadow-2xl sm:p-5">
        {/* Header Modal */}
        <div className="mb-3 flex items-center justify-between border-b border-slate-200 pb-2.5">
          <h3 className="flex items-center gap-2 text-base font-bold text-slate-900 sm:text-lg">
            <i className="fa-solid fa-file-invoice text-sky-600"></i>
            Ringkasan Pemesanan
          </h3>
          <button
            type="button"
            className="p-1 text-xl leading-none text-slate-400 transition-colors hover:text-slate-600 cursor-pointer"
            onClick={onClose}
            aria-label="Tutup"
          >
            &times;
          </button>
        </div>

        {/* Detail Rincian Pemesanan Murni dari Form */}
        <div className="mb-3.5 flex flex-col gap-1.5 rounded-xl border border-slate-100 bg-slate-50 p-2.5 sm:mb-4 sm:gap-2 sm:p-3.5">
          <div className="flex items-center justify-between text-xs text-slate-700 sm:text-[0.84rem]">
            <span className="font-medium text-slate-500">Nama Pemesan:</span>
            <span className="max-w-[60%] break-words text-right font-semibold">
              {custName || '-'}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-700 sm:text-[0.84rem]">
            <span className="font-medium text-slate-500">No. WhatsApp:</span>
            <span className="max-w-[60%] break-words text-right font-semibold">
              {displayWa}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-700 sm:text-[0.84rem]">
            <span className="font-medium text-slate-500">Jadwal Penjemputan:</span>
            <span className="max-w-[60%] break-words text-right font-semibold">
              {pickupDate || '-'} {pickupTime ? `- ${pickupTime} WITA` : ''}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-700 sm:text-[0.84rem]">
            <span className="font-medium text-slate-500">Lokasi Jemput:</span>
            <span className="max-w-[60%] break-words text-right font-semibold">
              {pickupLoc || '-'}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-700 sm:text-[0.84rem]">
            <span className="font-medium text-slate-500">Lokasi Tujuan:</span>
            <span className="max-w-[60%] break-words text-right font-semibold">
              {dropLoc || '-'}
            </span>
          </div>

          {passengers && (
            <div className="flex items-center justify-between text-xs text-slate-700 sm:text-[0.84rem]">
              <span className="font-medium text-slate-500">Jumlah Penumpang:</span>
              <span className="max-w-[60%] break-words text-right font-semibold">
                {passengers} Orang
              </span>
            </div>
          )}

          {notes && (
            <div className="flex items-start justify-between text-xs text-slate-700 sm:text-[0.84rem]">
              <span className="font-medium text-slate-500">Catatan/Penerbangan:</span>
              <span className="max-w-[60%] break-words text-right font-semibold text-slate-800">
                {notes}
              </span>
            </div>
          )}

          {/* Perhitungan Tarif Murni dari State Form Booking */}
          <div className="mt-1 flex flex-col gap-1 border-t border-dashed border-slate-300 pt-2 text-xs sm:text-[0.84rem]">
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

            <div className="flex items-center justify-between pt-0.5">
              <span className="font-bold text-slate-700">Total Estimasi Tarif:</span>
              <span className="text-sm font-extrabold text-sky-600 sm:text-base">
                {totalPriceNum > 0 ? formatRupiah(totalPriceNum) : 'Hubungi Kami'}
              </span>
            </div>
          </div>
        </div>

        {/* Tombol Aksi */}
        <div className="flex gap-2.5">
          <button
            type="button"
            className="h-10 flex-1 cursor-pointer rounded-lg border border-slate-300 bg-white p-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50 sm:text-[0.85rem]"
            onClick={onClose}
          >
            Ubah Data
          </button>
          <button
            type="button"
            className="flex h-10 flex-[1.2] cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-[#25d366] p-2 text-xs font-bold text-white transition-all hover:bg-[#20bd5a] sm:text-[0.85rem]"
            onClick={onConfirm}
          >
            <i className="fa-brands fa-whatsapp text-sm"></i> Kirim ke WA
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalSummary;
