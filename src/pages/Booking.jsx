// src/pages/Booking.jsx

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ModalSummary from '@/components/ModalSummary';

const PHONE_NUMBER = '6287757004214';

const initialFormState = {
  custName: '',
  custWa: '',
  pickupDate: '',
  pickupTime: '',
  pickupLoc: '',
  dropLoc: '',
  discountAmount: 0,
  price: 0,
};

// Helper Format Input Saat Mengetik (Mendukung Awalan 08, 8, atau 62)
const formatWaNumber = (value) => {
  const digits = value.replace(/\D/g, '');

  if (digits.startsWith('62')) {
    const sliced = digits.slice(0, 14);
    if (sliced.length <= 2) return sliced;
    if (sliced.length <= 6) return `${sliced.slice(0, 2)}-${sliced.slice(2)}`;
    if (sliced.length <= 10) return `${sliced.slice(0, 2)}-${sliced.slice(2, 6)}-${sliced.slice(6)}`;
    return `${sliced.slice(0, 2)}-${sliced.slice(2, 6)}-${sliced.slice(6, 10)}-${sliced.slice(10)}`;
  }

  const sliced = digits.slice(0, 13);
  if (sliced.length <= 4) return sliced;
  if (sliced.length <= 8) return `${sliced.slice(0, 4)}-${sliced.slice(4)}`;
  return `${sliced.slice(0, 4)}-${sliced.slice(4, 8)}-${sliced.slice(8)}`;
};

