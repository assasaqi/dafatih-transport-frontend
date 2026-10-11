import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    // Menambahkan { passive: true } agar scroll tidak terhambat proses JavaScript
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const isTransparent = isHomePage && !isScrolled;
  const logoSrc = isTransparent ? '/logo/logo1.png' : '/logo/logo2.png';

  const navLinks = [
    { path: '/', label: 'Beranda' },
    { path: '/tarif', label: 'Tarif' },
    { path: '/galeri', label: 'Galeri' },
    { path: '/blog', label: 'Blog' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 h-16 md:h-20 transition-all duration-300 ${
        isTransparent
          ? 'bg-transparent text-white shadow-none'
          : 'bg-white/95 text-slate-900 shadow-md backdrop-blur-md'
      }`}
    >
      <div className="mx-auto flex h-full max-w-[1200px] items-center justify-between px-[4%] md:px-[5%]">
        {/* Container Logo */}
        <Link to="/" className="relative flex h-full items-center">
          <img
            src={logoSrc}
            alt="Dafatih Transport Logo"
            loading="eager"
            decoding="async"
            className="h-14 md:h-20 w-auto object-contain scale-125 md:scale-150 origin-left transition-all duration-300"
          />
        </Link>

        {/* Link Navigasi Desktop */}
        <nav className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `text-sm font-bold transition-colors ${
                  isTransparent
                    ? isActive
                      ? 'text-sky-400 font-extrabold'
                      : 'text-white/90 hover:text-sky-300'
                    : isActive
                    ? 'text-sky-600 font-extrabold'
                    : 'text-slate-700 hover:text-sky-600'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Tombol Pesan Desktop */}
        <div className="hidden items-center md:flex">
          <Link
            to="/pesan"
            className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold shadow-sm transition-all ${
              isTransparent
                ? 'bg-sky-500 text-white hover:bg-sky-400'
                : 'bg-sky-600 text-white hover:bg-sky-700'
            }`}
          >
            <i className="fa-solid fa-car"></i>
            <span>Pesan Sekarang</span>
          </Link>
        </div>

        {/* Tombol Menu Mobile Hamburger */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`flex h-10 w-10 items-center justify-center rounded-lg text-xl md:hidden ${
            isTransparent ? 'text-white' : 'text-slate-800'
          }`}
          aria-label="Toggle Menu"
        >
          <i className={`fa-solid ${isMobileMenuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
        </button>
      </div>

      {/* Menu Overlay Mobile */}
      {isMobileMenuOpen && (
        <div className="border-b border-slate-100 bg-white px-[5%] py-4 shadow-lg md:hidden">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm font-bold transition-colors ${
                    isActive
                      ? 'bg-sky-50 text-sky-600'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <Link
              to="/pesan"
              onClick={() => setIsMobileMenuOpen(false)}
              className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-sky-600 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-sky-700"
            >
              <i className="fa-solid fa-car"></i>
              <span>Pesan Sekarang</span>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
