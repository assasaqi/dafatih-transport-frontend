// src/components/RouteCard.jsx

import React, { memo } from 'react';

const RouteCard = memo(({ route, routeId, imageSrc, isImageFailed, onImageError, formatPrice, onSelect }) => {
  const pickupLocation = route.pickup_location || route.origin || route.pickup || '-';
  const dropoffLocation = route.dropoff_location || route.destination || route.drop || '-';

  const routeTitle = route.title || route.name || '';

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-slate-100 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_14px_rgba(0,0,0,0.08)]">
      {/* Gambar Rute */}
      <div className="relative h-[95px] sm:h-[135px] overflow-hidden bg-slate-100">
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
            <span className="text-[0.62rem] sm:text-[0.68rem] font-medium">No Image Available</span>
          </div>
        )}
      </div>

      {/* Konten Kartu */}
      <div className="flex flex-grow flex-col p-2.5 sm:p-3">
        {/* Lokasi Penjemputan (Dari) & Tujuan (Ke) Menggunakan Icon */}
        <div className="mb-1.5 flex flex-col gap-1 overflow-hidden text-[0.7rem] sm:text-[0.8rem] font-bold text-slate-900">
          <div className="flex items-center gap-1.5 overflow-hidden">
            <i className="fa-solid fa-circle-dot text-[0.6rem] sm:text-[0.7rem] text-sky-600 shrink-0"></i>
            <span className="truncate">{pickupLocation}</span>
          </div>
          <div className="flex items-center gap-1.5 overflow-hidden">
            <i className="fa-solid fa-location-dot text-[0.65rem] sm:text-[0.75rem] text-rose-500 shrink-0"></i>
            <span className="truncate">{dropoffLocation}</span>
          </div>
        </div>

        {/* Harga */}
        <div className="mb-3 text-[0.85rem] sm:text-[0.98rem] font-extrabold text-amber-500">
          {route.priceFormatted || formatPrice(route.price)}
        </div>

        {/* Tombol Pesan Rute */}
        <button
          className="mt-auto flex w-full items-center justify-center gap-1 rounded-md bg-sky-600 py-1.5 px-2 text-[0.7rem] sm:text-[0.75rem] font-bold text-white transition-colors duration-200 hover:bg-sky-700 cursor-pointer"
          onClick={() => onSelect(route)}
        >
          <i className="fa-solid fa-car text-[0.65rem] sm:text-[0.7rem]"></i>
          <span>Pesan</span>
        </button>
      </div>
    </div>
  );
});

RouteCard.displayName = 'RouteCard';

export default RouteCard;
