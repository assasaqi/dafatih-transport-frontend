import React, { useEffect, useRef, useCallback, useState } from 'react';
import blogData from '@/data/blog.json';
import { useBlog } from '@/context/BlogContext';

const Blog = () => {
  const { visibleCount, setVisibleCount } = useBlog();
  const [isLoading, setIsLoading] = useState(false);

  const observerTarget = useRef(null);
  const getInitialLimit = () => (window.innerWidth <= 768 ? 3 : 6);

  useEffect(() => {
    if (visibleCount === null) {
      setVisibleCount(getInitialLimit());
    }
  }, [visibleCount, setVisibleCount]);

  const articles = blogData.articles || [];
  const currentLimit = visibleCount ?? getInitialLimit();
  const displayedArticles = articles.slice(0, currentLimit);
  const hasMore = currentLimit < articles.length;

  const loadMoreWithDelay = useCallback(() => {
    if (!hasMore || isLoading) return;

    setIsLoading(true);

    setTimeout(() => {
      setVisibleCount((prev) => (prev ?? getInitialLimit()) + getInitialLimit());
      setIsLoading(false);
    }, 800);
  }, [hasMore, isLoading, setVisibleCount]);

  useEffect(() => {
    const element = observerTarget.current;
    if (!element || !hasMore || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          loadMoreWithDelay();
        }
      },
      { root: null, rootMargin: '100px', threshold: 0.1 }
    );

    observer.observe(element);
    return () => observer.unobserve(element);
  }, [loadMoreWithDelay, hasMore, isLoading]);

  return (
    <div className="block">
      {/* Banner */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-800 px-[5%] pb-[14px] pt-[18px] text-center text-white">
        <h1 className="mb-0.5 text-[clamp(1.1rem,2vw+0.4rem,1.35rem)] font-extrabold">
          Panduan & Tips Wisata Lombok
        </h1>
        <p className="mx-auto max-w-[550px] text-[clamp(0.75rem,0.8vw+0.3rem,0.82rem)] text-slate-100 opacity-90">
          Artikel dan informasi menarik seputar destinasi impian Anda di Pulau Lombok.
        </p>
      </div>

      {/* Konten Utama */}
      <section className="mx-auto max-w-[1200px] px-[4%] py-[14px] md:px-[5%] md:py-[20px]">
        <div className="grid grid-cols-1 gap-3 items-stretch sm:grid-cols-[repeat(auto-fill,minmax(280px,1fr))] sm:gap-4">
          {displayedArticles.map((article, idx) => (
            <div
              key={idx}
              className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_14px_rgba(0,0,0,0.08)]"
            >
              <div className="h-[150px] overflow-hidden bg-slate-100">
                <img
                  src={article.image}
                  alt={article.title}
                  loading="lazy"
                  className="block h-full w-full object-cover transition-transform duration-400 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col justify-between p-3.5 sm:px-4 sm:py-[14px]">
                <div>
                  <h3 className="m-0 mb-1.5 text-[0.98rem] font-bold leading-[1.35] text-slate-900">
                    {article.title}
                  </h3>
                  <p className="m-0 mb-3 text-[0.8rem] leading-relaxed text-slate-500">
                    {article.description}
                  </p>
                </div>
                <div className="mt-2 flex items-center justify-end">
                  <span className="inline-flex items-center gap-[5px] rounded-[20px] bg-slate-100 px-3 py-1 text-[0.74rem] font-semibold text-slate-500">
                    <i className="fa-solid fa-clock"></i> Segera Hadir
                  </span>
                </div>
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
                <span>Memuat artikel blog baru...</span>
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

export default Blog;
