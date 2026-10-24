// src/pages/Gallery.jsx

import React, { useState, useEffect } from 'react';
import { useGallery } from '@/context/GalleryContext';
import { getImageUrl } from '@/services/apiService';

const getInitialLimit = () => (typeof window !== 'undefined' && window.innerWidth <= 768 ? 6 : 9);

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

  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (visibleCount === null) {
      setVisibleCount(getInitialLimit());
    }
  }, [visibleCount, setVisibleCount]);

  const itemsList = Array.isArray(galleryItems) ? galleryItems : [];

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

  const filteredItems = itemsList.filter((item) => {
    if (activeCategory === 'all') return true;
    return item.category?.toLowerCase() === activeCategory.toLowerCase();
  });

  const currentLimit = visibleCount ?? getInitialLimit();
  const displayedItems = filteredItems.slice(0, currentLimit);
  const hasMore = currentLimit < filteredItems.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => (prev ?? getInitialLimit()) + getInitialLimit());
  };

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setVisibleCount(getInitialLimit());
  };

  if (loadingApi) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center pt-24 font-bold text-sky-600">
        <i className="fa-solid fa-circle-notch fa-spin mr-2 text-xl"></i>
        Memuat galeri dari server...
      </div>
    );
  }

  if (errorApi) {
    return (
      <div className="py-20 pt-28 text-center text-rose-500">
        <i className="fa-solid fa-triangle-exclamation mb-2 text-3xl"></i>
        <p>{errorApi}</p>
      </div>
    );
  }

  return (
    <div className="block">
      {/* Page Header */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-800 px-[5%] py-3.5 pt-20 md:pt-24 text-center text-white">
        <h1 className="text-sm sm:text-base md:text-xl font-extrabold truncate">
          Galeri Perjalanan & Dokumentasi Wisata
        </h1>
      </div>

      {/* Main Content */}
      <section className="mx-auto max-w-[1200px] px-[4%] py-4 md:px-[5%] md:py-6">
        {/* Category Tabs */}
        {uniqueCategories.length > 1 && (
          <div className="mb-4 md:mb-6 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
            {uniqueCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategoryChange(cat)}
                className={`rounded-full px-3 py-1 text-[0.7rem] sm:text-xs font-bold capitalize transition-all duration-200 cursor-pointer ${
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
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-2 lg:grid-cols-3 sm:gap-4">
            {displayedItems.map((item, idx) => {
              const imageSrc = getImageUrl(item.image_url || item.imageUrl || item.image);

              return (
                <div
                  key={item.id || idx}
                  onClick={() => setSelectedImage({ ...item, imageSrc })}
                  className="group flex flex-col cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                >
                  {/* Container Gambar */}
                  <div className="relative h-[95px] sm:h-48 overflow-hidden bg-slate-100">
                    <img
                      src={imageSrc}
                      alt={item.title || 'Foto Galeri'}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute right-2 top-2 sm:right-3 sm:top-3 flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-slate-900/50 text-white backdrop-blur-md transition-transform duration-300 group-hover:scale-110">
                      <i className="fa-solid fa-expand text-[0.55rem] sm:text-xs"></i>
                    </div>
                  </div>

                  {/* Judul & Kategori */}
                  <div className="flex flex-col p-2.5 sm:p-3">
                    {item.category && (
                      <span className="mb-1 inline-block w-fit rounded-md bg-sky-50 px-1.5 sm:px-2 py-0.5 text-[0.58rem] sm:text-[0.68rem] font-bold uppercase tracking-wider text-sky-600 border border-sky-100">
                        {item.category}
                      </span>
                    )}
                    <h3 className="text-[0.75rem] sm:text-sm font-bold leading-tight sm:leading-snug text-slate-900 line-clamp-1 sm:line-clamp-2">
                      {item.title}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-12 text-center">
            <i className="fa-solid fa-images mb-3 text-3xl text-slate-300"></i>
            <p className="text-xs sm:text-sm text-slate-400">
              Belum ada foto galeri yang tersedia untuk kategori ini.
            </p>
          </div>
        )}

        {/* Load More Button */}
        {hasMore && (
          <div className="mt-6 sm:mt-8 flex items-center justify-center text-center">
            <button
              type="button"
              aria-label="Tampilkan foto galeri lebih banyak"
              className="inline-flex items-center gap-2 rounded-full border border-sky-600 px-5 sm:px-6 py-1.5 sm:py-2 text-[0.75rem] sm:text-xs font-bold text-sky-600 transition-all hover:bg-sky-600 hover:text-white cursor-pointer"
              onClick={handleLoadMore}
            >
              <i className="fa-solid fa-arrows-rotate"></i>
              <span>Tampilkan Lebih Banyak ({filteredItems.length - currentLimit} foto tersisa)</span>
            </button>
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
              type="button"
              aria-label="Tutup pratinjau foto"
              onClick={() => setSelectedImage(null)}
              className="absolute right-3 top-3 z-10 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-slate-800/80 text-white transition-colors hover:bg-rose-600 cursor-pointer"
            >
              <i className="fa-solid fa-xmark text-sm sm:text-lg"></i>
            </button>

            <img
              src={selectedImage.imageSrc}
              alt={selectedImage.title || 'Pratinjau Foto'}
              className="max-h-[75vh] w-full object-contain"
            />

            <div className="p-3 sm:p-4 text-white">
              {selectedImage.category && (
                <span className="mb-1 inline-block rounded-md bg-sky-600 px-2 py-0.5 text-[0.62rem] sm:text-[0.68rem] font-bold uppercase">
                  {selectedImage.category}
                </span>
              )}
              <h3 className="text-xs sm:text-base font-bold">{selectedImage.title}</h3>
              {selectedImage.description && (
                <p className="mt-1 text-[0.7rem] sm:text-xs text-slate-300">{selectedImage.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
