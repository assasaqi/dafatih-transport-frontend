// src/pages/Blog.jsx

import React, { useState, useEffect } from 'react';
import { useBlog } from '@/context/BlogContext';

const API_BASE_DOMAIN = 'https://dafatih-transport.rasmantech.web.id';

// Helper Formatter URL Gambar
const getImageUrl = (imgPath) => {
  if (!imgPath) return 'https://placehold.co/600x400?text=Blog+Dafatih';
  if (imgPath.startsWith('http://') || imgPath.startsWith('https://')) return imgPath;
  return `${API_BASE_DOMAIN}${imgPath.startsWith('/') ? '' : '/'}${imgPath}`;
};

// Helper Formatter Tanggal Indonesia
const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return '';
  }
};

const Blog = () => {
  const {
    articles = [],
    loadingApi,
    errorApi,
    visibleCount,
    setVisibleCount,
    searchQuery,
    setSearchQuery,
  } = useBlog();

  const getInitialLimit = () => (window.innerWidth <= 768 ? 4 : 6);

  useEffect(() => {
    if (visibleCount === null) {
      setVisibleCount(getInitialLimit());
    }
  }, [visibleCount, setVisibleCount]);

  // Filtering berdasarkan pencarian
  const filteredArticles = (Array.isArray(articles) ? articles : []).filter((article) => {
    const q = (searchQuery || '').toLowerCase().trim();
    if (!q) return true;
    const title = (article.title || '').toLowerCase();
    const content = (article.content || article.excerpt || '').toLowerCase();
    return title.includes(q) || content.includes(q);
  });

  const currentLimit = visibleCount ?? getInitialLimit();
  const displayedArticles = filteredArticles.slice(0, currentLimit);
  const hasMore = currentLimit < filteredArticles.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => (prev ?? getInitialLimit()) + getInitialLimit());
  };

  if (loadingApi) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center font-bold text-sky-600">
        <i className="fa-solid fa-circle-notch fa-spin mr-2 text-xl"></i>
        Memuat artikel blog dari server...
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
      {/* Page Header (Judul Ringkas 1 Baris) */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-800 px-[5%] py-3.5 pt-20 md:pt-24 text-center text-white">
        <h1 className="text-sm sm:text-base md:text-xl font-extrabold truncate">
          Panduan & Tips Wisata Lombok
        </h1>
      </div>

      {/* Main Content */}
      <section className="mx-auto max-w-[1200px] px-[4%] py-4 md:px-[5%] md:py-6">
        {/* Search Input */}
        <div className="mb-4 md:mb-6 flex justify-center">
          <div className="relative w-full max-w-md">
            <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-xs sm:text-sm text-slate-400"></i>
            <input
              type="text"
              className="w-full rounded-full border border-slate-300 bg-white py-1.5 sm:py-2 pl-9 pr-4 text-xs sm:text-sm outline-none transition-colors focus:border-sky-600 shadow-sm"
              placeholder="Cari artikel liburan, rute, atau destinasi..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setVisibleCount(getInitialLimit());
              }}
            />
          </div>
        </div>

        {/* Article Cards Grid (2 Kolom di Mobile Sesuai RouteCard) */}
        {displayedArticles.length > 0 ? (
          <div className="grid grid-cols-2 items-stretch gap-2.5 sm:grid-cols-2 lg:grid-cols-3 sm:gap-4">
            {displayedArticles.map((article, idx) => {
              const imageSrc = getImageUrl(article.image_url || article.imageUrl || article.image);
              const summaryText = article.excerpt || article.content || article.description || '';
              const publishDate = formatDate(article.created_at || article.updated_at);

              return (
                <article
                  key={article.id || idx}
                  className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                >
                  {/* Container Gambar Kartu */}
                  <div className="relative h-[95px] sm:h-44 overflow-hidden bg-slate-100">
                    <img
                      src={imageSrc}
                      alt={article.title}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  {/* Isi Kartu */}
                  <div className="flex flex-1 flex-col justify-between p-2.5 sm:p-4">
                    <div>
                      {publishDate && (
                        <div className="mb-1 flex items-center gap-1 text-[0.62rem] sm:text-xs text-slate-400">
                          <i className="fa-regular fa-calendar text-[0.6rem] sm:text-xs"></i>
                          <span>{publishDate}</span>
                        </div>
                      )}
                      <h3 className="mb-1 text-[0.75rem] sm:text-base font-bold leading-snug text-slate-900 line-clamp-1">
                        {article.title}
                      </h3>
                      <p className="text-[0.68rem] sm:text-xs leading-relaxed text-slate-500 line-clamp-2 hidden sm:block">
                        {summaryText}
                      </p>
                    </div>

                    <div className="mt-2 sm:mt-4 border-t border-slate-100 pt-2 sm:pt-3 text-right">
                      <span className="inline-flex items-center gap-1 text-[0.68rem] sm:text-xs font-bold text-sky-600 transition-colors group-hover:text-sky-700">
                        <span>Baca Selengkapnya</span>
                        <i className="fa-solid fa-arrow-right text-[0.6rem] sm:text-[0.7rem]"></i>
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="py-12 text-center">
            <i className="fa-solid fa-newspaper mb-3 text-3xl text-slate-300"></i>
            <p className="text-xs sm:text-sm text-slate-400">
              {searchQuery
                ? `Tidak ada artikel yang cocok dengan "${searchQuery}"`
                : 'Belum ada artikel blog yang tersedia saat ini.'}
            </p>
          </div>
        )}

        {/* Load More Button */}
        {hasMore && (
          <div className="mt-6 sm:mt-8 flex items-center justify-center text-center">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-sky-600 px-5 sm:px-6 py-1.5 sm:py-2 text-[0.75rem] sm:text-xs font-bold text-sky-600 transition-all hover:bg-sky-600 hover:text-white cursor-pointer"
              onClick={handleLoadMore}
            >
              <i className="fa-solid fa-arrows-rotate"></i>
             </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default Blog;
