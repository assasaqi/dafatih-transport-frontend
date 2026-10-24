import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

const MobileNavbar = ({ isTransparent, logoSrc, navLinks }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Otomatis tutup menu mobile saat rute/halaman berpindah
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 block h-16 transition-colors duration-200 md:hidden ${
        isMobileMenuOpen
          ? 'bg-white text-slate-900 border-b border-slate-100' // Putih solid tanpa transparan & tanpa bayangan saat terbuka
          : isTransparent
          ? 'bg-transparent text-white' // Aktif transparan saat menu tertutup di Beranda
          : 'bg-white/95 text-slate-900 border-b border-slate-100 backdrop-blur-md' // Tampilan saat di-scroll
      }`}
    >
      {/* Baris Header Utama (Diberi bg-white eksplisit saat menu terbuka) */}
      <div
        className={`relative z-50 mx-auto flex h-full items-center justify-between px-[4%] transition-colors duration-200 ${
          isMobileMenuOpen ? 'bg-white' : 'bg-transparent'
        }`}
      >
        {/* Logo Mobile */}
        <Link to="/" className="relative flex h-full items-center">
          <img
            src={isMobileMenuOpen ? '/logo/logo2.png' : logoSrc}
            alt="Dafatih Transport Logo"
            loading="eager"
            decoding="async"
            className="h-14 w-auto object-contain scale-125 origin-left transition-all duration-300"
          />
        </Link>

        {/* Tombol Hamburger / Close (X) */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`relative z-50 flex h-10 w-10 items-center justify-center rounded-full text-xl transition-all duration-200 active:scale-90 ${
            isMobileMenuOpen
              ? 'bg-slate-100 text-slate-900 border border-slate-200'
              : isTransparent
              ? 'text-white'
              : 'text-slate-800'
          }`}
          aria-label="Toggle Menu"
        >
          <i className={`fa-solid ${isMobileMenuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
        </button>
      </div>

      {/* Latar Gelap Transparan di Luar Menu (Backdrop Overlay) */}
      <div
        onClick={() => setIsMobileMenuOpen(false)}
        className={`fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300 ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Menu Overlay Mobile dengan Animasi Circle Reveal */}
      <div
        style={{
          clipPath: isMobileMenuOpen
            ? 'circle(150% at calc(100% - 2.5rem) 2rem)'
            : 'circle(0% at calc(100% - 2.5rem) 2rem)',
        }}
        className={`absolute left-0 right-0 top-16 z-40 border-b border-slate-100 bg-white px-[5%] pb-6 pt-3 transition-all duration-500 ease-in-out ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <nav className="flex flex-col gap-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                `rounded-xl px-4 py-3 text-sm font-bold transition-all duration-200 ${
                  isActive
                    ? 'bg-sky-50 text-sky-600'
                    : 'text-slate-700 hover:bg-slate-50 active:bg-slate-100'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}

          {/* Tombol Pesan Sekarang */}
          <Link
            to="/pesan"
            onClick={() => setIsMobileMenuOpen(false)}
            className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-sky-600 py-3 text-xs font-bold text-white transition-all active:scale-95 hover:bg-sky-700"
          >
            <i className="fa-solid fa-car"></i>
            <span>Pesan Sekarang</span>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default MobileNavbar;
