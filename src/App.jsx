import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MobileBottomNav from '@/components/MobileBottomNav';
import AppRouter from '@/routes/AppRouter';
import ScrollToTop from '@/components/ScrollToTop';

/**
 * Komponen Utuh Layayout Aplikasi (App)
 * Menggabungkan Header Navbar, Rute Utama (AppRouter), Footer, dan Floating Mobile Bottom Nav.
 */
export default function App() {
  return (
    <div className="app-container flex min-h-screen w-full flex-col overflow-x-hidden bg-slate-50 text-slate-900 antialiased">
      {/* Reset posisi scroll ke paling atas setiap rute halaman berpindah */}
      <ScrollToTop />

      {/* 1. Header & Navigasi Atas (Otomatis terpisah Desktop & Mobile) */}
      <Navbar />

      {/* 2. Area Konten Utama Halaman */}
      {/* 'flex-1' memastikan main menempati sisa ruang vertikal agar Footer tetap berada di paling bawah */}
      <main className="main-content flex-1 w-full">
        <AppRouter />
      </main>

      {/* 3. Footer Bagian Bawah */}
      {/* Ditambahkan padding bottom pada mobile (pb-20) agar konten footer tidak tertimpa MobileBottomNav */}
      <div className="pb-20 md:pb-0">
        <Footer />
      </div>

      {/* 4. Navigasi Melayang Bawah Khusus Tampilan HP */}
      <MobileBottomNav />
    </div>
  );
}
