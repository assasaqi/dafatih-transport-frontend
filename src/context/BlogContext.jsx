// src/context/BlogContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getBlogAPI } from '@/services/apiService';

const BlogContext = createContext();

export const BlogProvider = ({ children }) => {
  const [articles, setArticles] = useState([]);
  const [loadingApi, setLoadingApi] = useState(true);
  const [errorApi, setErrorApi] = useState(null);

  const [visibleCount, setVisibleCount] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoadingApi(true);
        const response = await getBlogAPI();

        // Mengambil array data dari properti `data` response API
        const rawArticles = Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response)
          ? response
          : [];

        // Hanya tampilkan artikel yang sudah dipublikasikan (is_published !== false)
        const publishedArticles = rawArticles.filter(
          (item) => item.is_published !== false
        );

        setArticles(publishedArticles);
      } catch (err) {
        console.error('Blog API Error:', err);
        setErrorApi(err.message || 'Gagal memuat artikel blog dari server');
        setArticles([]);
      } finally {
        setLoadingApi(false);
      }
    };

    fetchBlog();
  }, []);

  return (
    <BlogContext.Provider
      value={{
        articles: Array.isArray(articles) ? articles : [],
        loadingApi,
        errorApi,
        visibleCount,
        setVisibleCount,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </BlogContext.Provider>
  );
};

export const useBlog = () => useContext(BlogContext);
