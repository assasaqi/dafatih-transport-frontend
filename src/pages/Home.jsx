// src/pages/Home.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHome } from '@/context/HomeContext';
import RouteCard from '@/components/RouteCard';
import { getImageUrl } from '@/services/apiService';

// Otomatis membaca semua file gambar dari folder /public/images/
const globImages = import.meta.glob('/public/images/*.{png,jpg,jpeg,webp,svg}', { eager: true });

// Ambil maksimal 3 gambar dari folder public/images untuk banner
const PUBLIC_BANNER_SLIDES = Object.keys(globImages)
  .slice(0, 3)
  .map((path) => ({
    image: path.replace(/^\/public/, ''),
  }));

const CATEGORIES = [
  // Tombol 'Semua Perjalanan' dinonaktifkan sementara via komentar
  // { id: 'all', label: 'Semua Perjalanan', icon: 'fa-route' },
  { id: 'airport', label: 'Dari Airport', icon: 'fa-plane-arrival' },
  { id: 'bangsal', label: 'Pelabuhan Bangsal', icon: 'fa-ship' },
  { id: 'senggigi', label: 'Senggigi', icon: 'fa-anchor' },
  { id: 'kuta', label: 'Kuta Area', icon: 'fa-umbrella-beach' },
];

const formatPrice = (priceVal) => {
  const num = Number(priceVal);
  if (isNaN(num) || num <= 0) return 'Hubungi Kami';
  return `Rp ${new Intl.NumberFormat('id-ID').format(num)}`;
};

const getInitialLimit = () => (typeof window !== 'undefined' && window.innerWidth <= 768 ? 4 : 8);

