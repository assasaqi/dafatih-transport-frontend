// src/context/HomeContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getRoutesAPI } from '@/services/apiService';

const API_BASE_DOMAIN = 'https://dafatih-transport.rasmantech.web.id';

const HomeContext = createContext();

export const HomeProvider = ({ children }) => {
  const [heroSlides, setHeroSlides] = useState([]);
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
  const [filter, setFilter] = useState('airport');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoadingApi(true);
        const response = await getRoutesAPI();

        // Mengambil array data rute dari response API
        const rawRoutes = Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response)
          ? response
          : [];

        // Filter rute aktif
        const activeRoutes = rawRoutes.filter((item) => item.is_active !== false);
        setRoutes(activeRoutes);

        // Jika API mengembalikan heroSlides gunakan itu,
        // jika tidak, ambil 4 gambar rute pertama sebagai slide hero dinamis
        if (Array.isArray(response?.heroSlides) && response.heroSlides.length > 0) {
          setHeroSlides(response.heroSlides);
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

          setHeroSlides(
            dynamicSlides.length > 0
              ? dynamicSlides
              : [
                  {
                    image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80',
                    title: 'Layanan Antar-Jemput Lombok',
                  },
                ]
          );
        }
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
