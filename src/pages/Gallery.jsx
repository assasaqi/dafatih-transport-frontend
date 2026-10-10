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

  return (
    <div className="block">
      {/* Banner */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-800 px-[5%] pb-[14px] pt-[18px] text-center text-white">
        <h1 className="mb-0.5 text-[clamp(1.1rem,2vw+0.4rem,1.35rem)] font-extrabold">
          Galeri Perjalanan Wisatawan
        </h1>
        <p className="mx-auto max-w-[550px] text-[clamp(0.75rem,0.8vw+0.3rem,0.82rem)] text-slate-100 opacity-90">
          Momen kebahagiaan para tamu kami selama menjelajahi destinasi terindah di Pulau Lombok.
        </p>
      </div>

      {/* Konten Utama */}
      <section className="mx-auto max-w-[1200px] px-[4%] py-[14px] md:px-[5%] md:py-[20px]">
        <div className="grid grid-cols-1 gap-3 items-stretch sm:grid-cols-[repeat(auto-fill,minmax(260px,1fr))] sm:gap-4">
          {displayedItems.map((item, idx) => (
            <div
              key={idx}
              className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_14px_rgba(0,0,0,0.08)]"
            >
              <div className="relative h-[150px] overflow-hidden bg-slate-100 sm:h-[160px]">
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="block h-full w-full object-cover transition-transform duration-400 group-hover:scale-105"
                />
                <span className="absolute left-[10px] top-[10px] flex items-center gap-[5px] rounded-[20px] bg-slate-900/75 px-[10px] py-[4px] text-[0.7rem] font-bold text-white backdrop-blur-sm">
                  <i className="fa-solid fa-camera text-amber-500"></i> Momen Tamu
                </span>
              </div>
              <div className="flex flex-1 flex-col p-[14px_16px]">
                <h3 className="m-0 mb-1 text-[0.98rem] font-extrabold leading-[1.3] text-slate-900">
                  {item.title}
                </h3>
                <p className="m-0 text-[0.8rem] leading-[1.45] text-slate-500">
                  {item.description || "Dokumentasi perjalanan wisata bersama Dafatih Transport."}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div ref={observerTarget} className="h-px" />

        {hasMore && (
          <div className="mt-6 flex min-h-[44px] items-center justify-center text-center">
            {isLoading ? (
              <div className="inline-flex items-center gap-2 rounded-[20px] bg-sky-100 px-[18px] py-2 text-[0.8rem] font-bold text-sky-600">
                <i className="fa-solid fa-arrows-rotate fa-spin"></i>
                <span>Memuat galeri foto baru...</span>
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

export default Gallery;
