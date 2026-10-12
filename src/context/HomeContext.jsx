// src/context/HomeContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getRoutesAPI } from '@/services/apiService';

const API_BASE_DOMAIN = 'https://dafatih-transport.rasmantech.web.id';

// Mengambil seluruh berkas gambar dari folder public/images secara dinamis
const localImageModules = import.meta.glob('/public/images/*.{png,jpg,jpeg,webp,svg}', { eager: true });

// Mentransformasi path /public/images/... menjadi /images/...
const DYNAMIC_LOCAL_SLIDES = Object.keys(localImageModules).map((path) => ({
  image: path.replace(/^\/public/, ''),
}));

const HomeContext = createContext();

export const HomeProvider = ({ children }) => {
  const [heroSlides, setHeroSlides] = useState([]);
  const [heroInfo, setHeroInfo] = useState({
    titlePhrases: [
      'Layanan Antar-Jemput & Transportasi Lombok',
      'Perjalanan Aman, Nyaman, dan Tepat Waktu',
    ],
    googleRating: '5.0',
    googleMapsUrl: 'https://share.google/NqGlVDoFQU9Y4MKyp',
  });
  const [routes, setRoutes] = useState([]);
  const [loadingApi, setLoadingApi] = useState(true);
  const [errorApi, setErrorApi] = useState(null);

  const [visibleCount, setVisibleCount] = useState(null);
  const [filter, setFilter] = useState('airport');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoadingApi(true);
        const response = await getRoutesAPI();

        const rawRoutes = Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response)
          ? response
          : [];

        const activeRoutes = rawRoutes.filter((item) => item.is_active !== false);
        setRoutes(activeRoutes);

        // Jika API mengembalikan heroSlides, gunakan itu.
        // Jika tidak, prioritaskan gambar lokal dinamis dari folder public/images
        if (Array.isArray(response?.heroSlides) && response.heroSlides.length > 0) {
          setHeroSlides(response.heroSlides);
        } else if (DYNAMIC_LOCAL_SLIDES.length > 0) {
          setHeroSlides(DYNAMIC_LOCAL_SLIDES);
        } else if (activeRoutes.length > 0) {
          const dynamicSlides = activeRoutes
            .filter((r) => r.image_url || r.image)
            .slice(0, 4)
            .map((r) => {
              const img = r.image_url || r.image;
              const fullImg = img.startsWith('http')
                ? img
                : `${API_BASE_DOMAIN}${img.startsWith('/') ? '' : '/'}${img}`;
              return {
                image: fullImg,
                title: r.title || r.name || `${r.pickup_location} ➔ ${r.dropoff_location}`,
              };
            });
          setHeroSlides(dynamicSlides);
        }
      } catch (err) {
        console.error('Home API Error:', err);
        setErrorApi(err.message || 'Gagal memuat data beranda dari server');
        // Jika API error, tetap gunakan slide gambar lokal
        setHeroSlides(DYNAMIC_LOCAL_SLIDES);
        setRoutes([]);
      } finally {
        setLoadingApi(false);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <HomeContext.Provider
      value={{
        heroSlides,
        heroInfo,
        routes: Array.isArray(routes) ? routes : [],
        loadingApi,
        errorApi,
        visibleCount,
        setVisibleCount,
        filter,
        setFilter,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </HomeContext.Provider>
  );
};

export const useHome = () => useContext(HomeContext);
