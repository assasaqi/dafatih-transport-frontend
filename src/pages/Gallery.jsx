// src/pages/Gallery.jsx

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useGallery } from '@/context/GalleryContext';

const API_BASE_DOMAIN = 'https://dafatih-transport.rasmantech.web.id';

const Gallery = () => {
  const {
    galleryItems = [],
    loadingApi,
    errorApi,
    visibleCount,
    setVisibleCount,
    activeCategory,
    setActiveCategory,
  } = useGallery();

  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const observerTarget = useRef(null);

  const getInitialLimit = () => (window.innerWidth <= 768 ? 6 : 9);

  useEffect(() => {
    if (visibleCount === null) {
      setVisibleCount(getInitialLimit());
    }
  }, [visibleCount, setVisibleCount]);

  // Formatter URL Gambar Lengkap
  const getImageUrl = (imgPath) => {
    if (!imgPath) return 'https://placehold.co/600x400?text=Galeri+Dafatih';
    if (imgPath.startsWith('http://') || imgPath.startsWith('https://')) return imgPath;
    return `${API_BASE_DOMAIN}${imgPath.startsWith('/') ? '' : '/'}${imgPath}`;
  };

  const itemsList = Array.isArray(galleryItems) ? galleryItems : [];

  // Mendapatkan daftar kategori unik secara dinamis dari API
  const uniqueCategories = [
    'all',
    ...Array.from(
      new Set(
        itemsList
          .map((item) => item.category)
          .filter((cat) => cat && typeof cat === 'string')
      )
    ),
  ];

  // Filtering berdasarkan kategori yang dipilih
  const filteredItems = itemsList.filter((item) => {
    if (activeCategory === 'all') return true;
    return item.category?.toLowerCase() === activeCategory.toLowerCase();
  });

  const currentLimit = visibleCount ?? getInitialLimit();
  const displayedItems = filteredItems.slice(0, currentLimit);
  const hasMore = currentLimit < filteredItems.length;

  const loadMoreWithDelay = useCallback(() => {
    if (!hasMore || isLoadingMore) return;

    setIsLoadingMore(true);

    setTimeout(() => {
      setVisibleCount((prev) => (prev ?? getInitialLimit()) + getInitialLimit());
      setIsLoadingMore(false);
    }, 600);
  }, [hasMore, isLoadingMore, setVisibleCount]);

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setVisibleCount(getInitialLimit());
  };

  if (loadingApi) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center font-bold text-sky-600">
        <i className="fa-solid fa-circle-notch fa-spin mr-2 text-xl"></i>
        Memuat galeri dari server...
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
      {/* Banner */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-800 px-[5%] pb-6 pt-20 md:pt-27 text-center text-white">
        <h1 className="mb-1 text-xl font-extrabold md:text-2xl">
          Galeri Dokumentasi & Wisata
        </h1>
            </div>

      {/* Main Content */}
      <section className="mx-auto max-w-[1200px] px-[4%] py-6 md:px-[5%] md:py-8">
        {/* Category Tabs */}
        {uniqueCategories.length > 1 && (
          <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
            {uniqueCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`rounded-full px-4 py-1.5 text-xs font-bold capitalize transition-all duration-200 ${
                  activeCategory === cat
                    ? 'bg-sky-600 text-white shadow-md'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-sky-600 hover:text-sky-600'
                }`}
              >
                {cat === 'all' ? 'Semua Foto' : cat}
              </button>
            ))}
          </div>
        )}

        {/* Gallery Grid */}
        {displayedItems.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {displayedItems.map((item, idx) => {
              const imageSrc = getImageUrl(item.image_url || item.imageUrl);

              return (
                <div
                  key={item.id || idx}
                  onClick={() => setSelectedImage({ ...item, imageSrc })}
                  className="group relative cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative h-56 overflow-hidden bg-slate-100">
                    <img
                      src={imageSrc}
                      alt={item.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-80 transition-opacity group-hover:opacity-95" />
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    {item.category && (
                      <span className="mb-1 inline-block rounded-md bg-sky-600/90 px-2 py-0.5 text-[0.68rem] font-bold uppercase tracking-wider">
                        {item.category}
                      </span>
                    )}
                    <h3 className="text-sm font-bold leading-snug line-clamp-2">
                      {item.title}
                    </h3>
                  </div>

                  <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-transform duration-300 group-hover:scale-110">
                    <i className="fa-solid fa-expand text-xs"></i>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-12 text-center">
            <i className="fa-solid fa-images mb-3 text-3xl text-slate-300"></i>
            <p className="text-sm text-slate-400">
              Belum ada foto galeri yang tersedia untuk kategori ini.
            </p>
          </div>
        )}

        <div ref={observerTarget} className="h-px" />

        {/* Load More Button */}
        {hasMore && (
          <div className="mt-8 flex items-center justify-center text-center">
            {isLoadingMore ? (
              <div className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-5 py-2 text-xs font-bold text-sky-600">
                <i className="fa-solid fa-circle-notch fa-spin"></i>
                <span>Memuat foto lainnya...</span>
              </div>
            ) : (
              <button
                className="inline-flex items-center gap-2 rounded-full border border-sky-600 px-6 py-2 text-xs font-bold text-sky-600 transition-all hover:bg-sky-600 hover:text-white"
                onClick={loadMoreWithDelay}
              >
                <i className="fa-solid fa-rotate-right"></i>
                <span>Tampilkan Lebih Banyak</span>
              </button>
            )}
          </div>
        )}
      </section>

      {/* Modal Lightbox Preview Foto */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-4 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-h-[90vh] max-w-4xl overflow-hidden rounded-2xl bg-slate-900 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-slate-800/80 text-white transition-colors hover:bg-rose-600"
            >
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>

            <img
              src={selectedImage.imageSrc}
              alt={selectedImage.title}
              className="max-h-[75vh] w-full object-contain"
            />

            <div className="p-4 text-white">
              {selectedImage.category && (
                <span className="mb-1 inline-block rounded-md bg-sky-600 px-2 py-0.5 text-[0.68rem] font-bold uppercase">
                  {selectedImage.category}
                </span>
              )}
              <h3 className="text-base font-bold">{selectedImage.title}</h3>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
