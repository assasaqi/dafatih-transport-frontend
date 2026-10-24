import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '@/pages/Home';
import Tariffs from '@/pages/Tariffs';
import Gallery from '@/pages/Gallery';
import Blog from '@/pages/Blog';
import Booking from '@/pages/Booking';
import Guide from '@/pages/Guide';
import NotFound from '@/pages/NotFound';
import Summary from '@/pages/Summary';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/tarif" element={<Tariffs />} />
      <Route path="/galeri" element={<Gallery />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/pesan" element={<Booking />} />
      <Route path="/ringkasan" element={<Summary />} />
      <Route path="/panduan" element={<Guide />} />

      {/* Fallback untuk menangani path yang tidak cocok */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter;
