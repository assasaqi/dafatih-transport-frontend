import React from 'react';
import { Link, NavLink } from 'react-router-dom';

const DesktopNavbar = ({ isTransparent, logoSrc, navLinks }) => {
  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 hidden h-20 transition-all duration-300 md:block ${
        isTransparent
          ? 'bg-transparent text-white shadow-none'
          : 'bg-white/95 text-slate-900 shadow-md backdrop-blur-md'
      }`}
    >
      <div className="mx-auto flex h-full max-w-[1200px] items-center justify-between px-[5%]">
        {/* Logo Desktop */}
        <Link to="/" className="relative flex h-full items-center">
          <img
            src={logoSrc}
            alt="Dafatih Transport Logo"
            loading="eager"
            decoding="async"
            className="h-20 w-auto object-contain scale-150 origin-left transition-all duration-300"
          />
        </Link>

        {/* Menu Navigasi & Tombol Pesan */}
        <div className="flex items-center gap-6 ml-auto">
          <nav className="flex items-center gap-6">
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
      </div>
    </header>
  );
};

export default DesktopNavbar;
