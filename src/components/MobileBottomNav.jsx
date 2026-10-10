import React from 'react';
import { NavLink } from 'react-router-dom';

const MobileBottomNav = () => {
  const getNavLinkClass = ({ isActive }) =>
    `flex h-full flex-1 flex-col items-center justify-center text-[0.68rem] font-semibold transition-all duration-200 no-underline ${
      isActive ? 'text-sky-600' : 'text-slate-400 hover:text-sky-600'
    }`;

  return (
    <nav className="fixed bottom-0 left-0 z-[1500] flex h-[60px] w-full items-center justify-around border-t border-black/10 bg-white p-0 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] lg:hidden">
      <NavLink to="/" className={getNavLinkClass}>
        <i className="fa-solid fa-house mb-[2px] text-[1.15rem]"></i>
        <span>Beranda</span>
      </NavLink>

      <NavLink to="/tarif" className={getNavLinkClass}>
        <i className="fa-solid fa-table-list mb-[2px] text-[1.15rem]"></i>
        <span>Tarif</span>
      </NavLink>

      <NavLink to="/pesan" className={getNavLinkClass}>
        <i className="fa-solid fa-circle-plus mb-[2px] text-[1.55rem] text-sky-600"></i>
        <span>Pesan</span>
      </NavLink>

      <NavLink to="/galeri" className={getNavLinkClass}>
        <i className="fa-solid fa-images mb-[2px] text-[1.15rem]"></i>
        <span>Galeri</span>
      </NavLink>

      <NavLink to="/blog" className={getNavLinkClass}>
        <i className="fa-solid fa-blog mb-[2px] text-[1.15rem]"></i>
        <span>Blog</span>
      </NavLink>
    </nav>
  );
};

export default MobileBottomNav;
