// src/services/apiService.js

export const BASE_URL = import.meta.env.VITE_EXTERNAL_API_URL || 'https://dafatih-transport.rasmantech.web.id/api';
export const API_BASE_DOMAIN = BASE_URL.replace(/\/api\/?$/, '');
const API_KEY = import.meta.env.VITE_EXTERNAL_API_KEY;

// Helper Formatter URL Gambar Terpusat
export const getImageUrl = (imgPath) => {
  if (!imgPath) return 'https://placehold.co/600x400?text=Blog+Dafatih';
  if (imgPath.startsWith('http://') || imgPath.startsWith('https://')) return imgPath;
  return `${API_BASE_DOMAIN}${imgPath.startsWith('/') ? '' : '/'}${imgPath}`;
};

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
export const getBlogAPI = async () => fetchClient('/blogs');
export const getGalleryAPI = async () => fetchClient('/galleries');
export const getRoutesAPI = async () => fetchClient('/routes');
export const getTariffsAPI = async () => fetchClient('/routes');
export const getVehiclesAPI = async () => fetchClient('/vehicles');
export const createBookingAPI = async (bookingData) => {
  return await fetchClient('/bookings', {
    method: 'POST',
    body: JSON.stringify(bookingData),
  });
};

export const getExternalRoutes = getRoutesAPI;
export const getExternalBlogArticles = getBlogAPI;
