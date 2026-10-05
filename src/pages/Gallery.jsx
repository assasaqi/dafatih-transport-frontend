import React, { useEffect, useRef, useCallback, useState } from 'react';
import galleryData from '@/data/gallery.json';
import { useGallery } from '@/context/GalleryContext';

const Gallery = () => {
  const { visibleCount, setVisibleCount } = useGallery();
  const [isLoading, setIsLoading] = useState(false);

  const observerTarget = useRef(null);
  const getInitialLimit = () => (window.innerWidth <= 768 ? 3 : 6);

  useEffect(() => {
    if (visibleCount === null) {
      setVisibleCount(getInitialLimit());
    }
  }, [visibleCount, setVisibleCount]);

  const items = galleryData.galleryItems || [];
  const currentLimit = visibleCount ?? getInitialLimit();
  const displayedItems = items.slice(0, currentLimit);
  const hasMore = currentLimit < items.length;

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
        .page-view { display: block; }
        .page-banner-compact { background: linear-gradient(180deg, var(--neutral-900, #0f172a) 0%, #1e293b 100%); color: var(--white, #ffffff); padding: 18px 5% 14px; text-align: center; }
        .page-banner-compact h1 { font-size: clamp(1.1rem, 2vw + 0.4rem, 1.35rem); font-weight: 800; margin-bottom: 2px; }
        .page-banner-compact p { color: var(--neutral-100, #f1f5f9); font-size: clamp(0.75rem, 0.8vw + 0.3rem, 0.82rem); max-width: 550px; margin: 0 auto; opacity: 0.9; }
        .section { padding: 20px 5%; max-width: 1200px; margin: 0 auto; }
        .gallery-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; align-items: stretch; }
        .gallery-card { background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04); display: flex; flex-direction: column; transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .gallery-card:hover { transform: translateY(-2px); box-shadow: 0 6px 14px rgba(0, 0, 0, 0.08); }
        .gallery-img-wrapper { position: relative; height: 160px; overflow: hidden; background: #f1f5f9; }
        .gallery-img-wrapper img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.4s ease; }
        .gallery-card:hover .gallery-img-wrapper img { transform: scale(1.05); }
        .gallery-badge { position: absolute; top: 10px; left: 10px; background: rgba(15, 23, 42, 0.75); backdrop-filter: blur(4px); color: #ffffff; font-size: 0.7rem; font-weight: 700; padding: 4px 10px; border-radius: 20px; display: flex; align-items: center; gap: 5px; }
        .gallery-badge i { color: var(--accent, #f59e0b); }
        .gallery-body { padding: 14px 16px; display: flex; flex-direction: column; flex: 1; }
        .gallery-body h3 { font-size: 0.98rem; font-weight: 800; color: #0f172a; margin: 0 0 4px 0; line-height: 1.3; }
        .gallery-body p { font-size: 0.8rem; color: #64748b; line-height: 1.45; margin: 0; }
        .pagination-status-wrapper { text-align: center; margin-top: 24px; min-height: 44px; display: flex; align-items: center; justify-content: center; }
        .loading-reload-box { display: inline-flex; align-items: center; gap: 8px; background: #e0f2fe; color: #0284c7; padding: 8px 18px; border-radius: 20px; font-size: 0.8rem; font-weight: 700; }
        .btn-load-more { padding: 8px 20px; border-radius: 30px; border: 1px solid var(--primary, #0284c7); background-color: transparent; color: var(--primary, #0284c7); font-weight: 600; font-size: 0.8rem; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.2s ease; }
        .btn-load-more:hover { background-color: var(--primary, #0284c7); color: #ffffff; }
        @media (max-width: 768px) {
          .section { padding: 14px 4%; }
          .gallery-grid { grid-template-columns: 1fr; gap: 12px; }
          .gallery-img-wrapper { height: 150px; }
        }
      `}</style>

      <div className="page-view">
        <div className="page-banner-compact">
          <h1>Galeri Perjalanan Wisatawan</h1>
          <p>Momen kebahagiaan para tamu kami selama menjelajahi destinasi terindah di Pulau Lombok.</p>
        </div>

        <section className="section">
          <div className="gallery-grid">
            {displayedItems.map((item, idx) => (
              <div key={idx} className="gallery-card">
                <div className="gallery-img-wrapper">
                  <img src={item.image} alt={item.title} loading="lazy" />
                  <span className="gallery-badge">
                    <i className="fa-solid fa-camera"></i> Momen Tamu
                  </span>
                </div>
                <div className="gallery-body">
                  <h3>{item.title}</h3>
                  <p>{item.description || "Dokumentasi perjalanan wisata bersama Dafatih Transport."}</p>
                </div>
              </div>
            ))}
          </div>

          <div ref={observerTarget} style={{ height: '1px' }} />

          {hasMore && (
            <div className="pagination-status-wrapper">
              {isLoading ? (
                <div className="loading-reload-box">
                  <i className="fa-solid fa-arrows-rotate fa-spin"></i>
                  <span>Memuat galeri foto baru...</span>
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

export default Gallery;
