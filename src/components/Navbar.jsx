import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const navLinkClass = ({ isActive }) =>
    `text-[0.95rem] font-semibold transition-colors duration-200 ${
      isActive ? 'text-sky-600' : 'text-slate-700 hover:text-sky-600'
    }`;

  return (
    <header className="sticky top-0 z-[1000] flex items-center justify-between bg-white px-[5%] py-[15px] shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
      {/* Logo Website */}
      <NavLink to="/" className="flex items-center gap-2 text-[1.3rem] font-extrabold text-sky-600 no-underline">
        <i className="fa-solid fa-car-side text-amber-500"></i>
        <span>Dafatih Transport</span>
      </NavLink>

      {/* Navigasi Utama (Desktop) */}
      <nav className="hidden items-center gap-[25px] md:flex">
        <NavLink to="/" className={navLinkClass}>
          Beranda
        </NavLink>
        <NavLink to="/tarif" className={navLinkClass}>
          Tarif
        </NavLink>
        <NavLink to="/galeri" className={navLinkClass}>
          Galeri
        </NavLink>
        <NavLink to="/blog" className={navLinkClass}>
          Blog
        </NavLink>
      </nav>

      {/* Tombol Aksi Pesan Sekarang */}
      <div className="hidden items-center gap-2 md:flex">
        <button
          className="rounded-lg bg-sky-600 px-[20px] py-[10px] font-bold text-white transition-all duration-200 hover:-translate-y-[1px] hover:bg-sky-700"
          onClick={() => navigate('/pesan')}
        >
          Pesan Sekarang
        </button>
      </div>
    </header>
  );
};

export default Header;
