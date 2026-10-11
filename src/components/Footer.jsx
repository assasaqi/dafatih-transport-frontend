// src/components/Footer.jsx

import React, { memo } from 'react';
import { Link } from 'react-router-dom';

const Footer = memo(() => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-slate-900 px-[5%] pb-[80px] pt-8 text-white md:pb-8">
      {/* Grid 1 Kolom di Mobile (Menumpuk ke bawah), 5 Kolom di Desktop */}
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 text-left md:grid-cols-5">

        {/* Kolom 1: Profil Brand & Sosmed */}
        <div className="flex flex-col items-start text-left">
          {/* Logo diposisikan di tengah pada mobile, rata kiri di md/desktop */}
          <Link to="/" className="flex w-full justify-left md:justify-start">
            <img
              src="/logo/logo1.png"
              alt="Dafatih Transport Logo"
              loading="lazy"
              decoding="async"
              className="h-24 w-auto object-contain transition-opacity duration-200 hover:opacity-90 md:h-32"
            />
          </Link>
          <p className="mt-2 text-[0.85rem] leading-relaxed text-slate-400 text-left">
            Penyedia jasa transportasi dan antar-jemput terpercaya di Pulau Lombok.
          </p>
          <div className="mt-3 flex justify-start gap-2.5">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram Dafatih Transport"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-xs text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-sky-600 sm:text-sm"
            >
              <i className="fa-brands fa-instagram" aria-hidden="true"></i>
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook Dafatih Transport"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-xs text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-sky-600 sm:text-sm"
            >
              <i className="fa-brands fa-facebook-f" aria-hidden="true"></i>
            </a>
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok Dafatih Transport"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-xs text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-sky-600 sm:text-sm"
            >
              <i className="fa-brands fa-tiktok" aria-hidden="true"></i>
            </a>
          </div>
        </div>

        {/* Kolom 2: Tentang */}
        <div className="flex flex-col items-start text-left">
          <h4 className="mb-2 text-[0.98rem] font-bold text-amber-500 text-left">
            Tentang
          </h4>
          <ul className="m-0 list-none space-y-1 p-0 text-left">
            <li className="text-[0.85rem]">
              <Link to="/galeri" className="text-slate-400 no-underline transition-colors duration-200 hover:text-sky-600">
                Galeri
              </Link>
            </li>
            <li className="text-[0.85rem]">
              <Link to="/blog" className="text-slate-400 no-underline transition-colors duration-200 hover:text-sky-600">
                Blog
              </Link>
            </li>
          </ul>
        </div>

        {/* Kolom 3: Layanan */}
        <div className="flex flex-col items-start text-left">
          <h4 className="mb-2 text-[0.98rem] font-bold text-amber-500 text-left">
            Layanan
          </h4>
          <ul className="m-0 list-none space-y-1 p-0 text-left">
            <li className="text-[0.85rem]">
              <Link to="/tarif" className="text-slate-400 no-underline transition-colors duration-200 hover:text-sky-600">
                Daftar Tarif
              </Link>
            </li>
          </ul>
        </div>

        {/* Kolom 4: Metode Pembayaran */}
        <div className="flex flex-col items-start text-left">
          <h4 className="mb-2 text-[0.98rem] font-bold text-amber-500 text-left">
            Pembayaran
          </h4>
          <p className="mt-1 flex items-center justify-start gap-1.5 text-left text-[0.85rem] text-slate-400">
            <i className="fa-solid fa-wallet text-amber-500" aria-hidden="true"></i>
            Cash & Transfer
          </p>
        </div>

        {/* Kolom 5: Kontak & Lokasi */}
        <div className="flex flex-col items-start text-left">
          <h4 className="mb-2 text-[0.98rem] font-bold text-amber-500 text-left">
            Kontak & Lokasi
          </h4>
          <p className="mt-1 flex items-center justify-start gap-1.5 text-left text-[0.85rem] text-slate-400">
            <i className="fa-solid fa-location-dot text-amber-500" aria-hidden="true"></i>
            Lombok, NTB
          </p>

          {/* Ikon WhatsApp tanpa nomor telepon */}
          <div className="mt-3 flex justify-start gap-2">
            <a
              href="https://wa.me/6287757004214"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp Admin 1"
              title="Hubungi Admin 1"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#25d366]/20 text-base text-[#25d366] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#25d366] hover:text-white"
            >
              <i className="fa-brands fa-whatsapp" aria-hidden="true"></i>
            </a>
            <a
              href="https://wa.me/6287862358975"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp Admin 2"
              title="Hubungi Admin 2"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#25d366]/20 text-base text-[#25d366] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#25d366] hover:text-white"
            >
              <i className="fa-brands fa-whatsapp" aria-hidden="true"></i>
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-5xl border-t border-white/10 pt-4 text-center text-[0.75rem] text-slate-500">
        &copy; {currentYear} Dafatih Transport. All Rights Reserved.
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';

export default Footer;
