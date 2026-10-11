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
  price: 0,
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
      const cleaned = value.replace(/\D/g, '');
      setFormData((prev) => ({ ...prev, custWa: cleaned }));
      setErrors((prev) => ({ ...prev, custWa: '' }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  // Handler Tanggal
  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (date) {
      const formattedDate = date.toISOString().split('T')[0];
      setFormData((prev) => ({ ...prev, pickupDate: formattedDate }));
    } else {
      setFormData((prev) => ({ ...prev, pickupDate: '' }));
    }
    setErrors((prev) => ({ ...prev, pickupDate: '' }));
  };

  // Handler Waktu
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

    if (!formData.custWa) {
      newErrors.custWa = 'Nomor WhatsApp wajib diisi';
    } else if (formData.custWa.length < 10 || formData.custWa.length > 14) {
      newErrors.custWa = 'Masukkan nomor WhatsApp yang valid (10-14 digit)';
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
      setShowModal(true);
    }
  };

  const handleConfirmWhatsApp = () => {
    let formattedWa = formData.custWa.trim();
    if (formattedWa.startsWith('0')) {
      formattedWa = '62' + formattedWa.substring(1);
    } else if (!formattedWa.startsWith('62')) {
      formattedWa = '62' + formattedWa;
    }

    const message = `Halo Dafatih Transport, saya ingin memesan layanan antar-jemput dengan detail berikut:%0A%0A*Nama:* ${formData.custName}%0A*No. WA:* +${formattedWa}%0A*Tanggal:* ${formData.pickupDate}%0A*Waktu:* ${formData.pickupTime} WITA%0A*Penjemputan:* ${formData.pickupLoc}%0A*Tujuan:* ${formData.dropLoc}%0A*Estimasi Tarif:* Rp ${new Intl.NumberFormat('id-ID').format(formData.price)}%0A%0AMohon konfirmasinya, terima kasih.`;

    window.open(`https://wa.me/${PHONE_NUMBER}?text=${message}`, '_blank');
  };

  return (
    <div className="block">
      {/* Page Header */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-800 px-[5%] py-3.5 pt-20 md:pt-24 text-center text-white">
        <h1 className="text-sm sm:text-base md:text-xl font-extrabold truncate">
          Pemesanan Transportasi Lombok
        </h1>
      </div>

      {/* Form Section */}
      <section className="mx-auto max-w-[520px] px-[3%] py-3.5 sm:px-[4%] sm:py-6 md:py-8">
        <div className="rounded-xl sm:rounded-2xl border border-slate-100 bg-white p-3 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
          <div className="mb-2.5 sm:mb-3 flex items-center justify-between border-b border-slate-100 pb-2 sm:pb-2.5">
            <h2 className="text-[0.85rem] sm:text-[0.92rem] font-extrabold text-slate-800">Form Pemesanan</h2>
            <button
              type="button"
              onClick={handleResetForm}
              className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[0.68rem] sm:text-[0.72rem] font-bold text-slate-600 transition-colors hover:bg-rose-50 hover:text-rose-600 cursor-pointer"
            >
              <i className="fa-solid fa-rotate-left text-[0.65rem] sm:text-[0.7rem]"></i>
              <span>Reset Form</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-2.5 sm:gap-3.5">
            {/* Nama Lengkap */}
            <div className="flex flex-col gap-1 sm:gap-1.5">
              <label className="text-[0.72rem] sm:text-[0.78rem] font-bold text-slate-700">
                Nama Lengkap Pemesan <span className="text-rose-500">*</span>
              </label>
              <div className="relative flex w-full items-center">
                <i className="fa-solid fa-user absolute left-2.5 sm:left-3 z-10 text-[0.75rem] sm:text-[0.8rem] text-slate-400"></i>
                <input
                  type="text"
                  name="custName"
                  placeholder="Contoh: Dafatih Ramadhan"
                  value={formData.custName}
                  onChange={handleChange}
                  className={`h-[36px] sm:h-[40px] w-full rounded-lg sm:rounded-xl border ${
                    errors.custName ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200 bg-slate-50/50'
                  } pl-8 sm:pl-9 pr-7 sm:pr-8 text-[0.75rem] sm:text-[0.8rem] text-slate-900 outline-none transition-all focus:border-sky-600 focus:bg-white focus:ring-2 focus:ring-sky-600/10`}
                />
                {formData.custName && (
                  <button
                    type="button"
                    onClick={() => handleClear('custName')}
                    className="absolute right-2 sm:right-2.5 flex items-center justify-center text-[0.85rem] sm:text-[0.9rem] text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    &times;
                  </button>
                )}
              </div>
              {errors.custName && (
                <span className="text-[0.65rem] sm:text-[0.7rem] font-semibold text-rose-500">{errors.custName}</span>
              )}
            </div>

            {/* Nomor WhatsApp */}
            <div className="flex flex-col gap-1 sm:gap-1.5">
              <label className="text-[0.72rem] sm:text-[0.78rem] font-bold text-slate-700">
                Nomor WhatsApp <span className="text-rose-500">*</span>
              </label>
              <div className="relative flex w-full items-center">
                <i className="fa-brands fa-whatsapp absolute left-2.5 sm:left-3 z-10 text-[0.85rem] sm:text-[0.9rem] text-emerald-600"></i>
                <input
                  type="tel"
                  name="custWa"
                  placeholder="Contoh: 0812-xxxx-xxxx"
                  value={formData.custWa}
                  onChange={handleChange}
                  maxLength={14}
                  className={`h-[36px] sm:h-[40px] w-full rounded-lg sm:rounded-xl border ${
                    errors.custWa ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200 bg-slate-50/50'
                  } pl-8 sm:pl-9 pr-7 sm:pr-8 text-[0.75rem] sm:text-[0.8rem] text-slate-900 outline-none transition-all focus:border-sky-600 focus:bg-white focus:ring-2 focus:ring-sky-600/10`}
                />
                {formData.custWa && (
                  <button
                    type="button"
                    onClick={() => handleClear('custWa')}
                    className="absolute right-2 sm:right-2.5 flex items-center justify-center text-[0.85rem] sm:text-[0.9rem] text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    &times;
                  </button>
                )}
              </div>
              {errors.custWa && (
                <span className="text-[0.65rem] sm:text-[0.7rem] font-semibold text-rose-500">{errors.custWa}</span>
              )}
            </div>

            {/* Grid Tanggal & Waktu */}
            <div className="grid grid-cols-[1.3fr_1fr] gap-2 sm:gap-2.5">
              {/* Pemilih Tanggal (Format dd-MM-yyyy) */}
              <div className="flex flex-col gap-1 sm:gap-1.5">
                <label className="text-[0.72rem] sm:text-[0.78rem] font-bold text-slate-700">
                  Tanggal Jemput <span className="text-rose-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <i className="fa-solid fa-calendar-days pointer-events-none absolute left-2.5 sm:left-3 z-10 text-[0.75rem] sm:text-[0.8rem] text-sky-600"></i>
                  <DatePicker
                    selected={selectedDate}
                    onChange={handleDateChange}
                    minDate={new Date()}
                    dateFormat="dd-MM-yyyy"
                    placeholderText="Pilih Tanggal"
                    withPortal
                    className={`h-[36px] sm:h-[40px] w-full cursor-pointer rounded-lg sm:rounded-xl border ${
                      errors.pickupDate ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200 bg-slate-50/50'
                    } pl-8 sm:pl-9 pr-2 text-[0.72rem] sm:text-[0.78rem] font-semibold text-slate-800 outline-none transition-all focus:border-sky-600 focus:bg-white focus:ring-2 focus:ring-sky-600/10`}
                  />
                </div>
                {errors.pickupDate && (
                  <span className="text-[0.62rem] sm:text-[0.68rem] font-semibold text-rose-500">{errors.pickupDate}</span>
                )}
              </div>

            {/* Pemilih Waktu */}
            <div className="flex flex-col gap-1 sm:gap-1.5">
            <label className="text-[0.72rem] sm:text-[0.78rem] font-bold text-slate-700">
                Waktu<span className="text-rose-500"></span>
            </label>
            <div className="relative flex items-center">
                <i className="fa-solid fa-clock pointer-events-none absolute left-2.5 sm:left-3 z-10 text-[0.75rem] sm:text-[0.8rem] text-sky-600"></i>
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
                className={`h-[36px] sm:h-[40px] w-full cursor-pointer rounded-lg sm:rounded-xl border ${
                    errors.pickupTime ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200 bg-slate-50/50'
                } pl-8 sm:pl-9 pr-1.5 sm:pr-2 text-[0.72rem] sm:text-[0.78rem] font-semibold text-slate-800 outline-none transition-all focus:border-sky-600 focus:bg-white focus:ring-2 focus:ring-sky-600/10`}
                />
            </div>
            {errors.pickupTime && (
                <span className="text-[0.62rem] sm:text-[0.68rem] font-semibold text-rose-500">{errors.pickupTime}</span>
            )}
            </div>
            </div>

            {/* Penjemputan (From) */}
            <div className="flex flex-col gap-1 sm:gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[0.72rem] sm:text-[0.78rem] font-bold text-slate-700">
                  Lokasi Penjemputan (From) <span className="text-rose-500">*</span>
                </label>
                {!formData.pickupLoc && (
                  <button
                    type="button"
                    onClick={() => navigate('/tarif')}
                    className="text-[0.65rem] sm:text-[0.7rem] font-bold text-sky-600 hover:underline cursor-pointer"
                  >
                    + Pilih Rute
                  </button>
                )}
              </div>
              <div className="relative flex items-center">
                <i className="fa-solid fa-location-dot absolute left-2.5 sm:left-3 z-10 text-[0.75rem] sm:text-[0.8rem] text-rose-500"></i>
                <input
                  type="text"
                  name="pickupLoc"
                  readOnly
                  placeholder="Pilih rute dari Daftar Tarif"
                  value={formData.pickupLoc}
                  className={`h-[36px] sm:h-[40px] w-full cursor-pointer rounded-lg sm:rounded-xl border ${
                    errors.pickupLoc ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200 bg-slate-100/70'
                  } pl-8 sm:pl-9 pr-3 text-[0.75rem] sm:text-[0.8rem] font-semibold text-slate-800 outline-none`}
                  onClick={() => !formData.pickupLoc && navigate('/tarif')}
                />
              </div>
              {errors.pickupLoc && (
                <span className="text-[0.65rem] sm:text-[0.7rem] font-semibold text-rose-500">{errors.pickupLoc}</span>
              )}
            </div>

            {/* Tujuan (To) */}
            <div className="flex flex-col gap-1 sm:gap-1.5">
              <label className="text-[0.72rem] sm:text-[0.78rem] font-bold text-slate-700">
                Lokasi Tujuan (To) <span className="text-rose-500">*</span>
              </label>
              <div className="relative flex items-center">
                <i className="fa-solid fa-flag-checkered absolute left-2.5 sm:left-3 z-10 text-[0.75rem] sm:text-[0.8rem] text-emerald-600"></i>
                <input
                  type="text"
                  name="dropLoc"
                  readOnly
                  placeholder="Pilih rute dari Daftar Tarif"
                  value={formData.dropLoc}
                  className={`h-[36px] sm:h-[40px] w-full cursor-pointer rounded-lg sm:rounded-xl border ${
                    errors.pickupLoc ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200 bg-slate-100/70'
                  } pl-8 sm:pl-9 pr-3 text-[0.75rem] sm:text-[0.8rem] font-semibold text-slate-800 outline-none`}
                  onClick={() => !formData.dropLoc && navigate('/tarif')}
                />
              </div>
            </div>

            {/* Box Ringkasan Tarif */}
            <div className="mt-0.5 rounded-lg sm:rounded-xl border border-sky-200 bg-sky-50/60 p-2.5 sm:p-3 text-left">
              <div className="flex items-center justify-between text-[0.75rem] sm:text-[0.82rem]">
                <span className="font-medium text-slate-600">Total Tarif Estimasi:</span>
                <strong className="text-[0.88rem] sm:text-[0.95rem] font-extrabold text-sky-600">
                  {formData.price > 0
                    ? `Rp ${new Intl.NumberFormat('id-ID').format(formData.price)}`
                    : 'Belum Ada Rute'}
                </strong>
              </div>
              <div className="mt-1.5 sm:mt-2 flex items-center gap-1 sm:gap-1.5 border-t border-sky-100 pt-1.5 sm:pt-2 text-[0.65rem] sm:text-[0.7rem] text-slate-500">
                <i className="fa-solid fa-circle-info text-sky-600"></i>
                <span>Sudah termasuk Mobil, Driver, BBM, Maks 4 Penumpang + Bagasi.</span>
              </div>
            </div>

            {/* Tombol Konfirmasi WhatsApp */}
            <button
              type="submit"
              className="mt-1 inline-flex h-[38px] sm:h-[42px] w-full items-center justify-center gap-2 rounded-lg sm:rounded-xl bg-sky-600 text-[0.8rem] sm:text-[0.85rem] font-bold text-white shadow-md shadow-sky-600/20 transition-colors hover:bg-sky-700 cursor-pointer"
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
          formData={formData}
          onClose={() => setShowModal(false)}
          onConfirm={handleConfirmWhatsApp}
        />
      )}
    </div>
  );
};

export default Booking;
