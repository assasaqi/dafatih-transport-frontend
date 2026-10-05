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
    // Fitur auto-scroll dinonaktifkan sementara. Data hanya bertambah saat tombol diklik.
    //   useEffect(() => {
    //     const element = observerTarget.current;
    //     if (!element || !hasMore || isLoading) return;

    //     const observer = new IntersectionObserver(
    //       (entries) => {
    //         const [entry] = entries;
    //         if (entry.isIntersecting) {
    //           loadMoreWithDelay();
    //         }
    //       },
    //       { root: null, rootMargin: '100px', threshold: 0.1 }
    //     );

    //     observer.observe(element);
    //     return () => observer.unobserve(element);
    //   }, [loadMoreWithDelay, hasMore, isLoading]);

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
        <>
            <style>{`
        .page-view { display: block; }
        .hero-section { position: relative; overflow: hidden; min-height: 360px; display: flex; align-items: center; border-radius: 0 0 16px 16px; }
        .hero-bg-slideshow { position: absolute; inset: 0; z-index: 1; }
        .hero-slide { position: absolute; inset: 0; background-size: cover; background-position: center; opacity: 0; transition: opacity 1.2s ease-in-out; }
        .hero-slide.active { opacity: 1; }
        .hero-overlay { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(15, 23, 42, 0.65) 0%, rgba(15, 23, 42, 0.85) 100%); }
        .hero-content-wrapper { position: relative; z-index: 2; color: #fff; text-align: center; margin: 0 auto; padding: 30px 20px 24px; }
        .google-reviews-badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(255, 255, 255, 0.95); color: #0f172a; padding: 6px 14px; border-radius: 30px; font-size: 0.78rem; font-weight: 700; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); text-decoration: none; margin-bottom: 14px; transition: transform 0.2s ease; }
        .google-reviews-badge:hover { transform: translateY(-2px); }
        .google-stars { color: #f59e0b; display: flex; gap: 2px; font-size: 0.75rem; }
        .section { padding: 24px 5%; max-width: 1200px; margin: 0 auto; }
        .sub-section-title h2 { font-size: 1.15rem; font-weight: 800; color: var(--neutral-900, #0f172a); display: flex; align-items: center; justify-content: center; gap: 8px; }
        .controls-container { display: flex; align-items: center; gap: 10px; margin-bottom: 18px; flex-wrap: nowrap; overflow: hidden; }
        .search-box-wrapper { position: relative; display: flex; align-items: center; flex-shrink: 0; width: 200px; }
        .search-box-wrapper i.fa-search { position: absolute; left: 12px; color: #94a3b8; font-size: 0.75rem; pointer-events: none; }
        .search-input { width: 100%; height: 34px; padding: 0 30px 0 32px; border-radius: 20px; border: 1.5px solid var(--neutral-100, #e2e8f0); background: #ffffff; font-size: 0.78rem; color: #334155; outline: none; transition: border-color 0.2s ease; box-sizing: border-box; }
        .search-input:focus { border-color: var(--primary, #0284c7); }
        .search-clear-btn { position: absolute; right: 10px; background: transparent; border: none; color: #94a3b8; cursor: pointer; font-size: 0.85rem; padding: 0; display: flex; align-items: center; justify-content: center; }
        .category-filters-scroll { display: flex !important; align-items: center !important; gap: 6px !important; overflow-x: auto !important; white-space: nowrap !important; scroll-behavior: smooth; -webkit-overflow-scrolling: touch; padding: 2px 0 !important; scrollbar-width: none; flex: 1; }
        .category-filters-scroll::-webkit-scrollbar { display: none !important; }
        .filter-btn { background: var(--white, #ffffff); color: var(--neutral-700, #334155); border: 1.5px solid var(--neutral-100, #f1f5f9); height: 34px; padding: 0 14px; border-radius: 20px; font-size: 0.78rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 5px; transition: all 0.2s ease; box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05); flex-shrink: 0 !important; white-space: nowrap !important; box-sizing: border-box; }
        .filter-btn:hover { border-color: var(--primary, #0284c7); color: var(--primary, #0284c7); }
        .filter-btn.active { background: var(--primary, #0284c7); color: var(--white, #ffffff); border-color: var(--primary, #0284c7); box-shadow: 0 2px 8px rgba(2, 132, 199, 0.25); }
        .tour-cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; max-width: 1200px; margin: 0 auto; }
        .tour-card { background: #fff; border-radius: 12px; overflow: hidden; border: 1px solid var(--neutral-100, #f1f5f9); box-shadow: 0 2px 8px rgba(0,0,0,0.04); display: flex; flex-direction: column; transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .tour-card:hover { transform: translateY(-2px); box-shadow: 0 6px 14px rgba(0, 0, 0, 0.08); }
        .tour-card-img { position: relative; height: 150px; overflow: hidden; }
        .tour-card-img img { width: 100%; height: 100%; object-fit: cover; }
        .tour-price-tag { position: absolute; bottom: 10px; right: 10px; background: rgba(15, 23, 42, 0.85); color: #fff; padding: 4px 10px; border-radius: 6px; font-weight: 700; font-size: 0.82rem; }
        .tour-card-body { padding: 14px 16px; display: flex; flex-direction: column; flex-grow: 1; }
        .tour-route-badge { color: var(--primary, #0284c7); font-size: 0.78rem; font-weight: 600; margin-bottom: 6px; display: inline-flex; align-items: center; gap: 5px; }
        .tour-features { list-style: none; padding: 8px 0 0 0; margin: 0 0 12px 0; font-size: 0.74rem; color: #64748b; display: flex; flex-direction: column; gap: 4px; border-top: 1px dashed var(--neutral-100, #f1f5f9); }
        .tour-features li { display: flex; align-items: center; }
        .btn-submit { width: 100%; padding: 8px 14px; border: none; border-radius: 6px; background-color: var(--primary, #0284c7); color: #fff; font-size: 0.78rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; transition: background 0.2s ease; }
        .btn-submit:hover { background-color: var(--primary-dark, #0369a1); }
        .pagination-status-wrapper { text-align: center; margin-top: 24px; min-height: 44px; display: flex; align-items: center; justify-content: center; }
        .loading-reload-box { display: inline-flex; align-items: center; gap: 8px; background: #e0f2fe; color: #0284c7; padding: 8px 18px; border-radius: 20px; font-size: 0.8rem; font-weight: 700; }
        .btn-load-more { padding: 8px 20px; border-radius: 30px; border: 1px solid var(--primary, #0284c7); background-color: transparent; color: var(--primary, #0284c7); font-weight: 600; font-size: 0.8rem; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.2s ease; }
        .btn-load-more:hover { background-color: var(--primary, #0284c7); color: #fff; }
        @media (max-width: 768px) {
          .hero-section { min-height: unset; aspect-ratio: 16 / 9; padding: 0; }
          .hero-content-wrapper { padding: 16px 4%; display: flex; flex-direction: column; justify-content: center; height: 100%; }
          .hero-content-wrapper h1 { font-size: 1.15rem !important; margin-bottom: 4px !important; }
          .hero-content-wrapper p { font-size: 0.78rem !important; margin-bottom: 10px !important; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
          .google-reviews-badge { margin-bottom: 6px; padding: 4px 10px; font-size: 0.72rem; }
          .controls-container { flex-direction: column; align-items: stretch; gap: 8px; }
          .search-box-wrapper { width: 100%; }
          .category-filters-scroll { width: 100%; }
          .section { padding: 14px 4%; }
          .tour-cards-grid { grid-template-columns: 1fr; gap: 12px; }
        }
      `}</style>

            <div className="page-view home-page">
                <section className="hero-section">
                    <div className="hero-bg-slideshow">
                        {slides.map((slide, index) => (
                            <div
                                key={index}
                                className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
                                style={{ backgroundImage: `url('${slide.image}')` }}
                            />
                        ))}
                        <div className="hero-overlay" />
                    </div>

                    <div className="container hero-content-wrapper">
                        <div>
                            <a
                                href={heroData.heroData?.googleMapsUrl || "https://maps.google.com"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="google-reviews-badge"
                            >
                                <i className="fa-brands fa-google" style={{ color: '#4285F4', fontSize: '0.85rem' }}></i>
                                <span>{heroData.heroData?.googleRating || '5.0'} Rating</span>
                                <div className="google-stars">
                                    <i className="fa-solid fa-star"></i>
                                    <i className="fa-solid fa-star"></i>
                                    <i className="fa-solid fa-star"></i>
                                    <i className="fa-solid fa-star"></i>
                                    <i className="fa-solid fa-star"></i>
                                </div>
                                <span style={{ color: '#64748b', fontSize: '0.68rem' }}>
                                    ({heroData.heroData?.googleReviewCount || 8} Ulasan Google)
                                </span>
                            </a>
                        </div>

                        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, lineHeight: 1.25, marginBottom: '8px' }}>
                            {heroData.heroData?.title || 'Layanan Antar-Jemput & Transportasi Lombok Terbaik'}
                        </h1>
                        <p style={{ fontSize: '0.9rem', maxWidth: '600px', margin: '0 auto 14px', opacity: 0.9 }}>
                            {heroData.heroData?.subtitle || 'Spesialis antar-jemput bandara, pelabuhan, dan transfer antar destinasi di Pulau Lombok.'}
                        </p>

                        {slides.length > 1 && (
                            <div className="hero-dots" style={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
                                {slides.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentSlide(idx)}
                                        style={{
                                            width: idx === currentSlide ? '18px' : '6px',
                                            height: '6px',
                                            borderRadius: '3px',
                                            border: 'none',
                                            backgroundColor: idx === currentSlide ? 'var(--primary, #0284c7)' : 'rgba(255,255,255,0.5)',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease'
                                        }}
                                        aria-label={`Go to slide ${idx + 1}`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                <section className="section container">
                    <div className="sub-section-title" style={{ marginBottom: '18px', textAlign: 'center' }}>
                        <h2>
                            <i className="fa-solid fa-route" style={{ color: 'var(--primary, #0284c7)' }}></i>
                            Pilihan Rute Penjemputan
                        </h2>
                        <p style={{ color: '#666', fontSize: '0.85rem', marginTop: '4px' }}>
                            Pilih kategori atau cari rute untuk menemukan estimasi harga perjalanan Anda.
                        </p>
                    </div>

                    <div className="controls-container">
                        <div className="search-box-wrapper">
                            <i className="fa-solid fa-magnifying-glass fa-search"></i>
                            <input
                                type="text"
                                className="search-input"
                                placeholder="Cari rute / tujuan..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    className="search-clear-btn"
                                    onClick={() => {
                                        setSearchQuery('');
                                        setVisibleCount(getInitialLimit());
                                    }}
                                >
                                    &times;
                                </button>
                            )}
                        </div>

                        <div className="category-filters-scroll">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    className={`filter-btn ${filter === cat.id ? 'active' : ''}`}
                                    onClick={() => handleFilterChange(cat.id)}
                                >
                                    <i className={`fa-solid ${cat.icon}`}></i>
                                    <span>{cat.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {displayedRoutes.length > 0 ? (
                        <div className="tour-cards-grid">
                            {displayedRoutes.map((route, idx) => (
                                <div key={idx} className="tour-card">
                                    <div className="tour-card-img">
                                        <img src={route.image} alt={route.drop} loading="lazy" />
                                        <span className="tour-price-tag">{route.priceFormatted}</span>
                                    </div>
                                    <div className="tour-card-body">
                                        <span className="tour-route-badge">
                                            <i className={`fa-solid ${route.icon || 'fa-route'}`}></i> {route.badge}
                                        </span>
                                        <h4 style={{ fontSize: '1rem', marginBottom: '6px' }}>{route.title}</h4>
                                        <p style={{ color: '#666', fontSize: '0.82rem', marginBottom: '10px', flexGrow: 1 }}>
                                            {route.description}
                                        </p>

                                        <ul className="tour-features">
                                            <li><i className="fa-solid fa-check" style={{ color: '#28a745', marginRight: '6px' }}></i> Max 4 Penumpang + Bagasi</li>
                                            <li><i className="fa-solid fa-check" style={{ color: '#28a745', marginRight: '6px' }}></i> Driver Berpengalaman</li>
                                            <li><i className="fa-solid fa-check" style={{ color: '#28a745', marginRight: '6px' }}></i> AC Dingin & Nyaman</li>
                                        </ul>

                                        <button className="btn-submit" onClick={() => handleSelectRoute(route)}>
                                            <i className="fa-solid fa-car"></i>
                                            <span>Pesan Rute Ini</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state" style={{ textAlign: 'center', padding: '30px 0' }}>
                            <i className="fa-solid fa-car-side" style={{ fontSize: '2.5rem', color: '#ccc', marginBottom: '10px' }}></i>
                            <p style={{ color: '#888', fontSize: '0.85rem' }}>
                                {searchQuery
                                    ? `Tidak ada rute perjalanan yang cocok dengan "${searchQuery}".`
                                    : 'Tidak ada rute perjalanan yang tersedia untuk kategori ini.'}
                            </p>
                        </div>
                    )}

                    <div ref={observerTarget} style={{ height: '1px' }} />

                    {hasMore && (
                        <div className="pagination-status-wrapper">
                            {isLoading ? (
                                <div className="loading-reload-box">
                                    <i className="fa-solid fa-arrows-rotate fa-spin"></i>
                                    <span>Memuat data rute baru...</span>
                                </div>
                            ) : (
                                <button className="btn-load-more" onClick={loadMoreWithDelay}>
                                    <i className="fa-solid fa-arrows-rotate"></i>
                                    <span>Tampilkan Lebih Banyak</span>
                                </button>
                            )}
                        </div>
                    )}
                </section>
            </div>
        </>
    );
};

export default Home;
