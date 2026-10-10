// src/context/HomeContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getRoutesAPI } from '@/services/apiService';

const HomeContext = createContext();

export const HomeProvider = ({ children }) => {
  const [heroSlides, setHeroSlides] = useState([
    {
      image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80',
      title: 'Layanan Antar-Jemput Lombok',
    },
  ]);
  const [heroInfo, setHeroInfo] = useState({
    title: 'Layanan Antar-Jemput & Transportasi Lombok Terbaik',
    subtitle: 'Spesialis antar-jemput bandara, pelabuhan, dan transfer antar destinasi di Pulau Lombok.',
    googleRating: '5.0',
    googleReviewCount: 8,
    googleMapsUrl: 'https://maps.google.com',
  });
  const [routes, setRoutes] = useState([]);
  const [loadingApi, setLoadingApi] = useState(true);
  const [errorApi, setErrorApi] = useState(null);

  const [visibleCount, setVisibleCount] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoadingApi(true);
        const response = await getRoutesAPI();

        // Mengambil array rute dari properti `data` response API
        const rawRoutes = Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response)
          ? response
          : [];

        // Menyaring hanya rute yang aktif
        const activeRoutes = rawRoutes.filter((item) => item.is_active !== false);

        setRoutes(activeRoutes);

        if (response?.heroSlides) setHeroSlides(response.heroSlides);
        if (response?.heroData) setHeroInfo(response.heroData);
      } catch (err) {
        console.error('Home API Error:', err);
        setErrorApi(err.message || 'Gagal memuat data beranda dari server');
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