// Helper Normalisasi Standar (Mengubah 08xx/8xx Menjadi Format 62-xxxx-xxxx-xxx)
const normalizeWaNumber = (value) => {
  let digits = value.replace(/\D/g, '');
  if (digits.startsWith('0')) {
    digits = '62' + digits.slice(1);
  } else if (digits.startsWith('8')) {
    digits = '62' + digits;
  }

  const sliced = digits.slice(0, 14);
  if (sliced.length <= 2) return sliced;
  if (sliced.length <= 6) return `${sliced.slice(0, 2)}-${sliced.slice(2)}`;
  if (sliced.length <= 10) return `${sliced.slice(0, 2)}-${sliced.slice(2, 6)}-${sliced.slice(6)}`;
  return `${sliced.slice(0, 2)}-${sliced.slice(2, 6)}-${sliced.slice(6, 10)}-${sliced.slice(10)}`;
};

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialFormState);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (location.state) {
      setFormData((prev) => ({
        ...prev,
        pickupLoc: location.state.pickup || '',
        dropLoc: location.state.drop || '',
        price: location.state.price || 0,
      }));
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'custWa') {
      const formattedNumber = formatWaNumber(value);
      setFormData((prev) => ({ ...prev, custWa: formattedNumber }));
      setErrors((prev) => ({ ...prev, custWa: '' }));
      return;
    }

    if (name === 'discountAmount') {
      // Ambil hanya karakter angka
      const cleanNumber = value.replace(/\D/g, '');
      const numVal = Number(cleanNumber) || 0;
      setFormData((prev) => ({ ...prev, discountAmount: numVal }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

// Handler Tanggal (Menggunakan Waktu Lokal)
  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const formattedDate = `${day}-${month}-${year}`;

      setFormData((prev) => ({ ...prev, pickupDate: formattedDate }));
    } else {
      setFormData((prev) => ({ ...prev, pickupDate: '' }));
    }
    setErrors((prev) => ({ ...prev, pickupDate: '' }));
  };

  const handleTimeChange = (time) => {
    setSelectedTime(time);
    if (time) {
      const hours = String(time.getHours()).padStart(2, '0');
      const minutes = String(time.getMinutes()).padStart(2, '0');
      setFormData((prev) => ({ ...prev, pickupTime: `${hours}:${minutes}` }));
    } else {
      setFormData((prev) => ({ ...prev, pickupTime: '' }));
    }
    setErrors((prev) => ({ ...prev, pickupTime: '' }));
  };

  const handleClear = (field) => {
    if (field === 'pickupDate') setSelectedDate(null);
    if (field === 'pickupTime') setSelectedTime(null);
    if (field === 'discountAmount') {
      setFormData((prev) => ({ ...prev, discountAmount: 0 }));
      return;
    }
    setFormData((prev) => ({ ...prev, [field]: '' }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleResetForm = () => {
    setFormData(initialFormState);
    setSelectedDate(null);
    setSelectedTime(null);
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.custName.trim()) {
      newErrors.custName = 'Nama pemesan wajib diisi';
    }

    const rawWaDigits = formData.custWa.replace(/\D/g, '');
    if (!rawWaDigits) {
      newErrors.custWa = 'Nomor WhatsApp wajib diisi';
    } else if (!/^(08|628|8)[0-9]{7,12}$/.test(rawWaDigits)) {
      newErrors.custWa = 'Nomor WhatsApp tidak valid (contoh: 62-8190-7952-378)';
    }

    if (!formData.pickupDate) {
      newErrors.pickupDate = 'Tanggal penjemputan wajib dipilih';
    }

    if (!formData.pickupTime) {
      newErrors.pickupTime = 'Waktu penjemputan wajib diisi';
    }

    if (!formData.pickupLoc || !formData.price) {
      newErrors.pickupLoc = 'Silakan pilih rute dari Daftar Tarif';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      const normalizedWa = normalizeWaNumber(formData.custWa);
      setFormData((prev) => ({ ...prev, custWa: normalizedWa }));
      setShowModal(true);
    }
  };

  const handleConfirmWhatsApp = () => {
    const rawDigits = formData.custWa.replace(/\D/g, '');
    const discountVal = Number(formData.discountAmount) || 0;
    const finalPrice = Math.max(0, formData.price - discountVal);

    let discountInfo = '';
    if (discountVal > 0) {
      discountInfo = `%0A*Diskon Tarif:* -Rp ${new Intl.NumberFormat('id-ID').format(discountVal)}`;
    }

    const message = `Halo Dafatih Transport, saya ingin memesan layanan antar-jemput dengan detail berikut:%0A%0A*Nama:* ${formData.custName}%0A*No. WA:* +${rawDigits}%0A*Tanggal:* ${formData.pickupDate}%0A*Waktu:* ${formData.pickupTime} WITA%0A*Penjemputan:* ${formData.pickupLoc}%0A*Tujuan:* ${formData.dropLoc}%0A*Tarif Normal:* Rp ${new Intl.NumberFormat('id-ID').format(formData.price)}${discountInfo}%0A*Total Bayar:* Rp ${new Intl.NumberFormat('id-ID').format(finalPrice)}%0A%0AMohon konfirmasinya, terima kasih.`;

    window.open(`https://wa.me/${PHONE_NUMBER}?text=${message}`, '_blank');
  };

  const discountVal = Number(formData.discountAmount) || 0;
  const finalPrice = Math.max(0, formData.price - discountVal);

  return (
    <div className="block">
      {/* Page Header */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-800 px-[5%] py-3.5 pt-20 text-center text-white md:pt-24">
        <h1 className="truncate text-sm font-extrabold sm:text-base md:text-xl">
          Pemesanan Transportasi Lombok
        </h1>
      </div>

      {/* Form Section */}
      <section className="mx-auto max-w-[520px] px-[3%] py-3.5 sm:px-[4%] sm:py-6 md:py-8">
        <div className="rounded-xl border border-slate-100 bg-white p-3 shadow-[0_4px_20px_rgba(0,0,0,0.05)] sm:rounded-2xl sm:p-6">
          <div className="mb-2.5 flex items-center justify-between border-b border-slate-100 pb-2 sm:mb-3 sm:pb-2.5">
            <h2 className="text-[0.85rem] font-extrabold text-slate-800 sm:text-[0.92rem]">
              Form Pemesanan
            </h2>
            <button
              type="button"
              onClick={handleResetForm}
              className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-slate-100 px-2 py-0.5 text-[0.68rem] font-bold text-slate-600 transition-colors hover:bg-rose-50 hover:text-rose-600 sm:px-2.5 sm:py-1 sm:text-[0.72rem]"
            >
              <i className="fa-solid fa-rotate-left text-[0.65rem] sm:text-[0.7rem]"></i>
              <span>Reset Form</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-2.5 sm:gap-3.5">
            {/* Nama Lengkap */}
            <div className="flex flex-col gap-1 sm:gap-1.5">
              <label className="text-[0.72rem] font-bold text-slate-700 sm:text-[0.78rem]">
                Nama Lengkap Pemesan <span className="text-rose-500">*</span>
              </label>
              <div className="relative flex w-full items-center">
                <i className="fa-solid fa-user absolute left-2.5 z-10 text-[0.75rem] text-slate-400 sm:left-3 sm:text-[0.8rem]"></i>
                <input
                  type="text"
                  name="custName"
                  placeholder="Contoh: Dafatih Ramadhan"
                  value={formData.custName}
                  onChange={handleChange}
                  className={`h-[36px] w-full rounded-lg border ${
                    errors.custName ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200 bg-slate-50/50'
                  } pl-8 pr-7 text-[0.75rem] text-slate-900 outline-none transition-all focus:border-sky-600 focus:bg-white focus:ring-2 focus:ring-sky-600/10 sm:h-[40px] sm:rounded-xl sm:pl-9 sm:pr-8 sm:text-[0.8rem]`}
                />
                {formData.custName && (
                  <button
                    type="button"
                    onClick={() => handleClear('custName')}
                    className="absolute right-2 flex cursor-pointer items-center justify-center text-[0.85rem] text-slate-400 hover:text-slate-600 sm:right-2.5 sm:text-[0.9rem]"
                  >
                    &times;
                  </button>
                )}
              </div>
              {errors.custName && (
                <span className="text-[0.65rem] font-semibold text-rose-500 sm:text-[0.7rem]">{errors.custName}</span>
              )}
            </div>

            {/* Nomor WhatsApp */}
            <div className="flex flex-col gap-1 sm:gap-1.5">
              <label className="text-[0.72rem] font-bold text-slate-700 sm:text-[0.78rem]">
                Nomor WhatsApp <span className="text-rose-500">*</span>
              </label>
              <div className="relative flex w-full items-center">
                <i className="fa-brands fa-whatsapp absolute left-2.5 z-10 text-[0.85rem] text-emerald-600 sm:left-3 sm:text-[0.9rem]"></i>
                <input
                  type="tel"
                  name="custWa"
                  placeholder="62-8190-7952-378"
                  value={formData.custWa}
                  onChange={handleChange}
                  maxLength={18}
                  className={`h-[36px] w-full rounded-lg border ${
                    errors.custWa ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200 bg-slate-50/50'
                  } pl-8 pr-7 text-[0.75rem] text-slate-900 outline-none transition-all focus:border-sky-600 focus:bg-white focus:ring-2 focus:ring-sky-600/10 sm:h-[40px] sm:rounded-xl sm:pl-9 sm:pr-8 sm:text-[0.8rem]`}
                />
                {formData.custWa && (
                  <button
                    type="button"
                    onClick={() => handleClear('custWa')}
                    className="absolute right-2 flex cursor-pointer items-center justify-center text-[0.85rem] text-slate-400 hover:text-slate-600 sm:right-2.5 sm:text-[0.9rem]"
                  >
                    &times;
                  </button>
                )}
              </div>
              {errors.custWa && (
                <span className="text-[0.65rem] font-semibold text-rose-500 sm:text-[0.7rem]">{errors.custWa}</span>
              )}
            </div>

            {/* Grid Tanggal & Waktu */}
            <div className="grid grid-cols-[1.3fr_1fr] gap-2 sm:gap-2.5">
              {/* Tanggal Jemput */}
              <div className="flex flex-col gap-1 sm:gap-1.5">
                <label className="text-[0.72rem] font-bold text-slate-700 sm:text-[0.78rem]">
                  Tanggal Jemput <span className="text-rose-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <i className="fa-solid fa-calendar-days pointer-events-none absolute left-2.5 z-10 text-[0.75rem] text-sky-600 sm:left-3 sm:text-[0.8rem]"></i>
                  <DatePicker
                    selected={selectedDate}
                    onChange={handleDateChange}
                    minDate={new Date()}
                    dateFormat="dd-MM-yyyy"
                    placeholderText="Pilih Tanggal"
                    withPortal
                    className={`h-[36px] w-full cursor-pointer rounded-lg border ${
                      errors.pickupDate ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200 bg-slate-50/50'
                    } pl-8 pr-2 text-[0.72rem] font-semibold text-slate-800 outline-none transition-all focus:border-sky-600 focus:bg-white focus:ring-2 focus:ring-sky-600/10 sm:h-[40px] sm:rounded-xl sm:pl-9 sm:text-[0.78rem]`}
                  />
                </div>
                {errors.pickupDate && (
                  <span className="text-[0.62rem] font-semibold text-rose-500 sm:text-[0.68rem]">{errors.pickupDate}</span>
                )}
              </div>

              {/* Waktu Jemput */}
              <div className="flex flex-col gap-1 sm:gap-1.5">
                <label className="text-[0.72rem] font-bold text-slate-700 sm:text-[0.78rem]">
                  Waktu <span className="text-rose-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <i className="fa-solid fa-clock pointer-events-none absolute left-2.5 z-10 text-[0.75rem] text-sky-600 sm:left-3 sm:text-[0.8rem]"></i>
                  <DatePicker
                    selected={selectedTime}
                    onChange={handleTimeChange}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={15}
                    timeCaption="Jam (WITA)"
                    timeFormat="HH:mm"
                    dateFormat="HH:mm"
                    placeholderText="Pilih Waktu"
                    withPortal
                    className={`h-[36px] w-full cursor-pointer rounded-lg border ${
                      errors.pickupTime ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200 bg-slate-50/50'
                    } pl-8 pr-1.5 text-[0.72rem] font-semibold text-slate-800 outline-none transition-all focus:border-sky-600 focus:bg-white focus:ring-2 focus:ring-sky-600/10 sm:h-[40px] sm:rounded-xl sm:pl-9 sm:pr-2 sm:text-[0.78rem]`}
                  />
                </div>
                {errors.pickupTime && (
                  <span className="text-[0.62rem] font-semibold text-rose-500 sm:text-[0.68rem]">{errors.pickupTime}</span>
                )}
              </div>
            </div>

            {/* Penjemputan (From) */}
            <div className="flex flex-col gap-1 sm:gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[0.72rem] font-bold text-slate-700 sm:text-[0.78rem]">
                  Lokasi Penjemputan (From) <span className="text-rose-500">*</span>
                </label>
                {!formData.pickupLoc && (
                  <button
                    type="button"
                    onClick={() => navigate('/tarif')}
                    className="cursor-pointer text-[0.65rem] font-bold text-sky-600 hover:underline sm:text-[0.7rem]"
                  >
                    + Pilih Rute
                  </button>
                )}
              </div>
              <div className="relative flex items-center">
                <i className="fa-solid fa-location-dot absolute left-2.5 z-10 text-[0.75rem] text-rose-500 sm:left-3 sm:text-[0.8rem]"></i>
                <input
                  type="text"
                  name="pickupLoc"
                  readOnly
                  placeholder="Pilih rute dari Daftar Tarif"
                  value={formData.pickupLoc}
                  className={`h-[36px] w-full cursor-pointer rounded-lg border ${
                    errors.pickupLoc ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200 bg-slate-100/70'
                  } pl-8 pr-3 text-[0.75rem] font-semibold text-slate-800 outline-none sm:h-[40px] sm:rounded-xl sm:pl-9 sm:text-[0.8rem]`}
                  onClick={() => !formData.pickupLoc && navigate('/tarif')}
                />
              </div>
              {errors.pickupLoc && (
                <span className="text-[0.65rem] font-semibold text-rose-500 sm:text-[0.7rem]">{errors.pickupLoc}</span>
              )}
            </div>

            {/* Tujuan (To) */}
            <div className="flex flex-col gap-1 sm:gap-1.5">
              <label className="text-[0.72rem] font-bold text-slate-700 sm:text-[0.78rem]">
                Lokasi Tujuan (To) <span className="text-rose-500">*</span>
              </label>
              <div className="relative flex items-center">
                <i className="fa-solid fa-flag-checkered absolute left-2.5 z-10 text-[0.75rem] text-emerald-600 sm:left-3 sm:text-[0.8rem]"></i>
                <input
                  type="text"
                  name="dropLoc"
                  readOnly
                  placeholder="Pilih rute dari Daftar Tarif"
                  value={formData.dropLoc}
                  className={`h-[36px] w-full cursor-pointer rounded-lg border ${
                    errors.pickupLoc ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200 bg-slate-100/70'
                  } pl-8 pr-3 text-[0.75rem] font-semibold text-slate-800 outline-none sm:h-[40px] sm:rounded-xl sm:pl-9 sm:text-[0.8rem]`}
                  onClick={() => !formData.dropLoc && navigate('/tarif')}
                />
              </div>
            </div>

            {/* Diskon Tarif (Input Angka Nominal) */}
            <div className="flex flex-col gap-1 sm:gap-1.5">
              <label className="text-[0.72rem] font-bold text-slate-700 sm:text-[0.78rem]">
                Diskon Tarif <span className="font-normal text-slate-400">(Nominal Rp / Opsional)</span>
              </label>
              <div className="relative flex w-full items-center">
                <span className="absolute left-2.5 z-10 text-[0.72rem] font-bold text-amber-500 sm:left-3 sm:text-[0.78rem]">
                  Rp
                </span>
                <input
                  type="text"
                  name="discountAmount"
                  placeholder="0"
                  value={formData.discountAmount ? new Intl.NumberFormat('id-ID').format(formData.discountAmount) : ''}
                  onChange={handleChange}
                  className="h-[36px] w-full rounded-lg border border-slate-200 bg-slate-50/50 pl-8 pr-7 text-[0.75rem] font-semibold text-slate-900 outline-none transition-all focus:border-sky-600 focus:bg-white focus:ring-2 focus:ring-sky-600/10 sm:h-[40px] sm:rounded-xl sm:pl-9 sm:pr-8 sm:text-[0.8rem]"
                />
                {formData.discountAmount > 0 && (
                  <button
                    type="button"
                    onClick={() => handleClear('discountAmount')}
                    className="absolute right-2 flex cursor-pointer items-center justify-center text-[0.85rem] text-slate-400 hover:text-slate-600 sm:right-2.5 sm:text-[0.9rem]"
                  >
                    &times;
                  </button>
                )}
              </div>
            </div>

            {/* Box Ringkasan Tarif */}
            <div className="mt-0.5 rounded-lg border border-sky-200 bg-sky-50/60 p-2.5 text-left sm:rounded-xl sm:p-3">
              <div className="flex items-center justify-between text-[0.75rem] sm:text-[0.82rem]">
                <span className="font-medium text-slate-600">Tarif Normal:</span>
                <span className={`font-semibold ${discountVal > 0 ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                  {formData.price > 0
                    ? `Rp ${new Intl.NumberFormat('id-ID').format(formData.price)}`
                    : 'Belum Ada Rute'}
                </span>
              </div>

              {discountVal > 0 && (
                <div className="mt-1 flex items-center justify-between text-[0.75rem] font-bold text-emerald-600 sm:text-[0.82rem]">
                  <span>Diskon Tarif:</span>
                  <span>-Rp {new Intl.NumberFormat('id-ID').format(discountVal)}</span>
                </div>
              )}

              <div className="mt-1.5 flex items-center justify-between border-t border-sky-100 pt-1.5 text-[0.78rem] sm:text-[0.88rem]">
                <span className="font-bold text-slate-700">Total Tarif Estimasi:</span>
                <strong className="text-[0.92rem] font-extrabold text-sky-600 sm:text-[1rem]">
                  {formData.price > 0
                    ? `Rp ${new Intl.NumberFormat('id-ID').format(finalPrice)}`
                    : 'Belum Ada Rute'}
                </strong>
              </div>

              <div className="mt-1.5 flex items-center gap-1 border-t border-sky-100 pt-1.5 text-[0.65rem] text-slate-500 sm:mt-2 sm:gap-1.5 sm:pt-2 sm:text-[0.7rem]">
                <i className="fa-solid fa-circle-info text-sky-600"></i>
                <span>Sudah termasuk Mobil, Driver, BBM, Maks 4 Penumpang + Bagasi.</span>
              </div>
            </div>

            {/* Tombol Konfirmasi Pemesanan */}
            <button
              type="submit"
              className="mt-1 inline-flex h-[38px] w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-sky-600 text-[0.8rem] font-bold text-white shadow-md shadow-sky-600/20 transition-colors hover:bg-sky-700 sm:h-[42px] sm:rounded-xl sm:text-[0.85rem]"
            >
              <i className="fa-brands fa-whatsapp text-[1rem] sm:text-[1.1rem]"></i>
              <span>Konfirmasi Pemesanan</span>
            </button>
          </form>
        </div>
      </section>

      {/* Modal Ringkasan */}
      {showModal && (
        <ModalSummary
          formData={{
            ...formData,
            finalPrice,
          }}
          onClose={() => setShowModal(false)}
          onConfirm={handleConfirmWhatsApp}
        />
      )}
    </div>
  );
};

export default Booking;
