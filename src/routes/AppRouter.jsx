import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '@/pages/Home';
import Tariffs from '@/pages/Tariffs';
import Gallery from '@/pages/Gallery';
import Blog from '@/pages/Blog';
import Booking from '@/pages/Booking';
import NotFound from '@/pages/NotFound'; // Komponen 404

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/tarif" element={<Tariffs />} />
      <Route path="/galeri" element={<Gallery />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/pesan" element={<Booking />} />

      {/* Fallback untuk menangani path yang tidak cocok */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter;
