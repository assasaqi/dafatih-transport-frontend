// src/components/RouteCard.jsx

import React, { memo } from 'react';

const RouteCard = memo(({ route, routeId, imageSrc, isImageFailed, onImageError, formatPrice, onSelect }) => {
  const routeTitle =
    route.title ||
    route.name ||
    `${route.pickup_location || route.origin || route.pickup} ➔ ${route.dropoff_location || route.destination || route.drop}`;

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-slate-100 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_14px_rgba(0,0,0,0.08)]">
      <div className="relative h-[135px] overflow-hidden bg-slate-100">
        {!isImageFailed ? (
          <img
            src={imageSrc}
            alt={routeTitle}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-400 group-hover:scale-105"
            onError={() => onImageError(routeId)}
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-slate-200/70 p-2 text-slate-400">
            <i className="fa-regular fa-image mb-1 text-[1.5rem]"></i>
            <span className="text-[0.68rem] font-medium">No Image Available</span>
          </div>
        )}
        <span className="absolute bottom-2 right-2 rounded-md bg-slate-900/85 px-2 py-0.5 text-[0.78rem] font-bold text-white">
          {route.priceFormatted || formatPrice(route.price)}
        </span>
      </div>

      <div className="flex flex-grow flex-col p-3">
        <span className="mb-1 inline-flex items-center gap-1 text-[0.72rem] font-semibold text-sky-600">
          <i className="fa-solid fa-route"></i> {route.estimated_time || route.badge || 'Transfer Private'}
        </span>
        <h4 className="mb-1 text-[0.88rem] font-bold text-slate-900 line-clamp-1">{routeTitle}</h4>
        <p className="mb-2 flex-grow text-[0.78rem] leading-snug text-slate-500 line-clamp-2">
          Dari <strong className="text-slate-700">{route.pickup_location || route.origin || route.pickup}</strong> menuju <strong className="text-slate-700">{route.dropoff_location || route.destination || route.drop}</strong>.
        </p>

        <ul className="mb-2.5 flex flex-col gap-0.5 border-t border-dashed border-slate-100 p-0 pt-1.5 text-[0.7rem] text-slate-500 list-none">
          <li className="flex items-center">
            <i className="fa-solid fa-check mr-1 text-emerald-600"></i> Max 4 Penumpang + Bagasi
          </li>
          <li className="flex items-center">
            <i className="fa-solid fa-check mr-1 text-emerald-600"></i> Driver Berpengalaman
          </li>
          <li className="flex items-center">
            <i className="fa-solid fa-check mr-1 text-emerald-600"></i> AC Dingin & Nyaman
          </li>
        </ul>

        <button
          className="flex w-full items-center justify-center gap-1.5 rounded-md bg-sky-600 py-1.5 px-3 text-[0.75rem] font-bold text-white transition-colors duration-200 hover:bg-sky-700 cursor-pointer"
          onClick={() => onSelect(route)}
        >
          <i className="fa-solid fa-car text-[0.7rem]"></i>
          <span>Pesan Rute Ini</span>
        </button>
      </div>
    </div>
  );
});

RouteCard.displayName = 'RouteCard';

export default RouteCard;
