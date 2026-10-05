import React from 'react';
import { NavLink } from 'react-router-dom';

const MobileBottomNav = () => {
  return (
    <>
      <style>{`
        .mobile-bottom-nav {
          display: none;
        }

        @media (max-width: 992px) {
          .mobile-bottom-nav {
            display: flex;
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 60px;
            background: #ffffff;
            border-top: 1px solid rgba(0, 0, 0, 0.08);
            box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
            z-index: 1500;
            justify-content: space-around;
            align-items: center;
            padding: 0;
          }

          .mobile-nav-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            flex: 1;
            height: 100%;
            text-decoration: none;
            color: var(--neutral-400, #94a3b8);
            font-size: 0.68rem;
            font-weight: 600;
            transition: all 0.2s ease;
          }

          .mobile-nav-item i {
            font-size: 1.15rem;
            margin-bottom: 2px;
          }

          .mobile-nav-item.active {
            color: var(--primary, #0284c7);
          }

          .mobile-nav-book i {
            font-size: 1.55rem;
            color: var(--primary, #0284c7);
          }
        }

        @media (min-width: 993px) {
          .mobile-bottom-nav {
            display: none !important;
          }
        }
      `}</style>

      <div className="mobile-bottom-nav">
        <NavLink to="/" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
          <i className="fa-solid fa-house"></i>
          <span>Beranda</span>
        </NavLink>
        <NavLink to="/tarif" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
          <i className="fa-solid fa-table-list"></i>
          <span>Tarif</span>
        </NavLink>
        <NavLink to="/pesan" className={({ isActive }) => `mobile-nav-item mobile-nav-book ${isActive ? 'active' : ''}`}>
          <i className="fa-solid fa-circle-plus"></i>
          <span>Pesan</span>
        </NavLink>
        <NavLink to="/galeri" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
          <i className="fa-solid fa-images"></i>
          <span>Galeri</span>
        </NavLink>
        <NavLink to="/blog" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
          <i className="fa-solid fa-blog"></i>
          <span>Blog</span>
        </NavLink>
      </div>
    </>
  );
};

export default MobileBottomNav;
