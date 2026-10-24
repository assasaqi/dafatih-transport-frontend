// src/pages/Guide.jsx

import React from 'react';
import { Link } from 'react-router-dom';

const STEPS = [
  {
    number: '01',
    title: 'Cari & Pilih Rute',
    description: 'Pilih titik penjemputan dan lokasi tujuan Anda melalui halaman Beranda atau Daftar Tarif.',
    icon: 'fa-magnifying-glass-location',
  },
  {
    number: '02',
    title: 'Isi Formulir Pemesanan',
    description: 'Lengkapi data diri, tanggal & jam penjemputan, serta jumlah penumpang dan catatan tambahan.',
    icon: 'fa-file-pen',
  },
  {
    number: '03',
    title: 'Konfirmasi via WhatsApp',
    description: 'Sistem akan mengarahkan Anda ke WhatsApp admin untuk konfirmasi ketersediaan armada dan rincian harga.',
    icon: 'fa-comments',
  },
  {
    number: '04',
    title: 'Siap Dijemput',
    description: 'Driver kami akan menghubungi Anda menjelang waktu penjemputan untuk memastikan keberangkatan lancar.',
    icon: 'fa-car-side',
  },
];

const FAQS = [
  {
    q: 'Apakah bisa memesan untuk penjemputan mendadak?',
    a: 'Kami menyarankan pemesanan dilakukan minimal 6-12 jam sebelum waktu penjemputan agar ketersediaan armada terjamin.',
  },
  {
    q: 'Bagaimana metode pembayarannya?',
    a: 'Pembayaran dapat dilakukan melalui transfer bank atau tunai langsung ke driver saat perjalanan selesai.',
  },
  {
    q: 'Apakah harga tarif sudah termasuk bensin dan driver?',
    a: 'Ya, seluruh tarif yang tertera sudah bersifat all-in (armada, driver, dan BBM), kecuali biaya tol atau parkir jika ada.',
  },
  {
    q: 'Bagaimana jika jadwal penerbangan saya mengalami delay?',
    a: 'Informasikan nomor penerbangan Anda saat memesan. Driver kami akan memantau status penerbangan secara real-time.',
  },
];

