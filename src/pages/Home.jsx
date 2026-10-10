// src/pages/Home.jsx

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHome } from '@/context/HomeContext';

const API_BASE_DOMAIN = 'https://dafatih-transport.rasmantech.web.id';

// Memuat semua gambar di folder public/images/ secara dinamis (Vite)
const globImages = import.meta.glob('/public/images/*.{png,jpg,jpeg,webp,svg}', { eager: true });
const dynamicHeroSlides = Object.keys(globImages).map((path) => ({
  image: path.replace(/^\/public/, ''),
}));

const LOCAL_HERO_SLIDES =
  dynamicHeroSlides.length > 0
    ? dynamicHeroSlides
    : [
        { image: '/images/hero1.jpg' },
        { image: '/images/hero2.jpg' },
        { image: '/images/hero3.jpg' },
      ];

const Home = () => {
  const navigate = useNavigate();

  const {
    heroInfo = {},
    routes = [],
    loadingApi,
    errorApi,
    visibleCount,
    setVisibleCount,
    filter,
    setFilter,
    searchQuery = '',
    setSearchQuery,
  } = useHome();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [imageErrors, setImageErrors] = useState({});

  const slides = LOCAL_HERO_SLIDES;

  const getInitialLimit = () => (window.innerWidth <= 768 ? 4 : 8);

  useEffect(() => {
    if (filter === 'all') {
      setFilter('airport');
    }
  }, [filter, setFilter]);

  useEffect(() => {
    if (visibleCount === null) {
      setVisibleCount(getInitialLimit());
    }
  }, [visibleCount, setVisibleCount]);

  // Interval perpindahan slide setiap 10 menit (600.000 ms)
  useEffect(() => {
    if (slides.length <= 1) return;

    const TEN_MINUTES_MS = 10 * 60 * 1000;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, TEN_MINUTES_MS);

    return () => clearInterval(timer);
  }, [slides.length]);

  // Formatter URL Gambar Dinamis
  const getImageUrl = (imgPath) => {
    if (!imgPath || typeof imgPath !== 'string' || imgPath.trim() === '') {
      return null;
    }
    if (imgPath.startsWith('/images/') || imgPath.startsWith('http://') || imgPath.startsWith('https://')) {
      return imgPath;
    }
    const cleanDomain = API_BASE_DOMAIN.replace(/\/+$/, '');
    const cleanPath = imgPath.startsWith('/') ? imgPath : `/${imgPath}`;
    return `${cleanDomain}${cleanPath}`;
  };

  const handleImageError = (routeId) => {
    setImageErrors((prev) => ({ ...prev, [routeId]: true }));
  };

  const formatPrice = (priceVal) => {
    const num = Number(priceVal);
    if (isNaN(num) || num <= 0) return 'Hubungi Kami';
    return `Rp ${new Intl.NumberFormat('id-ID').format(num)}`;
  };

  // Optimasi: Memfilter rute menggunakan useMemo
  const filteredRoutes = useMemo(() => {
    let routesList = Array.isArray(routes) ? routes : [];

    if (filter && filter !== 'all') {
      routesList = routesList.filter((r) => {
        const pickup = (r.pickup_location || r.origin || r.pickup || '').toLowerCase();
        const drop = (r.dropoff_location || r.destination || r.drop || '').toLowerCase();
        const title = (r.title || r.name || '').toLowerCase();

        if (filter === 'airport') {
          return (
            pickup.includes('airport') ||
            pickup.includes('bandara') ||
            pickup.includes('lia') ||
            title.includes('bandara') ||
            title.includes('airport')
          );
        }
        if (filter === 'bangsal') {
          return pickup.includes('bangsal') || drop.includes('bangsal') || title.includes('bangsal');
        }
        if (filter === 'senggigi') {
          return pickup.includes('senggigi') || drop.includes('senggigi') || title.includes('senggigi');
        }
        if (filter === 'kuta') {
          return pickup.includes('kuta') || drop.includes('kuta') || title.includes('kuta');
        }
        return true;
      });
    }

    const q = (searchQuery || '').trim().toLowerCase();
    if (q !== '') {
      routesList = routesList.filter((r) => {
        if (!r) return false;
        const title = (r.title || r.name || '').toLowerCase();
        const pickup = (r.pickup_location || r.origin || r.pickup || '').toLowerCase();
        const drop = (r.dropoff_location || r.destination || r.drop || '').toLowerCase();
        return title.includes(q) || pickup.includes(q) || drop.includes(q);
      });
    }

    return routesList;
  }, [routes, filter, searchQuery]);

  const currentLimit = visibleCount ?? getInitialLimit();
  const displayedRoutes = filteredRoutes.slice(0, currentLimit);
  const hasMore = currentLimit < filteredRoutes.length;

  const loadMoreWithDelay = useCallback(() => {
    if (!hasMore || isLoading) return;

    setIsLoading(true);

    setTimeout(() => {
      setVisibleCount((prev) => (prev ?? getInitialLimit()) + getInitialLimit());
      setIsLoading(false);
    }, 400);
  }, [hasMore, isLoading, setVisibleCount]);

  const handleFilterChange = (catId) => {
    setFilter(catId);
    setVisibleCount(getInitialLimit());
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setVisibleCount(getInitialLimit());
  };

  const handleSelectRoute = (route) => {
    navigate('/pesan', {
      state: {
        pickup: route.pickup_location || route.origin || route.pickup || '',
        drop: route.dropoff_location || route.destination || route.drop || '',
        price: Number(route.price) || 0,
      },
    });
  };

  const categories = [
    { id: 'airport', label: 'Dari Airport', icon: 'fa-plane-arrival' },
    { id: 'bangsal', label: 'Pelabuhan Bangsal', icon: 'fa-ship' },
    { id: 'senggigi', label: 'Senggigi', icon: 'fa-anchor' },
    { id: 'kuta', label: 'Kuta Area', icon: 'fa-umbrella-beach' },
  ];

  if (loadingApi) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center font-bold text-sky-600">
        <i className="fa-solid fa-circle-notch fa-spin mr-2 text-xl"></i>
        Memuat data beranda dari server...
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
      {/* Hero Section */}
      <section className="relative flex min-h-[310px] md:min-h-[380px] items-center overflow-hidden bg-slate-900 pb-5">
        <div className="absolute inset-0 z-[1]">
          {slides.map((slide, index) => {
            const slideImg = getImageUrl(slide.image);
            return (
              <div
                key={index}
                className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
                style={{ backgroundImage: slideImg ? `url('${slideImg}')` : 'none' }}
              />
            );
          })}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-900/75 to-slate-950/90" />
        </div>

        {/* Content Container Hero */}
        <div className="relative z-10 mx-auto flex h-full w-full flex-col items-center justify-center px-[4%] pt-20 pb-4 text-center text-white md:px-[5%] md:pt-24 md:pb-6">
          <div>
            <a
              href={'https://www.google.com/search?q=dafatihtransport.com&stick=H4sIAAAAAAAA_-NgU1I1qDBKMTZNNjezNDaySDJLNra0MqhITjNLNEg0tTRMMk82S0tLXcQqkpKYlliSmVFSlJhXXJBfVKKXnJ8LAB6UJTRAAAAA&hl=id&mat=CQ-67MPMA9qKElYBzAmVZhHo2UPj_XCAi05RSJv6JMzZ7QwpzpO0Th02NY0Rm5iMY1jIYDRpU1BfyJPs9AgkUeiCOcS3FNPK9jimGftGWhmP-U0EEhl40Kb-rBUDc5WoCA&authuser=0&ved=1t:350944'}
              target="_blank"
              rel="noopener noreferrer"
              className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-[0.68rem] font-bold text-slate-900 shadow-md no-underline transition-transform duration-200 hover:-translate-y-0.5 md:mb-3 md:px-3.5 md:py-1.5 md:text-[0.78rem]"
            >
              <i className="fa-brands fa-google text-[0.78rem] text-[#4285F4]"></i>
              <span>{heroInfo?.googleRating || '5.0'} Rating</span>
              <div className="flex gap-0.5 text-[0.7rem] text-amber-500">
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
              </div>
            </a>
          </div>

          <h1 className="mb-1.5 max-w-[800px] text-[1.1rem] font-extrabold leading-snug text-white md:mb-2 md:text-[1.8rem]">
            {heroInfo?.title || 'Layanan Antar-Jemput & Transportasi Lombok Terbaik'}
          </h1>

          {/* Tombol Kategori Melayang */}
          <div className="mt-1 flex w-full max-w-[650px] items-center justify-center gap-1.5 overflow-x-auto whitespace-nowrap py-1 px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`inline-flex h-[36px] shrink-0 items-center gap-1.5 rounded-full px-3.5 text-[0.76rem] font-bold shadow-md transition-all duration-200 ${
                  filter === cat.id
                    ? 'bg-sky-600 text-white shadow-sky-600/30'
                    : 'bg-white/20 text-white backdrop-blur-md hover:bg-white/30'
                }`}
                onClick={() => handleFilterChange(cat.id)}
              >
                <i className={`fa-solid ${cat.icon}`}></i>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {slides.length > 1 && (
            <div className="mt-3 flex justify-center gap-1.5">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-[4px] rounded-[2px] border-none transition-all duration-300 ${
                    idx === currentSlide ? 'w-[16px] bg-sky-500' : 'w-[5px] bg-white/40'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Rute Penjemputan Section */}
      <section className="mx-auto max-w-[1280px] px-[4%] py-4 md:px-[4%] md:py-6">
        {/* Search Bar Container */}
        <div className="mb-5 flex justify-center">
          <div className="relative flex w-full max-w-md items-center">
            <i className="fa-solid fa-magnifying-glass pointer-events-none absolute left-3.5 text-[0.8rem] text-slate-400"></i>
            <input
              type="text"
              className="h-[38px] w-full rounded-full border border-slate-200 bg-white pl-9 pr-8 text-[0.8rem] text-slate-700 outline-none transition-colors focus:border-sky-600 shadow-sm"
              placeholder="Cari rute / tujuan penjemputan..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
            {searchQuery && (
              <button
                type="button"
                className="absolute right-3 flex items-center justify-center text-[0.85rem] text-slate-400 hover:text-slate-600"
                onClick={() => {
                  setSearchQuery('');
                  setVisibleCount(getInitialLimit());
                }}
              >
                &times;
              </button>
            )}
          </div>
        </div>

        {/* Route Cards */}
        {displayedRoutes.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-3.5">
            {displayedRoutes.map((route, idx) => {
              const routeId = route.id || idx;
              const rawImgPath = route.image_url || route.image;
              const imageSrc = getImageUrl(rawImgPath);
              const isImageFailed = imageErrors[routeId] || !imageSrc;

              const routeTitle =
                route.title ||
                route.name ||
                `${route.pickup_location || route.origin || route.pickup} ➔ ${route.dropoff_location || route.destination || route.drop}`;

              return (
                <div
                  key={routeId}
                  className="group flex flex-col overflow-hidden rounded-xl border border-slate-100 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_14px_rgba(0,0,0,0.08)]"
                >
                  <div className="relative h-[135px] overflow-hidden bg-slate-100">
                    {!isImageFailed ? (
                      <img
                        src={imageSrc}
                        alt={routeTitle}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition-transform duration-400 group-hover:scale-105"
                        onError={() => handleImageError(routeId)}
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
                      className="flex w-full items-center justify-center gap-1.5 rounded-md bg-sky-600 py-1.5 px-3 text-[0.75rem] font-bold text-white transition-colors duration-200 hover:bg-sky-700"
                      onClick={() => handleSelectRoute(route)}
                    >
                      <i className="fa-solid fa-car text-[0.7rem]"></i>
                      <span>Pesan Rute Ini</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-[30px] text-center">
            <i className="fa-solid fa-car-side mb-2.5 text-[2.5rem] text-slate-300"></i>
            <p className="text-[0.85rem] text-slate-400">
              {searchQuery
                ? `Tidak ada rute perjalanan yang cocok dengan "${searchQuery}".`
                : 'Tidak ada rute perjalanan yang tersedia untuk kategori ini.'}
            </p>
          </div>
        )}

        {/* Tombol Manual Load More */}
        {hasMore && (
          <div className="mt-6 flex min-h-[44px] items-center justify-center text-center">
            {isLoading ? (
              <div className="inline-flex items-center gap-2 rounded-[20px] bg-sky-100 px-[18px] py-2 text-[0.8rem] font-bold text-sky-600">
                <i className="fa-solid fa-arrows-rotate fa-spin"></i>
                <span>Memuat data rute baru...</span>
              </div>
            ) : (
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-[30px] border border-sky-600 bg-transparent px-5 py-2 text-[0.8rem] font-semibold text-sky-600 transition-all duration-200 hover:bg-sky-600 hover:text-white cursor-pointer"
                onClick={loadMoreWithDelay}
              >
                <i className="fa-solid fa-arrows-rotate"></i>
                <span>Tampilkan Lebih Banyak ({filteredRoutes.length - currentLimit} rute tersisa)</span>
              </button>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
