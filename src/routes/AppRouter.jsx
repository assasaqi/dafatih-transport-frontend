import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '@/pages/Home';
import Tariffs from '@/pages/Tariffs';
import Gallery from '@/pages/Gallery';
import Blog from '@/pages/Blog';
import Booking from '@/pages/Booking'; // <--- Pastikan Booking di-import

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/tarif" element={<Tariffs />} />
      <Route path="/galeri" element={<Gallery />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/pesan" element={<Booking />} /> {/* <--- Pastikan path ini ada */}
    </Routes>
  );
};

export default AppRouter;
