import React, { useEffect, useRef, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import tariffsData from '@/data/tariffs.json';
import { useTariff } from '@/context/TariffContext';

const Tariffs = () => {
  const navigate = useNavigate();
  const {
    visibleCount,
    setVisibleCount,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery
  } = useTariff();

  const [isLoading, setIsLoading] = useState(false);
  const observerTarget = useRef(null);
  const getInitialLimit = () => (window.innerWidth <= 768 ? 3 : 6);

  useEffect(() => {
    if (visibleCount === null) {
      setVisibleCount(getInitialLimit());
    }
  }, [visibleCount, setVisibleCount]);

  const categories = tariffsData.tariffCategories || [];

  const handleSelectTariff = (pickupPoint, dropPoint, routePrice) => {
    navigate('/pesan', {
      state: {
        pickup: pickupPoint,
        drop: dropPoint,
        price: routePrice
      }
    });
  };

  const handleCategoryChange = (catId) => {
    setActiveCategory(catId);
    setVisibleCount(getInitialLimit());
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setVisibleCount(getInitialLimit());
  };

  const getFilteredRoutes = () => {
    let routesList = [];
    if (activeCategory === 'all') {
      routesList = categories.flatMap((cat) =>
        cat.routes.map((r) => ({
          ...r,
          pickupLoc: r.pickup || cat.pickup,
          categoryTitle: cat.title,
          icon: cat.icon
        }))
      );
    } else {
      const selectedCat = categories.find((cat) => cat.id === activeCategory);
      if (selectedCat) {
        routesList = selectedCat.routes.map((r) => ({
          ...r,
          pickupLoc: r.pickup || selectedCat.pickup,
          categoryTitle: selectedCat.title,
          icon: selectedCat.icon
        }));
      }
    }

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      routesList = routesList.filter((r) => {
        const dropLoc = (r.drop || r.destination || '').toLowerCase();
        const pickupLoc = (r.pickupLoc || '').toLowerCase();
        return dropLoc.includes(q) || pickupLoc.includes(q);
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

  return (
    <div className="block w-full overflow-x-hidden">
      {/* Banner */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-800 px-[5%] pb-[14px] pt-[18px] text-center text-white">
        <h1 className="mb-0.5 text-[clamp(1.1rem,2vw+0.4rem,1.35rem)] font-extrabold">
          Daftar Tarif Transportasi Lombok
        </h1>
        <p className="mx-auto max-w-[550px] text-[clamp(0.75rem,0.8vw+0.3rem,0.82rem)] text-slate-100 opacity-90">
          Rute perjalanan & harga transparan layanan antar-jemput (Maks 4 Pax + Bagasi).
        </p>
      </div>

      {/* Konten Utama */}
      <section className="mx-auto max-w-[1200px] px-[3%] pb-[80px] pt-3 sm:px-[5%] sm:py-5">
        {/* Controls Container */}
        <div className="mb-4.5 flex flex-col items-stretch gap-2 md:flex-row md:items-center md:gap-2.5">
          <div className="relative flex w-full shrink-0 items-center md:w-[200px]">
            <i className="fa-solid fa-magnifying-glass absolute left-3 text-[0.75rem] text-slate-400 pointer-events-none"></i>
            <input
              type="text"
              className="h-[36px] w-full rounded-full border border-slate-200 bg-white pl-8 pr-7 text-[0.78rem] text-slate-700 outline-none transition-colors focus:border-sky-600"
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
            <button
              className={`inline-flex h-[34px] shrink-0 items-center gap-[5px] rounded-full border px-3.5 text-[0.78rem] font-bold shadow-sm transition-all duration-200 ${
                activeCategory === 'all'
                  ? 'border-sky-600 bg-sky-600 text-white shadow-[0_2px_8px_rgba(2,132,199,0.2)]'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-sky-600 hover:text-sky-600'
              }`}
              onClick={() => handleCategoryChange('all')}
            >
              <i className="fa-solid fa-th-large"></i>
              <span>Semua Rute</span>
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`inline-flex h-[34px] shrink-0 items-center gap-[5px] rounded-full border px-3.5 text-[0.78rem] font-bold shadow-sm transition-all duration-200 ${
                  activeCategory === cat.id
                    ? 'border-sky-600 bg-sky-600 text-white shadow-[0_2px_8px_rgba(2,132,199,0.2)]'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-sky-600 hover:text-sky-600'
                }`}
                onClick={() => handleCategoryChange(cat.id)}
              >
                <i className={`fa-solid ${cat.icon}`}></i>
                <span>{cat.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tariff Cards Grid */}
        {displayedRoutes.length > 0 ? (
          <div className="grid w-full grid-cols-1 gap-2.5 sm:grid-cols-[repeat(auto-fill,minmax(260px,1fr))] sm:gap-3.5">
            {displayedRoutes.map((route, idx) => {
              const dropLoc = route.drop || route.destination;
              return (
                <div
                  key={idx}
                  className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-2.5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_6px_14px_rgba(0,0,0,0.08)] sm:p-3.5"
                >
                  <div className="mb-2.5 flex w-full items-center justify-between gap-1.5 rounded-lg border border-dashed border-slate-200 bg-slate-50 p-2">
                    <div className="flex flex-1 items-center gap-1.25 min-w-0" title={route.pickupLoc}>
                      <i className="fa-solid fa-circle-dot text-[0.65rem] text-sky-600"></i>
                      <span className="block truncate text-xs text-slate-500 sm:text-[0.78rem]">
                        {route.pickupLoc}
                      </span>
                    </div>

                    <i className="fa-solid fa-arrow-right shrink-0 px-0.5 text-[0.7rem] text-slate-400"></i>

                    <div className="flex flex-1 items-center gap-1.25 min-w-0" title={dropLoc}>
                      <i className="fa-solid fa-location-dot text-[0.75rem] text-amber-500"></i>
                      <span className="block truncate text-xs font-bold text-slate-900 sm:text-[0.78rem]">
                        {dropLoc}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-100 pt-2">
                    <div className="flex flex-col">
                      <span className="text-[0.65rem] font-semibold text-slate-400">Harga All-In</span>
                      <strong className="text-[0.98rem] font-extrabold text-sky-600">
                        {route.priceFormatted}
                      </strong>
                    </div>
                    <button
                      className="inline-flex shrink-0 items-center gap-1.25 rounded-md bg-sky-600 px-3 py-1.5 text-[0.75rem] font-bold text-white transition-colors duration-200 hover:bg-sky-700"
                      onClick={() => handleSelectTariff(route.pickupLoc, dropLoc, route.price)}
                    >
                      <i className="fa-solid fa-car"></i>
                      <span>Pesan</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-[30px] text-center">
            <i className="fa-solid fa-car-side mb-2.5 text-[2.2rem] text-slate-300"></i>
            <p className="text-[0.85rem] text-slate-400">
              {searchQuery
                ? `Tidak ada rute perjalanan yang cocok dengan "${searchQuery}".`
                : 'Tidak ada tarif perjalanan yang tersedia untuk kategori ini.'}
            </p>
          </div>
        )}

        <div ref={observerTarget} className="h-px" />

        {hasMore && (
          <div className="mt-5 flex min-h-[40px] items-center justify-center text-center">
            {isLoading ? (
              <div className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-[18px] py-2 text-[0.8rem] font-bold text-sky-600">
                <i className="fa-solid fa-arrows-rotate fa-spin"></i>
                <span>Memuat data rute baru...</span>
              </div>
            ) : (
              <button
                className="inline-flex items-center gap-1.5 rounded-full border border-sky-600 bg-transparent px-5 py-2 text-[0.8rem] font-semibold text-sky-600 transition-all duration-200 hover:bg-sky-600 hover:text-white"
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

export default Tariffs;
