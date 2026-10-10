import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHome } from '@/context/HomeContext';

import heroData from '@/data/hero.json';
import routesData from '@/data/routes.json';

const Home = () => {
  const navigate = useNavigate();

  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = heroData.heroSlides || [];

  const {
    visibleCount,
    setVisibleCount,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery
  } = useHome();

  const [isLoading, setIsLoading] = useState(false);
  const observerTarget = useRef(null);

  const getInitialLimit = () => (window.innerWidth <= 768 ? 3 : 6);

  useEffect(() => {
    if (visibleCount === null) {
      setVisibleCount(getInitialLimit());
    }
  }, [visibleCount, setVisibleCount]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const getFilteredRoutes = () => {
    let routesList = routesData.routes || [];

    if (filter !== 'all') {
      routesList = routesList.filter((r) => r.category === filter);
    }

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      routesList = routesList.filter((r) => {
        const title = (r.title || '').toLowerCase();
        const dropLoc = (r.drop || r.destination || '').toLowerCase();
        const pickupLoc = (r.pickup || r.pickupLoc || '').toLowerCase();
        return title.includes(q) || dropLoc.includes(q) || pickupLoc.includes(q);
      });
    }

    return routesList;
  };

  const filteredRoutes = getFilteredRoutes();
  const currentLimit = visibleCount ?? getInitialLimit();
  const displayedRoutes = filteredRoutes.slice(0, currentLimit);
  const hasMore = currentLimit < filteredRoutes.length;

  const loadMoreWithDelay = useCallback(() => {
    if (!hasMore || isLoading) return;

    setIsLoading(true);

    setTimeout(() => {
      setVisibleCount((prev) => (prev ?? getInitialLimit()) + getInitialLimit());
      setIsLoading(false);
    }, 800);
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
        pickup: route.pickup,
        drop: route.drop,
        price: route.price
      }
    });
  };

  const categories = [
    { id: 'all', label: 'Semua Rute', icon: 'fa-th-large' },
    { id: 'airport', label: 'Dari Airport', icon: 'fa-plane-arrival' },
    { id: 'bangsal', label: 'Pelabuhan Bangsal', icon: 'fa-ship' },
    { id: 'senggigi', label: 'Senggigi', icon: 'fa-anchor' },
    { id: 'kuta', label: 'Kuta Area', icon: 'fa-umbrella-beach' }
  ];

  return (
    <div className="block">
      {/* Hero Section */}
      <section className="relative flex aspect-[16/9] min-h-0 items-center overflow-hidden rounded-b-2xl md:aspect-auto md:min-h-[360px]">
        <div className="absolute inset-0 z-[1]">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ backgroundImage: `url('${slide.image}')` }}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/65 to-slate-900/85" />
        </div>

        <div className="relative z-10 mx-auto flex h-full flex-col justify-center p-[16px_4%] text-center text-white md:p-[30px_20px_24px]">
          <div>
            <a
              href={heroData.heroData?.googleMapsUrl || 'https://maps.google.com'}
              target="_blank"
              rel="noopener noreferrer"
              className="mb-1.5 inline-flex items-center gap-2 rounded-full bg-white/95 px-2.5 py-1 text-[0.72rem] font-bold text-slate-900 shadow-md no-underline transition-transform duration-200 hover:-translate-y-0.5 md:mb-3.5 md:px-3.5 md:py-1.5 md:text-[0.78rem]"
            >
              <i className="fa-brands fa-google text-[0.85rem] text-[#4285F4]"></i>
              <span>{heroData.heroData?.googleRating || '5.0'} Rating</span>
              <div className="flex gap-0.5 text-[0.75rem] text-amber-500">
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
              </div>
              <span className="text-[0.68rem] text-slate-500">
                ({heroData.heroData?.googleReviewCount || 8} Ulasan Google)
              </span>
            </a>
          </div>

          <h1 className="mb-1 text-[1.15rem] font-extrabold leading-tight text-white md:mb-2 md:text-[1.6rem]">
            {heroData.heroData?.title || 'Layanan Antar-Jemput & Transportasi Lombok Terbaik'}
          </h1>
          <p className="mx-auto mb-2.5 max-w-[600px] text-[0.78rem] opacity-90 line-clamp-2 md:mb-3.5 md:text-[0.9rem] md:line-clamp-none">
            {heroData.heroData?.subtitle || 'Spesialis antar-jemput bandara, pelabuhan, dan transfer antar destinasi di Pulau Lombok.'}
          </p>

          {slides.length > 1 && (
            <div className="flex justify-center gap-1.5">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-[6px] rounded-[3px] border-none transition-all duration-300 ${
                    idx === currentSlide ? 'w-[18px] bg-sky-600' : 'w-[6px] bg-white/50'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Rute Penjemputan Section */}
      <section className="mx-auto max-w-[1200px] px-[4%] py-3.5 md:px-[5%] md:py-6">
        <div className="mb-4.5 text-center">
          <h2 className="flex items-center justify-center gap-2 text-lg font-extrabold text-slate-900 sm:text-[1.15rem]">
            <i className="fa-solid fa-route text-sky-600"></i>
            Pilihan Rute Penjemputan
          </h2>
          <p className="mt-1 text-[0.85rem] text-slate-500">
            Pilih kategori atau cari rute untuk menemukan estimasi harga perjalanan Anda.
          </p>
        </div>

        {/* Controls Container */}
        <div className="mb-4.5 flex flex-col items-stretch gap-2 md:flex-row md:items-center md:gap-2.5">
          <div className="relative flex w-full shrink-0 items-center md:w-[200px]">
            <i className="fa-solid fa-magnifying-glass absolute left-3 text-[0.75rem] text-slate-400 pointer-events-none"></i>
            <input
              type="text"
              className="h-[34px] w-full rounded-full border border-slate-200 bg-white pl-8 pr-7 text-[0.78rem] text-slate-700 outline-none transition-colors focus:border-sky-600"
              placeholder="Cari rute / tujuan..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
            {searchQuery && (
              <button
                type="button"
                className="absolute right-2.5 flex items-center justify-center border-none bg-transparent p-0 text-[0.85rem] text-slate-400"
                onClick={() => {
                  setSearchQuery('');
                  setVisibleCount(getInitialLimit());
                }}
              >
                &times;
              </button>
            )}
          </div>

          <div className="flex w-full flex-1 items-center gap-[6px] overflow-x-auto whitespace-nowrap scroll-smooth py-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`inline-flex h-[34px] shrink-0 items-center gap-[5px] rounded-full border px-3.5 text-[0.78rem] font-bold shadow-sm transition-all duration-200 ${
                  filter === cat.id
                    ? 'border-sky-600 bg-sky-600 text-white shadow-[0_2px_8px_rgba(2,132,199,0.25)]'
                    : 'border-slate-100 bg-white text-slate-700 hover:border-sky-600 hover:text-sky-600'
                }`}
                onClick={() => handleFilterChange(cat.id)}
              >
                <i className={`fa-solid ${cat.icon}`}></i>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Route Cards */}
        {displayedRoutes.length > 0 ? (
          <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-3 sm:grid-cols-[repeat(auto-fill,minmax(260px,1fr))] sm:gap-4">
            {displayedRoutes.map((route, idx) => (
              <div
                key={idx}
                className="group flex flex-col overflow-hidden rounded-xl border border-slate-100 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_14px_rgba(0,0,0,0.08)]"
              >
                <div className="relative h-[150px] overflow-hidden">
                  <img
                    src={route.image}
                    alt={route.drop}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-400 group-hover:scale-105"
                  />
                  <span className="absolute bottom-2.5 right-2.5 rounded-md bg-slate-900/85 px-2.5 py-1 text-[0.82rem] font-bold text-white">
                    {route.priceFormatted}
                  </span>
                </div>
                <div className="flex flex-grow flex-col p-[14px_16px]">
                  <span className="mb-1.5 inline-flex items-center gap-[5px] text-[0.78rem] font-semibold text-sky-600">
                    <i className={`fa-solid ${route.icon || 'fa-route'}`}></i> {route.badge}
                  </span>
                  <h4 className="mb-1.5 text-base font-bold text-slate-900">{route.title}</h4>
                  <p className="mb-2.5 flex-grow text-[0.82rem] text-slate-500">
                    {route.description}
                  </p>

                  <ul className="mb-3 flex flex-col gap-1 border-t border-dashed border-slate-100 p-0 pt-2 text-[0.74rem] text-slate-500 list-none">
                    <li className="flex items-center">
                      <i className="fa-solid fa-check mr-1.5 text-emerald-600"></i> Max 4 Penumpang + Bagasi
                    </li>
                    <li className="flex items-center">
                      <i className="fa-solid fa-check mr-1.5 text-emerald-600"></i> Driver Berpengalaman
                    </li>
                    <li className="flex items-center">
                      <i className="fa-solid fa-check mr-1.5 text-emerald-600"></i> AC Dingin & Nyaman
                    </li>
                  </ul>

                  <button
                    className="flex w-full items-center justify-center gap-[6px] rounded-md bg-sky-600 py-2 px-3.5 text-[0.78rem] font-bold text-white transition-colors duration-200 hover:bg-sky-700"
                    onClick={() => handleSelectRoute(route)}
                  >
                    <i className="fa-solid fa-car"></i>
                    <span>Pesan Rute Ini</span>
                  </button>
                </div>
              </div>
            ))}
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

        <div ref={observerTarget} className="h-px" />

        {hasMore && (
          <div className="mt-6 flex min-h-[44px] items-center justify-center text-center">
            {isLoading ? (
              <div className="inline-flex items-center gap-2 rounded-[20px] bg-sky-100 px-[18px] py-2 text-[0.8rem] font-bold text-sky-600">
                <i className="fa-solid fa-arrows-rotate fa-spin"></i>
                <span>Memuat data rute baru...</span>
              </div>
            ) : (
              <button
                className="inline-flex items-center gap-1.5 rounded-[30px] border border-sky-600 bg-transparent px-5 py-2 text-[0.8rem] font-semibold text-sky-600 transition-all duration-200 hover:bg-sky-600 hover:text-white"
                onClick={loadMoreWithDelay}
              >
                <i className="fa-solid fa-arrows-rotate"></i>
                <span>Tampilkan Lebih Banyak</span>
              </button>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
