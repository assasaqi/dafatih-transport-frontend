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

  return (
    <>
      <style>{`
        .page-view { display: block; width: 100%; overflow-x: hidden; }
        .page-banner-compact {
          background: linear-gradient(180deg, var(--neutral-900, #0f172a) 0%, #1e293b 100%);
          color: #ffffff;
          padding: 18px 5% 14px;
          text-align: center;
        }
        .page-banner-compact h1 { font-size: clamp(1.1rem, 2vw + 0.4rem, 1.35rem); font-weight: 800; margin-bottom: 2px; }
        .page-banner-compact p { color: #f1f5f9; font-size: clamp(0.75rem, 0.8vw + 0.3rem, 0.82rem); max-width: 550px; margin: 0 auto; opacity: 0.9; }
        .section { padding: 20px 5%; max-width: 1200px; margin: 0 auto; box-sizing: border-box; }

        /* Bar Kontrol & Filter */
        .controls-container { display: flex; align-items: center; gap: 10px; margin-bottom: 18px; flex-wrap: nowrap; overflow: hidden; }
        .search-box-wrapper { position: relative; display: flex; align-items: center; flex-shrink: 0; width: 200px; }
        .search-box-wrapper i.fa-search { position: absolute; left: 12px; color: #94a3b8; font-size: 0.75rem; pointer-events: none; }
        .search-input { width: 100%; height: 36px; padding: 0 30px 0 32px; border-radius: 20px; border: 1.5px solid #e2e8f0; background: #ffffff; font-size: 0.78rem; color: #334155; outline: none; transition: border-color 0.2s ease; box-sizing: border-box; }
        .search-input:focus { border-color: #0284c7; }
        .search-clear-btn { position: absolute; right: 10px; background: transparent; border: none; color: #94a3b8; cursor: pointer; font-size: 0.85rem; padding: 0; display: flex; align-items: center; justify-content: center; }

        .category-filters-scroll { display: flex !important; align-items: center !important; gap: 6px !important; overflow-x: auto !important; white-space: nowrap !important; scroll-behavior: smooth; -webkit-overflow-scrolling: touch; padding: 2px 0 !important; scrollbar-width: none; flex: 1; }
        .category-filters-scroll::-webkit-scrollbar { display: none !important; }
        .filter-btn { background: #ffffff; color: #334155; border: 1.5px solid #e2e8f0; height: 34px; padding: 0 14px; border-radius: 20px; font-size: 0.78rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 5px; transition: all 0.2s ease; box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05); flex-shrink: 0 !important; box-sizing: border-box; }
        .filter-btn:hover { border-color: #0284c7; color: #0284c7; }
        .filter-btn.active { background: #0284c7; color: #ffffff; border-color: #0284c7; box-shadow: 0 2px 8px rgba(2, 132, 199, 0.2); }

        /* Grid Kartu Tarif */
        .tariff-cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 14px; width: 100%; }
        .tariff-card { background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; padding: 14px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04); display: flex; flex-direction: column; justify-content: space-between; transition: transform 0.2s ease, box-shadow 0.2s ease; box-sizing: border-box; }
        .tariff-card:hover { transform: translateY(-2px); box-shadow: 0 6px 14px rgba(0, 0, 0, 0.08); border-color: #cbd5e1; }

        /* Info Rute Sejajar Horizontal */
        .card-route-info-inline { display: flex; align-items: center; justify-content: space-between; gap: 6px; background: #f8fafc; padding: 8px 10px; border-radius: 8px; border: 1px dashed #e2e8f0; margin-bottom: 10px; width: 100%; box-sizing: border-box; }
        .route-point { display: flex; align-items: center; gap: 5px; flex: 1; min-width: 0; }
        .route-point span { font-size: 0.78rem; color: #334155; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block; }
        .route-point.from span { color: #64748b; }
        .route-point.to span { font-weight: 700; color: #0f172a; }
        .route-arrow-icon { color: #94a3b8; font-size: 0.7rem; flex-shrink: 0; padding: 0 2px; }

        .card-footer-action { display: flex; align-items: center; justify-content: space-between; padding-top: 8px; border-top: 1px solid #f1f5f9; }
        .price-label { display: flex; flex-direction: column; }
        .price-label span { font-size: 0.65rem; color: #94a3b8; font-weight: 600; }
        .price-label strong { font-size: 0.98rem; font-weight: 800; color: #0284c7; }
        .btn-card-order { background: #0284c7; color: #ffffff; border: none; padding: 6px 12px; border-radius: 6px; font-size: 0.75rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 5px; transition: background 0.2s ease; flex-shrink: 0; }
        .btn-card-order:hover { background: #0369a1; }

        .pagination-status-wrapper { text-align: center; margin-top: 20px; min-height: 40px; display: flex; align-items: center; justify-content: center; }
        .loading-reload-box { display: inline-flex; align-items: center; gap: 8px; background: #e0f2fe; color: #0284c7; padding: 8px 18px; border-radius: 20px; font-size: 0.8rem; font-weight: 700; }
        .btn-load-more { padding: 8px 20px; border-radius: 30px; border: 1px solid #0284c7; background-color: transparent; color: #0284c7; font-weight: 600; font-size: 0.8rem; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.2s ease; }
        .btn-load-more:hover { background-color: #0284c7; color: #ffffff; }

        /* Penyesuaian Responsif Khusus Seluler */
        @media (max-width: 768px) {
          .controls-container { flex-direction: column; align-items: stretch; gap: 8px; }
          .search-box-wrapper { width: 100%; }
          .category-filters-scroll { width: 100%; }
          .section { padding: 12px 3% 80px 3%; }
          .tariff-cards-grid { grid-template-columns: 1fr; gap: 10px; }
          .tariff-card { padding: 10px 12px; }
          .route-point span { font-size: 0.75rem; }
        }
      `}</style>

      <div className="page-view">
        <div className="page-banner-compact">
          <h1>Daftar Tarif Transportasi Lombok</h1>
          <p>Rute perjalanan & harga transparan layanan antar-jemput (Maks 4 Pax + Bagasi).</p>
        </div>

        <section className="section">
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
              <button
                className={`filter-btn ${activeCategory === 'all' ? 'active' : ''}`}
                onClick={() => handleCategoryChange('all')}
              >
                <i className="fa-solid fa-th-large"></i>
                <span>Semua Rute</span>
              </button>

              {categories.map((cat) => (
                <button
                  key={cat.id}
                  className={`filter-btn ${activeCategory === cat.id ? 'active' : ''}`}
                  onClick={() => handleCategoryChange(cat.id)}
                >
                  <i className={`fa-solid ${cat.icon}`}></i>
                  <span>{cat.title}</span>
                </button>
              ))}
            </div>
          </div>

          {displayedRoutes.length > 0 ? (
            <div className="tariff-cards-grid">
              {displayedRoutes.map((route, idx) => {
                const dropLoc = route.drop || route.destination;
                return (
                  <div key={idx} className="tariff-card">
                    <div className="card-route-info-inline">
                      <div className="route-point from" title={route.pickupLoc}>
                        <i className="fa-solid fa-circle-dot" style={{ color: '#0284c7', fontSize: '0.65rem' }}></i>
                        <span>{route.pickupLoc}</span>
                      </div>

                      <i className="fa-solid fa-arrow-right route-arrow-icon"></i>

                      <div className="route-point to" title={dropLoc}>
                        <i className="fa-solid fa-location-dot" style={{ color: '#f59e0b', fontSize: '0.75rem' }}></i>
                        <span>{dropLoc}</span>
                      </div>
                    </div>

                    <div className="card-footer-action">
                      <div className="price-label">
                        <span>Harga All-In</span>
                        <strong>{route.priceFormatted}</strong>
                      </div>
                      <button
                        className="btn-card-order"
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
            <div className="empty-state" style={{ textAlign: 'center', padding: '30px 0' }}>
              <i className="fa-solid fa-car-side" style={{ fontSize: '2.2rem', color: '#ccc', marginBottom: '10px' }}></i>
              <p style={{ color: '#888', fontSize: '0.85rem' }}>
                {searchQuery
                  ? `Tidak ada rute perjalanan yang cocok dengan "${searchQuery}".`
                  : 'Tidak ada tarif perjalanan yang tersedia untuk kategori ini.'}
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

export default Tariffs;
