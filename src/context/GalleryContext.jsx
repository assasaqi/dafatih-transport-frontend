// src/context/GalleryContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getGalleryAPI } from '@/services/apiService';

const GalleryContext = createContext();

export const GalleryProvider = ({ children }) => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loadingApi, setLoadingApi] = useState(true);
  const [errorApi, setErrorApi] = useState(null);

  const [visibleCount, setVisibleCount] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        setLoadingApi(true);
        const response = await getGalleryAPI();

        // Mengambil array data dari properti `data` response API
        const rawItems = Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response)
          ? response
          : [];

        setGalleryItems(rawItems);
      } catch (err) {
        console.error('Gallery API Error:', err);
        setErrorApi(err.message || 'Gagal memuat galeri dari server');
        setGalleryItems([]);
      } finally {
        setLoadingApi(false);
      }
    };

    fetchGallery();
  }, []);

  return (
    <GalleryContext.Provider
      value={{
        galleryItems: Array.isArray(galleryItems) ? galleryItems : [],
        loadingApi,
        errorApi,
        visibleCount,
        setVisibleCount,
        activeCategory,
        setActiveCategory,
      }}
    >
      {children}
    </GalleryContext.Provider>
  );
};

export const useGallery = () => useContext(GalleryContext);
