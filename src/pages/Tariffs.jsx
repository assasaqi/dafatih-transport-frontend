// src/pages/Tariffs.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTariff } from '@/context/TariffContext';

const Tariffs = () => {
  const navigate = useNavigate();
  const { tariffs = [], loadingApi, errorApi } = useTariff();
  const [searchQuery, setSearchQuery] = useState('');

  // Formatter Mata Uang Rupiah
  const formatPrice = (priceVal) => {
    const num = Number(priceVal);
    if (isNaN(num) || num <= 0) return 'Hubungi Kami';
    return `Rp ${new Intl.NumberFormat('id-ID').format(num)}`;
  };

  // Handler Kirim Data Rute ke Halaman Pemesanan
  const handleSelectRoute = (item) => {
    navigate('/pesan', {
      state: {
        pickup: item.pickup_location || item.origin || '',
        drop: item.dropoff_location || item.destination || '',
        price: Number(item.price) || 0,
      },
    });
  };

  // Logika Filter Pencarian
  const filteredTariffs = (Array.isArray(tariffs) ? tariffs : []).filter((item) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    const title = (item.title || item.name || '').toLowerCase();
    const pickup = (item.pickup_location || item.origin || '').toLowerCase();
    const drop = (item.dropoff_location || item.destination || '').toLowerCase();
    return title.includes(q) || pickup.includes(q) || drop.includes(q);
  });

  if (loadingApi) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center pt-24 font-bold text-sky-600">
        <i className="fa-solid fa-circle-notch fa-spin mr-2 text-xl"></i>
        Memuat daftar tarif dari server...
      </div>
    );
  }

  if (errorApi) {
    return (
      <div className="py-20 pt-28 text-center text-rose-500">
        <i className="fa-solid fa-triangle-exclamation mb-2 text-3xl"></i>
        <p>{errorApi}</p>
      </div>
    );
  }

  return (
    <div className="block">
      {/* Banner - Ukuran Judul Ringkas 1 Baris di Mobile */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-800 px-[3%] pb-4 pt-20 md:pt-24 text-center text-white">
        <h1 className="mb-0.5 text-[0.82rem] sm:text-lg md:text-2xl font-extrabold whitespace-nowrap tracking-tight">
          Daftar Tarif Transportasi Lombok
        </h1>
      </div>

      {/* Main Content */}
      <section className="mx-auto max-w-[1200px] px-[2.5%] py-3.5 sm:px-[4%] sm:py-6 md:px-[5%] md:py-8">
        {/* Search Bar */}
        <div className="mb-3 sm:mb-6 flex justify-center">
          <div className="relative w-full max-w-md">
            <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-xs sm:text-sm text-slate-400"></i>
            <input
              type="text"
              className="w-full rounded-full border border-slate-300 bg-white py-1.5 sm:py-2 pl-8 sm:pl-10 pr-3 sm:pr-4 text-[0.75rem] sm:text-sm outline-none transition-colors focus:border-sky-600"
              placeholder="Cari rute, penjemputan, atau tujuan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Tabel Tarif Ringkas untuk Mobile & Desktop */}
        {filteredTariffs.length > 0 ? (
          <div className="overflow-x-auto rounded-lg sm:rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left text-[0.72rem] sm:text-sm text-slate-600">
              <thead className="bg-slate-100 text-[0.62rem] sm:text-xs uppercase tracking-wider text-slate-700">
                <tr>
                  <th scope="col" className="px-2 py-2 sm:px-4 sm:py-3.5">
                    Rute / Layanan
                  </th>
                  <th scope="col" className="px-3 py-3.5 hidden sm:table-cell">
                    Penjemputan
                  </th>
                  <th scope="col" className="px-3 py-3.5 hidden md:table-cell">
                    Tujuan
                  </th>
                  <th scope="col" className="px-3 py-3.5 hidden lg:table-cell">
                    Estimasi
                  </th>
                  <th scope="col" className="px-2 py-2 sm:px-4 sm:py-3.5">
                    Harga
                  </th>
                  <th scope="col" className="px-2 py-2 sm:px-4 sm:py-3.5 text-center">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTariffs.map((item) => {
                  const routeTitle =
                    item.title ||
                    item.name ||
                    `${item.pickup_location || item.origin} ➔ ${item.dropoff_location || item.destination}`;

                  return (
                    <tr
                      key={item.id}
                      className="transition-colors hover:bg-slate-50/80"
                    >
                      {/* Rute / Layanan */}
                      <td className="px-2 py-1.5 sm:px-4 sm:py-3">
                        <div className="font-normal sm:font-bold text-[0.75rem] sm:text-sm text-slate-900 leading-tight">
                          {routeTitle}
                        </div>
                        <div className="text-[0.65rem] text-slate-400 mt-0.5 sm:hidden leading-snug">
                          {item.pickup_location || item.origin} ➔ {item.dropoff_location || item.destination}
                        </div>
                      </td>

                      {/* Penjemputan */}
                      <td className="px-3 py-3 font-medium text-slate-700 hidden sm:table-cell">
                        {item.pickup_location || item.origin || '-'}
                      </td>

                      {/* Tujuan */}
                      <td className="px-3 py-3 font-medium text-slate-700 hidden md:table-cell">
                        {item.dropoff_location || item.destination || '-'}
                      </td>

                      {/* Estimasi Waktu */}
                      <td className="px-3 py-3 text-xs font-semibold text-sky-600 hidden lg:table-cell">
                        <i className="fa-solid fa-route mr-1"></i>
                        {item.estimated_time || 'Transfer Private'}
                      </td>

                      {/* Harga */}
                      <td className="px-2 py-1.5 sm:px-4 sm:py-3 whitespace-nowrap text-[0.72rem] sm:text-sm font-semibold sm:font-extrabold text-slate-900">
                        {formatPrice(item.price)}
                      </td>

                      {/* Tombol Aksi (Hanya Ikon) */}
                      <td className="px-2 py-1.5 sm:px-4 sm:py-3 text-center whitespace-nowrap">
                        <button
                          onClick={() => handleSelectRoute(item)}
                          className="inline-flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-md bg-sky-600 text-white shadow-sm transition-colors hover:bg-sky-700 active:scale-95"
                          title="Pesan Rute Ini"
                        >
                          <i className="fa-solid fa-car text-[0.72rem] sm:text-[0.8rem]"></i>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-10 text-center">
            <i className="fa-solid fa-receipt mb-2 text-2xl text-slate-300"></i>
            <p className="text-xs sm:text-sm text-slate-400">
              {searchQuery
                ? `Tidak ada rute yang cocok dengan "${searchQuery}"`
                : 'Belum ada data tarif yang tersedia.'}
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Tariffs;
