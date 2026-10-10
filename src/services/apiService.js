// src/services/apiService.js

const BASE_URL = import.meta.env.VITE_EXTERNAL_API_URL || 'https://dafatih-transport.rasmantech.web.id/api';
const API_KEY = import.meta.env.VITE_EXTERNAL_API_KEY;

// Fetch wrapper terpusat
const fetchClient = async (endpoint, options = {}) => {
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(API_KEY && { Authorization: `Bearer ${API_KEY}` }),
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP Error Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.warn(`[API Info] Endpoint ${endpoint} bermasalah/belum siap:`, error.message);
    return null;
  }
};

// --- MODUL LAYANAN API FRONTEND ---

// 1. Data Blog -> Backend GET /blogs
export const getBlogAPI = async () => {
  return await fetchClient('/blogs');
};

// 2. Data Galeri -> Backend GET /galleries
export const getGalleryAPI = async () => {
  return await fetchClient('/galleries');
};

// 3. Data Rute -> Backend GET /routes
export const getRoutesAPI = async () => {
  return await fetchClient('/routes');
};

// 4. Data Tarif -> Mengambil dari Backend GET /routes
export const getTariffsAPI = async () => {
  return await fetchClient('/routes');
};

// 5. Data Kendaraan / Armada -> Backend GET /vehicles
export const getVehiclesAPI = async () => {
  return await fetchClient('/vehicles');
};

// 6. Buat Pesanan Baru -> Backend POST /bookings
export const createBookingAPI = async (bookingData) => {
  return await fetchClient('/bookings', {
    method: 'POST',
    body: JSON.stringify(bookingData),
  });
};

export const getExternalRoutes = getRoutesAPI;
export const getExternalBlogArticles = getBlogAPI;
