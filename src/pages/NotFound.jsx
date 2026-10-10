import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-5 py-20 text-center">
      <h1 className="text-[5rem] font-extrabold leading-none text-sky-600">
        404
      </h1>
      <h2 className="my-2.5 text-2xl font-bold text-slate-900">
        Halaman Tidak Ditemukan
      </h2>
      <p className="mb-[25px] max-w-[450px] text-slate-500">
        Maaf, halaman yang Anda cari tidak ada atau rute tujuan telah dipindahkan.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 rounded-full bg-sky-600 px-[28px] py-3 font-bold text-white no-underline transition-all duration-200 hover:-translate-y-0.5 hover:bg-sky-700"
      >
        <i className="fa-solid fa-house"></i>
        <span>Kembali ke Beranda</span>
      </Link>
    </div>
  );
}
