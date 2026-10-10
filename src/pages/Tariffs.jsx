// src/pages/Tariffs.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTariff } from '@/context/TariffContext';

const API_BASE_DOMAIN = 'https://dafatih-transport.rasmantech.web.id';

const Tariffs = () => {
  const navigate = useNavigate();
  const { tariffs = [], loadingApi, errorApi } = useTariff();
  const [searchQuery, setSearchQuery] = useState('');

  // Formatter URL Gambar Lengkap
  const getImageUrl = (imgPath) => {
    if (!imgPath) return 'https://placehold.co/600x400?text=Dafatih+Transport';
    if (imgPath.startsWith('http://') || imgPath.startsWith('https://')) return imgPath;
    return `${API_BASE_DOMAIN}${imgPath.startsWith('/') ? '' : '/'}${imgPath}`;
  };

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
      <div className="flex min-h-[50vh] items-center justify-center font-bold text-sky-600">
        <i className="fa-solid fa-circle-notch fa-spin mr-2 text-xl"></i>
        Memuat daftar tarif dari server...
      </div>
    );
  }

  if (errorApi) {
    return (
      <div className="py-20 text-center text-rose-500">
        <i className="fa-solid fa-triangle-exclamation mb-2 text-3xl"></i>
        <p>{errorApi}</p>
      </div>
    );
  }

  return (
    <div className="block">
      {/* Banner */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-800 px-[5%] pb-6 pt-7 text-center text-white">
        <h1 className="mb-1 text-xl font-extrabold md:text-2xl">
          Daftar Tarif Transportasi Lombok
        </h1>
        <p className="mx-auto max-w-[550px] text-xs opacity-90 md:text-sm">
          Pilihan rute antar-jemput privat terlengkap dengan harga terjangkau dan transparan.
        </p>
      </div>

      {/* Main Content */}
      <section className="mx-auto max-w-[1200px] px-[4%] py-6 md:px-[5%] md:py-8">
        {/* Search Bar */}
        <div className="mb-6 flex justify-center">
          <div className="relative w-full max-w-md">
            <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400"></i>
            <input
              type="text"
              className="w-full rounded-full border border-slate-300 bg-white py-2 pl-10 pr-4 text-sm outline-none transition-colors focus:border-sky-600"
              placeholder="Cari rute, penjemputan, atau tujuan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Card Grid List */}
        {filteredTariffs.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTariffs.map((item) => {
              const imageSrc = getImageUrl(item.image_url || item.image);
              const routeTitle =
                item.title ||
                item.name ||
                `${item.pickup_location || item.origin} ➔ ${item.dropoff_location || item.destination}`;

              return (
                <div
                  key={item.id}
                  className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="relative h-40 overflow-hidden bg-slate-100">
                    <img
                      src={imageSrc}
                      alt={routeTitle}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <span className="absolute bottom-2 right-2 rounded-md bg-slate-900/85 px-2.5 py-1 text-xs font-extrabold text-white">
                      {formatPrice(item.price)}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col justify-between p-4">
                    <div>
                      <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-sky-600">
                        <i className="fa-solid fa-route"></i>
                        <span>{item.estimated_time || 'Transfer Private'}</span>
                      </div>
                      <h3 className="mb-2 text-base font-bold text-slate-900">{routeTitle}</h3>
                      <p className="text-xs text-slate-500">
                        Dari{' '}
                        <strong className="text-slate-700">
                          {item.pickup_location || item.origin}
                        </strong>{' '}
                        ke{' '}
                        <strong className="text-slate-700">
                          {item.dropoff_location || item.destination}
                        </strong>
                      </p>
                    </div>

                    <button
                      onClick={() => handleSelectRoute(item)}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-sky-600 py-2 text-xs font-bold text-white transition-colors hover:bg-sky-700"
                    >
                      <i className="fa-solid fa-car"></i>
                      <span>Pesan Rute Ini</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-12 text-center">
            <i className="fa-solid fa-receipt mb-3 text-3xl text-slate-300"></i>
            <p className="text-sm text-slate-400">
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