const Guide = () => {
  return (
    <div className="block">
      {/* Banner Header */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-800 px-[5%] py-3.5 pt-20 md:pt-24 text-center text-white">
        <h1 className="text-sm sm:text-base md:text-xl font-extrabold truncate">
          Panduan & Cara Pemesanan Layanan
        </h1>
      </div>

      {/* Main Content */}
      <section className="mx-auto max-w-[1200px] px-[4%] py-5 md:px-[5%] md:py-10">

        {/* Step-by-Step Flow */}
        <div className="mb-8 sm:mb-16">
          <div className="mb-6 sm:mb-12 text-center">
            <span className="inline-block rounded-full bg-sky-50 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[0.62rem] sm:text-xs font-bold uppercase tracking-wider text-sky-600 border border-sky-100 mb-1.5">
              Langkah Sederhana
            </span>
            <h2 className="text-sm sm:text-xl md:text-2xl font-extrabold text-slate-900">
              4 Langkah Mudah Memesan Transportasi
            </h2>
            <p className="mt-0.5 text-[0.7rem] sm:text-sm text-slate-500">
              Proses cepat dan praktis tanpa ribet untuk kenyamanan liburan Anda di Lombok.
            </p>
          </div>

          {/* Stepper Container */}
          <div className="relative">
            {/* Mobile Vertical Line */}
            <div className="absolute left-4 top-5 bottom-5 w-0.5 bg-slate-200 lg:hidden -z-0" />

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-4 lg:gap-6">
              {STEPS.map((step, index) => {
                const isLast = index === STEPS.length - 1;

                return (
                  <div key={step.number} className="relative flex flex-col items-start lg:items-center text-left lg:text-center group">

                    {/* Desktop Horizontal Line + Dot Circle Connector */}
                    {!isLast && (
                      <div className="hidden lg:flex absolute top-5 left-[55%] w-[90%] items-center z-0 pointer-events-none">
                        <div className="h-[2px] w-full bg-slate-200 transition-colors duration-300 group-hover:bg-sky-400" />
                        <div className="h-3 w-3 shrink-0 rounded-full border-2 border-white bg-sky-600 shadow-md ring-2 ring-sky-100" />
                      </div>
                    )}

                    {/* Step Circle Badge (Ukuran Mobile Diperkecil) */}
                    <div className="relative z-10 flex items-center gap-3 lg:flex-col lg:gap-3 mb-2 lg:mb-3">
                      <div className="relative flex h-9 w-9 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-sky-500 to-sky-600 text-white shadow-md shadow-sky-500/20 transition-transform duration-300 group-hover:scale-105">
                        <i className={`fa-solid ${step.icon} text-sm sm:text-lg`}></i>

                        {/* Number Badge */}
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-slate-900 text-[0.55rem] sm:text-[0.65rem] font-black text-white border border-white shadow-sm">
                          {step.number}
                        </span>
                      </div>

                      {/* Dot Circle Separator (Mobile view) */}
                      <div className="flex h-2 w-2 rounded-full bg-sky-500 ring-2 ring-sky-100 lg:hidden" />
                    </div>

                    {/* Content Card (Ukuran & Padding Mobile Diperkecil) */}
                    <div className="ml-12 lg:ml-0 flex-1 rounded-xl sm:rounded-2xl border border-slate-200/80 bg-white p-3 sm:p-5 shadow-sm transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-md group-hover:border-sky-200">
                      <h3 className="mb-1 text-xs sm:text-sm md:text-base font-bold text-slate-900">
                        {step.title}
                      </h3>
                      <p className="text-[0.68rem] sm:text-xs leading-relaxed text-slate-500">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section FAQ / Pertanyaan Umum (Gulir Ke Samping di Mobile) */}
        <div className="mb-8 sm:mb-14 rounded-2xl bg-slate-50 p-4 sm:p-8 border border-slate-200/80 shadow-sm">
          <div className="mb-4 sm:mb-6 text-center">
            <h2 className="text-sm sm:text-lg md:text-xl font-bold text-slate-900">
              Pertanyaan Sering Diajukan (FAQ)
            </h2>
            <p className="mt-0.5 text-[0.7rem] sm:text-sm text-slate-500">
              Informasi penting seputar layanan dan kebijakan pemesanan.
            </p>
          </div>

          {/* Kartu FAQ: Gulir Samping di Mobile, Grid di Desktop, Scrollbar Disembunyikan */}
          <div className="flex overflow-x-auto gap-3 pb-2 pt-1 sm:pb-0 scrollbar-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:grid sm:grid-cols-2 sm:gap-6">
            {FAQS.map((faq, index) => (
              <div
                key={index}
                className="min-w-[82%] sm:min-w-0 shrink-0 sm:shrink rounded-xl border border-slate-200 bg-white p-3 sm:p-4 shadow-sm transition-colors hover:border-sky-300 flex flex-col justify-between"
              >
                <div>
                  <h3 className="mb-1 text-[0.75rem] sm:text-sm font-bold text-slate-900 flex items-start gap-1.5 leading-snug">
                    <i className="fa-solid fa-circle-question mt-0.5 text-sky-600 shrink-0 text-xs sm:text-sm"></i>
                    <span>{faq.q}</span>
                  </h3>
                  <p className="pl-5 text-[0.68rem] sm:text-xs leading-relaxed text-slate-500">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call To Action Box */}
        <div className="flex flex-col items-center justify-between gap-3.5 rounded-2xl bg-gradient-to-r from-sky-600 to-sky-700 p-4 sm:p-8 text-white shadow-lg sm:flex-row">
          <div className="text-center sm:text-left">
            <h3 className="text-xs sm:text-base md:text-lg font-bold">
              Siap untuk Memulai Perjalanan Anda di Lombok?
            </h3>
            <p className="mt-0.5 text-[0.68rem] sm:text-sm text-sky-100">
              Pesan armada impian Anda sekarang atau hubungi customer service kami.
            </p>
          </div>
          <div className="flex w-full shrink-0 items-center justify-center gap-3 sm:w-auto">
            <Link
              to="/pesan"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-4 py-2 sm:px-5 sm:py-2.5 text-[0.75rem] sm:text-sm font-bold text-sky-700 shadow-md transition-transform hover:-translate-y-0.5 hover:bg-sky-50"
            >
              <i className="fa-solid fa-car text-xs sm:text-sm"></i>
              <span>Pesan Sekarang</span>
            </Link>
          </div>
        </div>

      </section>
    </div>
  );
};

export default Guide;
