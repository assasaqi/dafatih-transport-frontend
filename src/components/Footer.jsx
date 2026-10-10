// src/components/Footer.jsx

import React, { memo } from 'react';
import { Link } from 'react-router-dom';

const Footer = memo(() => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-slate-900 px-[5%] pb-[80px] pt-6 text-white md:pb-8">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {/* Kolom 1: Profil Brand & Sosmed */}
        <div className="flex flex-col items-start">
          <Link to="/" className="inline-block">
            <img
              src="/logo/logo1.png"
              alt="Dafatih Transport Logo"
              loading="lazy"
              decoding="async"
              className="h-16 md:h-20 w-auto object-contain transition-opacity duration-200 hover:opacity-90 -ml-1"
            />
          </Link>
          <p className="mt-1 text-[0.85rem] leading-snug text-slate-400">
            Penyedia jasa transportasi dan antar-jemput terpercaya di Pulau Lombok.
          </p>
          <div className="mt-2.5 flex gap-2">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram Dafatih Transport"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-sky-600 text-xs"
            >
              <i className="fa-brands fa-instagram" aria-hidden="true"></i>
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook Dafatih Transport"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-sky-600 text-xs"
            >
              <i className="fa-brands fa-facebook-f" aria-hidden="true"></i>
            </a>
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok Dafatih Transport"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-sky-600 text-xs"
            >
              <i className="fa-brands fa-tiktok" aria-hidden="true"></i>
            </a>
          </div>
        </div>

        {/* Kolom 2: Tentang */}
        <div>
          <h4 className="mb-2 text-[0.98rem] font-bold text-amber-500">
            Tentang
          </h4>
          <ul className="m-0 list-none p-0">
            <li className="mb-1 text-[0.85rem]">
              <Link to="/galeri" className="text-slate-400 no-underline transition-colors duration-200 hover:text-sky-600">
                Galeri
              </Link>
            </li>
            <li className="mb-1 text-[0.85rem]">
              <Link to="/blog" className="text-slate-400 no-underline transition-colors duration-200 hover:text-sky-600">
                Blog
              </Link>
            </li>
          </ul>
        </div>

        {/* Kolom 3: Layanan */}
        <div>
          <h4 className="mb-2 text-[0.98rem] font-bold text-amber-500">
            Layanan
          </h4>
          <ul className="m-0 list-none p-0">
            <li className="mb-1 text-[0.85rem]">
              <Link to="/tarif" className="text-slate-400 no-underline transition-colors duration-200 hover:text-sky-600">
                Daftar Tarif
              </Link>
            </li>
          </ul>
        </div>

        {/* Kolom 4: Metode Pembayaran */}
        <div>
          <h4 className="mb-2 text-[0.98rem] font-bold text-amber-500">
            Metode Pembayaran
          </h4>
          <p className="mt-1 text-[0.85rem] text-slate-400">
            <i className="fa-solid fa-wallet mr-1.5 text-amber-500" aria-hidden="true"></i>
            Cash dan Transfer
          </p>
        </div>

        {/* Kolom 5: Kontak & Lokasi */}
        <div>
          <h4 className="mb-2 text-[0.98rem] font-bold text-amber-500">
            Kontak & Lokasi
          </h4>
          <p className="mt-1 text-[0.85rem] text-slate-400">
            <i className="fa-solid fa-location-dot mr-1.5 text-amber-500" aria-hidden="true"></i>
            Lombok, NTB
          </p>
          <ul className="mt-1.5 list-none p-0">
            <li className="mb-1">
              <a
                href="https://wa.me/6287757004214"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[0.85rem] text-slate-400 no-underline transition-colors duration-200 hover:text-sky-600"
              >
                <i className="fa-brands fa-whatsapp text-[#25d366]" aria-hidden="true"></i> +62 877-5700-4214
              </a>
            </li>
            <li className="mb-1">
              <a
                href="https://wa.me/6287862358975"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[0.85rem] text-slate-400 no-underline transition-colors duration-200 hover:text-sky-600"
              >
                <i className="fa-brands fa-whatsapp text-[#25d366]" aria-hidden="true"></i> +62 878-6235-8975
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-5 max-w-[1200px] border-t border-white/10 pt-4 text-center text-[0.75rem] text-slate-500">
        &copy; {currentYear} Dafatih Transport. All Rights Reserved.
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';

export default Footer;
