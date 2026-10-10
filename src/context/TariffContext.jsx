// src/context/TariffContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getTariffsAPI } from '@/services/apiService';

const TariffContext = createContext();

export const TariffProvider = ({ children }) => {
  const [tariffs, setTariffs] = useState([]);
  const [loadingApi, setLoadingApi] = useState(true);
  const [errorApi, setErrorApi] = useState(null);

  useEffect(() => {
    const fetchTariffsFromApi = async () => {
      try {
        setLoadingApi(true);
        const response = await getTariffsAPI();

        // Mengambil array data dari properti `data` response API
        const rawRoutes = Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response)
          ? response
          : [];

        // Menyaring hanya rute yang aktif (is_active !== false)
        const activeRoutes = rawRoutes.filter((item) => item.is_active !== false);

        setTariffs(activeRoutes);
      } catch (err) {
        console.error('Tariff API Error:', err);
        setErrorApi(err.message || 'Gagal memuat daftar tarif');
        setTariffs([]);
      } finally {
        setLoadingApi(false);
      }
    };

    fetchTariffsFromApi();
  }, []);

  return (
    <TariffContext.Provider
      value={{
        tariffs: Array.isArray(tariffs) ? tariffs : [],
        loadingApi,
        errorApi,
      }}
    >
      {children}
    </TariffContext.Provider>
  );
};

export const useTariff = () => useContext(TariffContext);
