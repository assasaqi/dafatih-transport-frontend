import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import countriesData from '../data/countries.json';
import ModalSummary from '@/components/ModalSummary';

const Booking = () => {
  const location = useLocation();
  const PHONE_NUMBER = "6287757004214";

  const todayStr = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    custName: '',
    countryCode: '62',
    custWa: '',
    pickupDate: todayStr,
    pickupTime: '08:00',
    pickupLoc: '',
    dropLoc: '',
    price: 0
  });

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (location.state) {
      setFormData((prev) => ({
        ...prev,
        pickupLoc: location.state.pickup || '',
        dropLoc: location.state.drop || '',
        price: location.state.price || 0
      }));
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClear = (field) => {
    setFormData((prev) => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let waNumber = formData.custWa.trim();
    if (waNumber.startsWith('0')) {
      waNumber = waNumber.substring(1);
    }

    if (!formData.price || !formData.pickupLoc) {
      alert('Silakan pilih rute perjalanan terlebih dahulu dari Daftar Tarif!');
      return;
    }

    setFormData((prev) => ({ ...prev, custWa: waNumber }));
    setShowModal(true);
  };

  const handleConfirmWhatsApp = () => {
    const message = `Halo Dafatih Transport, saya ingin memesan layanan antar-jemput dengan detail berikut:%0A%0A*Nama:* ${formData.custName}%0A*No. WA:* +${formData.countryCode}${formData.custWa}%0A*Tanggal:* ${formData.pickupDate}%0A*Waktu:* ${formData.pickupTime} WITA%0A*Penjemputan:* ${formData.pickupLoc}%0A*Tujuan:* ${formData.dropLoc}%0A*Estimasi Tarif:* Rp ${new Intl.NumberFormat('id-ID').format(formData.price)}%0A%0AMohon konfirmasinya, terima kasih.`;

    window.open(`https://wa.me/${PHONE_NUMBER}?text=${message}`, '_blank');
  };

  return (
    <div className="block">
      {/* Page Banner */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-800 px-[4%] py-3 text-center text-white sm:py-3.5">
        <h1 className="mb-0.5 text-[clamp(1.05rem,1.8vw+0.3rem,1.25rem)] font-extrabold">
          Formulir Pemesanan Transportasi
        </h1>
        <p className="mx-auto max-w-[500px] text-[clamp(0.72rem,0.7vw+0.3rem,0.78rem)] text-slate-100 opacity-90">
          Lengkapi formulir di bawah ini untuk reservasi cepat via WhatsApp.
        </p>
      </div>

      {/* Booking Form Section */}
      <section className="mx-auto max-w-[500px] px-[3%] pb-6 pt-2.5 sm:px-[4%] sm:pb-8 sm:pt-3">
        <div className="mx-auto rounded-xl border border-slate-200 bg-white p-3 shadow-[0_2px_8px_rgba(0,0,0,0.04)] sm:p-3.5">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2.5">
              {/* Nama Lengkap */}
              <div className="flex flex-col gap-1">
                <label className="text-[0.76rem] font-bold text-slate-700">
                  Nama Lengkap Pemesan *
                </label>
                <div className="relative flex w-full items-center">
                  <input
                    type="text"
                    name="custName"
                    required
                    placeholder="Contoh: Budi Santoso"
                    value={formData.custName}
                    onChange={handleChange}
                    className="h-[36px] w-full rounded-md border border-slate-300 bg-white px-2.5 pr-8 text-[0.78rem] text-slate-900 outline-none transition-colors focus:border-sky-600 focus:ring-2 focus:ring-sky-600/10"
                  />
                  {formData.custName && (
                    <button
                      type="button"
                      onClick={() => handleClear('custName')}
                      className="absolute right-1.5 flex p-1 text-[0.8rem] text-slate-400 hover:text-slate-600"
                    >
                      &times;
                    </button>
                  )}
                </div>
              </div>

              {/* Nomor WhatsApp */}
              <div className="flex flex-col gap-1">
                <label className="text-[0.76rem] font-bold text-slate-700">
                  Nomor WhatsApp *
                </label>
                <div className="flex items-center overflow-hidden rounded-md border border-slate-300 bg-white">
                  <select
                    name="countryCode"
                    value={formData.countryCode}
                    onChange={handleChange}
                    className="h-[34px] w-[100px] shrink-0 border-r border-slate-300 bg-slate-100 px-1.5 text-[0.78rem] font-bold text-slate-600 outline-none"
                  >
                    {countriesData.countries?.map((c, i) => (
                      <option key={i} value={c.code}>
                        {c.flag} +{c.code}
                      </option>
                    ))}
                  </select>
                  <div className="relative flex flex-1 items-center">
                    <input
                      type="tel"
                      name="custWa"
                      required
                      placeholder="8123456789"
                      value={formData.custWa}
                      onChange={handleChange}
                      className="h-[34px] w-full bg-transparent px-2.5 pr-8 text-[0.78rem] text-slate-900 outline-none"
                    />
                    {formData.custWa && (
                      <button
                        type="button"
                        onClick={() => handleClear('custWa')}
                        className="absolute right-1.5 flex p-1 text-[0.8rem] text-slate-400 hover:text-slate-600"
                      >
                        &times;
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Grid Tanggal & Waktu */}
              <div className="grid grid-cols-[1.4fr_1fr] gap-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[0.76rem] font-bold text-slate-700">
                    Tanggal Jemput *
                  </label>
                  <input
                    type="date"
                    name="pickupDate"
                    min={todayStr}
                    required
                    value={formData.pickupDate}
                    onChange={handleChange}
                    className="h-[36px] w-full rounded-md border border-slate-300 bg-white px-2 pr-1 text-[0.78rem] text-slate-900 outline-none transition-colors focus:border-sky-600 focus:ring-2 focus:ring-sky-600/10 [&::-webkit-calendar-picker-indicator]:scale-85 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-60"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[0.76rem] font-bold text-slate-700">
                    Waktu (WITA) *
                  </label>
                  <input
                    type="time"
                    name="pickupTime"
                    required
                    value={formData.pickupTime}
                    onChange={handleChange}
                    className="h-[36px] w-full rounded-md border border-slate-300 bg-white px-2 pr-1 text-[0.78rem] text-slate-900 outline-none transition-colors focus:border-sky-600 focus:ring-2 focus:ring-sky-600/10 [&::-webkit-calendar-picker-indicator]:scale-85 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-60"
                  />
                </div>
              </div>

              {/* Penjemputan */}
              <div className="flex flex-col gap-1">
                <label className="text-[0.76rem] font-bold text-slate-700">
                  Lokasi Penjemputan (From) *
                </label>
                <input
                  type="text"
                  name="pickupLoc"
                  required
                  readOnly
                  placeholder="Pilih dari Daftar Tarif"
                  value={formData.pickupLoc}
                  className="h-[36px] w-full cursor-pointer rounded-md border border-slate-300 bg-slate-50 px-2.5 text-[0.78rem] text-slate-900 outline-none"
                />
              </div>

              {/* Tujuan */}
              <div className="flex flex-col gap-1">
                <label className="text-[0.76rem] font-bold text-slate-700">
                  Lokasi Tujuan (To) *
                </label>
                <input
                  type="text"
                  name="dropLoc"
                  required
                  readOnly
                  placeholder="Pilih dari Daftar Tarif"
                  value={formData.dropLoc}
                  className="h-[36px] w-full cursor-pointer rounded-md border border-slate-300 bg-slate-50 px-2.5 text-[0.78rem] text-slate-900 outline-none"
                />
              </div>
            </div>

            {/* Box Estimasi Tarif */}
            <div className="my-3 rounded-md border border-dashed border-sky-600 bg-sky-50/70 p-2.5 text-left">
              <div className="flex items-center justify-between text-[0.8rem] text-slate-900">
                <span>Estimasi Tarif Sesuai Rute: </span>
                <strong className="text-[0.9rem] text-sky-600">
                  {formData.price > 0
                    ? `Rp ${new Intl.NumberFormat('id-ID').format(formData.price)}`
                    : 'Pilih dari Daftar Tarif'}
                </strong>
              </div>
              <small className="mt-0.5 block text-[0.7rem] text-slate-500">
                *Tarif otomatis terisi saat memilih rute (Maks 4 Pax & Bagasi).
              </small>
            </div>

            <button
              type="submit"
              className="inline-flex h-[38px] w-full items-center justify-center gap-1.5 rounded-md bg-sky-600 text-[0.82rem] font-bold text-white shadow-[0_3px_10px_rgba(2,132,199,0.2)] transition-colors hover:bg-sky-700"
            >
              <i className="fa-brands fa-whatsapp text-[1rem]"></i> Konfirmasi Pemesanan
            </button>
          </form>
        </div>
      </section>

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
