import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DesktopNavbar from './DesktopNavbar';
import MobileNavbar from './MobileNavbar';

const NAV_LINKS = [
  { path: '/', label: 'Beranda' },
  { path: '/tarif', label: 'Tarif' },
  { path: '/galeri', label: 'Galeri' },
  { path: '/blog', label: 'Blog' },
  { path: '/panduan', label: 'Panduan' },
];

const Navbar = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  const isHomePage = location.pathname === '/';

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

  const isTransparent = isHomePage && !isScrolled;
  const logoSrc = isTransparent ? '/logo/logo1.png' : '/logo/logo2.png';

  return (
    <>
      {/* Navbar Tampilan Desktop */}
      <DesktopNavbar
        isTransparent={isTransparent}
        logoSrc={logoSrc}
        navLinks={NAV_LINKS}
      />

      {/* Navbar Tampilan Mobile */}
      <MobileNavbar
        isTransparent={isTransparent}
        logoSrc={logoSrc}
        navLinks={NAV_LINKS}
      />
    </>
  );
};

export default Navbar;
