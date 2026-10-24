// src/components/RouteCard.jsx

import React, { memo } from 'react';

const RouteCard = memo(({ route, routeId, imageSrc, isImageFailed, onImageError, formatPrice, onSelect }) => {
  const pickupLocation = route.pickup_location || route.origin || route.pickup || '-';
  const dropoffLocation = route.dropoff_location || route.destination || route.drop || '-';

  const routeTitle = route.title || route.name || '';

  return (
    <div
      onClick={() => onSelect(route)}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-xl border border-slate-100 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.12)] active:scale-[0.99]"
    >
      {/* Gambar Rute */}
      <div className="relative h-[95px] overflow-hidden bg-slate-100 sm:h-[135px]">
        {!isImageFailed ? (
          <img
            src={imageSrc}
            alt={routeTitle || `${pickupLocation} - ${dropoffLocation}`}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-400 group-hover:scale-105"
            onError={() => onImageError(routeId)}
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-slate-200/70 p-2 text-slate-400">
            <i className="fa-regular fa-image mb-1 text-[1.2rem] sm:text-[1.5rem]"></i>
            <span className="text-[0.62rem] font-medium sm:text-[0.68rem]">No Image Available</span>
          </div>
        )}
      </div>

      {/* Konten Kartu */}
      <div className="flex flex-grow flex-col p-2.5 sm:p-3">
        {/* Lokasi Penjemputan (Dari) & Tujuan (Ke) Menggunakan Icon */}
        <div className="mb-1.5 flex flex-col gap-1 overflow-hidden text-[0.7rem] font-bold text-slate-900 sm:text-[0.8rem]">
          <div className="flex items-center gap-1.5 overflow-hidden">
            <i className="fa-solid fa-circle-dot shrink-0 text-[0.6rem] text-sky-600 sm:text-[0.7rem]"></i>
            <span className="truncate">{pickupLocation}</span>
          </div>
          <div className="flex items-center gap-1.5 overflow-hidden">
            <i className="fa-solid fa-location-dot shrink-0 text-[0.65rem] text-rose-500 sm:text-[0.75rem]"></i>
            <span className="truncate">{dropoffLocation}</span>
          </div>
        </div>

        {/* Harga */}
        <div className="mb-3 text-[0.85rem] font-extrabold text-amber-500 sm:text-[0.98rem]">
          {route.priceFormatted || formatPrice(route.price)}
        </div>

        {/* Tombol Pesan Rute (Dinonaktifkan) */}
        {/* Atribut 'disabled' ditambahkan dan event diproteksi, namun kode tombol tetap ada */}
        {/* <button
          type="button"
          disabled
          aria-disabled="true"
          onClick={(e) => e.stopPropagation()}
          className="mt-auto flex w-full cursor-not-allowed items-center justify-center gap-1 rounded-md bg-slate-300 py-1.5 px-2 text-[0.7rem] font-bold text-slate-500 shadow-none transition-colors duration-200 sm:text-[0.75rem]"
        >
          <i className="fa-solid fa-car text-[0.65rem] sm:text-[0.7rem]"></i>
          <span>Pesan</span>
        </button> */}
      </div>
    </div>
  );
});

RouteCard.displayName = 'RouteCard';

export default RouteCard;
