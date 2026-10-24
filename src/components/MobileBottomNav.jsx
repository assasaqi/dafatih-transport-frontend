import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

// Daftar Menu Navigasi dengan Ikon Modern SVG (Stroke Unified Style)
const NAV_ITEMS = [
  {
    to: '/',
    label: 'Beranda',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    to: '/tarif',
    label: 'Tarif',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="14" x="2" y="5" rx="2" />
        <line x1="2" x2="22" y1="10" y2="10" />
      </svg>
    ),
  },
  {
    to: '/pesan',
    label: 'Pesan',
    isCenter: true,
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    ),
  },
  {
    to: '/galeri',
    label: 'Galeri',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
        <circle cx="9" cy="9" r="2" />
        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
      </svg>
    ),
  },
  {
    to: '/blog',
    label: 'Blog',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
        <path d="M6 6h10" />
        <path d="M6 10h10" />
      </svg>
    ),
  },
];

const MobileBottomNav = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed left-4 right-4 z-[1500] mx-auto flex max-w-md items-center justify-around rounded-full border border-white/40 bg-white/70 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.12)] transition-all duration-300 ease-in-out lg:hidden ${
        isScrolled
          ? 'bottom-3 h-12 px-2 scale-95 opacity-90 hover:opacity-100'
          : 'bottom-5 h-16 px-3 scale-100 opacity-100'
      }`}
    >
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `group flex h-full flex-1 flex-col items-center justify-center no-underline transition-all duration-200 active:scale-90 ${
              isActive ? 'text-sky-600 font-semibold' : 'text-slate-500 hover:text-slate-800'
            }`
          }
        >
          {({ isActive }) => (
            <div className="flex flex-col items-center justify-center w-full">
              {/* Container Ikon dengan Ukuran Terkunci (Fixed Height) agar Label Selalu Sejajar */}
              <div className="flex h-6 w-6 items-center justify-center">
                {item.isCenter ? (
                  <div
                    className={`flex items-center justify-center rounded-full transition-all duration-300 ${
                      isScrolled ? 'h-7 w-7' : 'h-8 w-8'
                    } ${
                      isActive
                        ? 'bg-sky-600 text-white shadow-md shadow-sky-300'
                        : 'bg-sky-100/90 text-sky-600'
                    }`}
                  >
                    {item.icon}
                  </div>
                ) : (
                  <div className="transition-transform duration-300 group-hover:scale-110">
                    {item.icon}
                  </div>
                )}
              </div>

              {/* Label Teks Terjaga Sejajar Secara Horizontal */}
              <span
                className={`text-[10px] tracking-tight transition-all duration-300 ${
                  isScrolled
                    ? 'max-h-0 opacity-0 overflow-hidden scale-0 mt-0'
                    : 'max-h-4 opacity-100 scale-100 mt-1'
                }`}
              >
                {item.label}
              </span>
            </div>
          )}
        </NavLink>
      ))}
    </nav>
  );
};

export default MobileBottomNav;