// Komponen Efek Mengetik Judul
const TypewriterTitle = ({ phrases = [], fallbackTitle = '' }) => {
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const activePhrases = useMemo(
    () => (Array.isArray(phrases) && phrases.length > 0 ? phrases : []),
    [phrases]
  );

  useEffect(() => {
    if (!activePhrases.length) return;
    const currentPhrase = activePhrases[textIndex] || '';

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (charIndex < currentPhrase.length) {
          setCharIndex((prev) => prev + 1);
        } else {
          setTimeout(() => setIsDeleting(true), 2200);
        }
      } else {
        if (charIndex > 0) {
          setCharIndex((prev) => prev - 1);
        } else {
          setIsDeleting(false);
          setTextIndex((prev) => (prev + 1) % activePhrases.length);
        }
      }
    }, isDeleting ? 30 : 70);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, textIndex, activePhrases]);

  if (!activePhrases.length) {
    return <>{fallbackTitle}</>;
  }

  return (
    <>
      {activePhrases[textIndex]?.substring(0, charIndex)}
      <span className="ml-1 inline-block animate-pulse font-extrabold text-amber-500">|</span>
    </>
  );
};

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
  const [imageErrors, setImageErrors] = useState({});

  const activeHeroSlides = PUBLIC_BANNER_SLIDES;

  useEffect(() => {
    if (visibleCount === null) setVisibleCount(getInitialLimit());
  }, [visibleCount, setVisibleCount]);

  // Rotasi Slide Otomatis Setiap 1 Menit (60.000 ms)
  useEffect(() => {
    if (activeHeroSlides.length <= 1) return;
    const ONE_MINUTE_MS = 60 * 1000;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeHeroSlides.length);
    }, ONE_MINUTE_MS);
    return () => clearInterval(timer);
  }, [activeHeroSlides.length]);

  const handleImageError = (routeId) => {
    setImageErrors((prev) => ({ ...prev, [routeId]: true }));
  };

  const filteredRoutes = useMemo(() => {
    let routesList = Array.isArray(routes) ? routes : [];

    if (filter && filter !== 'all') {
      routesList = routesList.filter((r) => {
        if (!r) return false;

        const pickup = String(
          r.pickup_location || r.origin || r.pickup || r.from || ''
        ).toLowerCase();

        if (filter === 'airport') {
          const airportKeywords = ['airport', 'bandara', 'lia', 'bil', 'praya', 'bizam'];
          return airportKeywords.some((kw) => pickup.includes(kw));
        }
        if (filter === 'bangsal') {
          return pickup.includes('bangsal');
        }
        if (filter === 'senggigi') {
          return pickup.includes('senggigi') || pickup.includes('sengigi');
        }
        if (filter === 'kuta') {
          return pickup.includes('kuta') || pickup.includes('mandalika');
        }
        return true;
      });
    }

    const q = searchQuery.trim().toLowerCase();
    if (q !== '') {
      routesList = routesList.filter((r) => {
        if (!r) return false;
        const pickup = String(r.pickup_location || r.origin || r.pickup || '').toLowerCase();
        const drop = String(r.dropoff_location || r.destination || r.drop || '').toLowerCase();
        const title = String(r.title || r.name || '').toLowerCase();
        const category = String(r.category || r.route_category || r.type || '').toLowerCase();

        return (
          title.includes(q) ||
          pickup.includes(q) ||
          drop.includes(q) ||
          category.includes(q)
        );
      });
    }

    return routesList;
  }, [routes, filter, searchQuery]);

  const currentLimit = visibleCount ?? getInitialLimit();
  const displayedRoutes = filteredRoutes.slice(0, currentLimit);
  const hasMore = currentLimit < filteredRoutes.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => (prev ?? getInitialLimit()) + getInitialLimit());
  };

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
      {/* Hero Section Banner */}
      <section className="relative flex min-h-[330px] md:min-h-[400px] items-center overflow-hidden bg-slate-900 pb-5">
        <div className="absolute inset-0 z-[1]">
          {activeHeroSlides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ backgroundImage: `url('${slide.image}')` }}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-900/75 to-slate-950/90" />
        </div>

        {/* Content Container Hero */}
        <div className="relative z-10 mx-auto flex h-full w-full flex-col items-center justify-center px-[4%] pt-20 pb-4 text-center text-white md:px-[5%] md:pt-24 md:pb-6">
          <h1 className="mb-2 max-w-[800px] whitespace-nowrap text-[3.2vw] font-extrabold leading-snug text-white sm:text-[1.1rem] md:text-[1.8rem]">
            <TypewriterTitle
              phrases={heroInfo?.titlePhrases}
              fallbackTitle={heroInfo?.title || 'Layanan Antar-Jemput & Transportasi Lombok Terbaik'}
            />
          </h1>

          <div>
            <a
              href={heroInfo?.googleMapsUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Lihat ulasan Google Maps"
              className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-[0.68rem] font-bold text-slate-900 shadow-md no-underline transition-transform duration-200 hover:-translate-y-0.5 md:mb-4 md:px-3.5 md:py-1.5 md:text-[0.78rem]"
            >
              <i className="fa-brands fa-google text-[0.78rem] text-[#4285F4]"></i>
              <span>{heroInfo?.googleRating || '5.0'} Rating</span>
              <div className="flex gap-0.5 text-[0.7rem] text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <i key={i} className="fa-solid fa-star" aria-hidden="true" />
                ))}
              </div>
            </a>
          </div>

          {/* Tombol Kategori Desain Lingkaran Rata Tengah */}
          <div className="mt-2 flex w-full max-w-[700px] items-center justify-center gap-3.5 md:gap-6 overflow-x-auto py-2 px-4 md:px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {CATEGORIES.map((cat) => {
              const isActive = filter === cat.id;

              return (
                <button
                  key={cat.id}
                  type="button"
                  aria-label={`Filter rute kategori ${cat.label}`}
                  className="group flex flex-col items-center gap-1.5 shrink-0 cursor-pointer border-none bg-transparent outline-none"
                  onClick={() => handleFilterChange(cat.id)}
                >
                  {/* Lingkaran Ikon */}
                  <div
                    className={`flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full text-sm sm:text-base transition-all duration-300 shadow-md ${
                      isActive
                        ? 'bg-sky-600 text-white ring-2 ring-sky-400 ring-offset-2 ring-offset-slate-900 scale-105 shadow-sky-600/40'
                        : 'bg-white/20 text-white backdrop-blur-md hover:bg-white/30 hover:scale-105'
                    }`}
                  >
                    <i className={`fa-solid ${cat.icon}`}></i>
                  </div>
                  {/* Teks Kategori di Bawah */}
                  <span
                    className={`text-[0.65rem] sm:text-[0.72rem] tracking-tight transition-colors duration-200 ${
                      isActive ? 'font-bold text-sky-400' : 'font-medium text-slate-200 group-hover:text-white'
                    }`}
                  >
                    {cat.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Indikator Slide Banner */}
          {activeHeroSlides.length > 1 && (
            <div className="mt-4 flex justify-center gap-1.5">
              {activeHeroSlides.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-[4px] rounded-[2px] border-none transition-all duration-300 cursor-pointer ${
                    idx === currentSlide ? 'w-[16px] bg-sky-500' : 'w-[5px] bg-white/40'
                  }`}
                  aria-label={`Pindah ke banner slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Rute Penjemputan Section */}
      <section className="mx-auto max-w-[1280px] px-[4%] py-4 md:px-[4%] md:py-6">
        <div className="mb-4 md:mb-5 flex justify-center">
          <div className="relative flex w-full max-w-md items-center">
            <i className="fa-solid fa-magnifying-glass pointer-events-none absolute left-3.5 text-[0.8rem] text-slate-400"></i>
            <input
              type="text"
              aria-label="Cari rute atau tujuan penjemputan"
              className="h-[38px] w-full rounded-full border border-slate-200 bg-white pl-9 pr-8 text-[0.8rem] text-slate-700 outline-none transition-colors focus:border-sky-600 shadow-sm"
              placeholder="Cari rute / tujuan penjemputan..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
            {searchQuery && (
              <button
                type="button"
                aria-label="Hapus pencarian"
                className="absolute right-3 flex items-center justify-center text-[0.85rem] text-slate-400 hover:text-slate-600 cursor-pointer"
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

        {displayedRoutes.length > 0 ? (
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-3.5">
            {displayedRoutes.map((route, idx) => {
              const routeId = route.id || idx;
              const rawImgPath = route.image_url || route.image;
              const imageSrc = getImageUrl(rawImgPath);
              const isImageFailed = imageErrors[routeId] || !imageSrc;

              return (
                <RouteCard
                  key={routeId}
                  route={route}
                  routeId={routeId}
                  imageSrc={imageSrc}
                  isImageFailed={isImageFailed}
                  onImageError={handleImageError}
                  formatPrice={formatPrice}
                  onSelect={handleSelectRoute}
                />
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

        {hasMore && (
          <div className="mt-5 flex min-h-[44px] items-center justify-center text-center">
            <button
              type="button"
              aria-label="Tampilkan rute perjalanan lebih banyak"
              className="inline-flex items-center gap-1.5 rounded-[30px] border border-sky-600 bg-transparent px-5 py-2 text-[0.78rem] md:text-[0.8rem] font-semibold text-sky-600 transition-all duration-200 hover:bg-sky-600 hover:text-white cursor-pointer"
              onClick={handleLoadMore}
            >
              <i className="fa-solid fa-arrows-rotate"></i>
              <span>Tampilkan Lebih Banyak</span>
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
