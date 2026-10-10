import React from 'react';

const ModalSummary = ({ formData, onClose, onConfirm }) => {
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
            className="p-1 text-xl leading-none text-slate-400 transition-colors hover:text-slate-600"
            onClick={onClose}
            aria-label="Tutup"
          >
            &times;
          </button>
        </div>

        {/* Daftar Detail Rincian */}
        <div className="mb-3.5 flex flex-col gap-1.5 rounded-xl border border-slate-100 bg-slate-50 p-2.5 sm:mb-4 sm:gap-2 sm:p-3.5">
          <div className="flex items-center justify-between text-xs text-slate-700 sm:text-[0.84rem]">
            <span className="font-medium text-slate-500">Nama Pemesan:</span>
            <span className="max-w-[60%] break-words text-right font-semibold">
              {formData.custName}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-700 sm:text-[0.84rem]">
            <span className="font-medium text-slate-500">No. WhatsApp:</span>
            <span className="max-w-[60%] break-words text-right font-semibold">
              +{formData.countryCode} {formData.custWa}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-700 sm:text-[0.84rem]">
            <span className="font-medium text-slate-500">Jadwal Penjemputan:</span>
            <span className="max-w-[60%] break-words text-right font-semibold">
              {formData.pickupDate} ({formData.pickupTime} WITA)
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-700 sm:text-[0.84rem]">
            <span className="font-medium text-slate-500">Lokasi Jemput (From):</span>
            <span className="max-w-[60%] break-words text-right font-semibold">
              {formData.pickupLoc}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-700 sm:text-[0.84rem]">
            <span className="font-medium text-slate-500">Lokasi Tujuan (To):</span>
            <span className="max-w-[60%] break-words text-right font-semibold">
              {formData.dropLoc}
            </span>
          </div>

          <div className="mt-1 flex items-center justify-between border-t border-dashed border-slate-300 pt-2 text-xs sm:text-[0.84rem]">
            <span className="font-medium text-slate-500">Estimasi Tarif:</span>
            <span className="text-sm font-extrabold text-sky-600 sm:text-base">
              Rp {new Intl.NumberFormat('id-ID').format(formData.price)}
            </span>
          </div>
        </div>

        {/* Tombol Aksi */}
        <div className="flex gap-2.5">
          <button
            type="button"
            className="h-10 flex-1 rounded-lg border border-slate-300 bg-white p-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50 sm:text-[0.85rem]"
            onClick={onClose}
          >
            Ubah Data
          </button>
          <button
            type="button"
            className="flex h-10 flex-[1.2] items-center justify-center gap-1.5 rounded-lg bg-[#25d366] p-2 text-xs font-bold text-white transition-all hover:bg-[#20bd5a] sm:text-[0.85rem]"
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
