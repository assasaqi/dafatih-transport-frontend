import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="mt-auto bg-slate-900 px-[5%] pb-[100px] pt-10 text-white md:pb-10">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-[30px] sm:grid-cols-2 lg:grid-cols-4">
        {/* Kolom 1: Profil Brand & Sosmed */}
        <div>
          <h4 className="flex items-center gap-2 text-[1.05rem] font-extrabold text-white">
            <i className="fa-solid fa-car-side text-amber-500"></i>
            <span>Dafatih Transport</span>
          </h4>
          <p className="mt-2.5 text-[0.88rem] text-slate-400">
            Penyedia jasa transportasi dan antar-jemput terpercaya di Pulau Lombok.
          </p>
          <div className="mt-[14px] flex gap-[10px]">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="inline-flex h-[34px] w-[34px] items-center justify-center rounded-full bg-white/10 text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-sky-600"
            >
              <i className="fa-brands fa-instagram"></i>
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="inline-flex h-[34px] w-[34px] items-center justify-center rounded-full bg-white/10 text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-sky-600"
            >
              <i className="fa-brands fa-facebook-f"></i>
            </a>
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="inline-flex h-[34px] w-[34px] items-center justify-center rounded-full bg-white/10 text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-sky-600"
            >
              <i className="fa-brands fa-tiktok"></i>
            </a>
          </div>
        </div>

        {/* Kolom 2: Navigasi */}
        <div>
          <h4 className="mb-3 text-[1.05rem] font-bold text-amber-500">
            Navigasi
          </h4>
          <ul className="m-0 list-none p-0">
            <li className="mb-2 text-[0.88rem]">
              <Link to="/" className="text-slate-400 no-underline transition-colors duration-200 hover:text-sky-600">
                Beranda
              </Link>
            </li>
            <li className="mb-2 text-[0.88rem]">
              <Link to="/tarif" className="text-slate-400 no-underline transition-colors duration-200 hover:text-sky-600">
                Daftar Tarif
              </Link>
            </li>
            <li className="mb-2 text-[0.88rem]">
              <Link to="/galeri" className="text-slate-400 no-underline transition-colors duration-200 hover:text-sky-600">
                Galeri
              </Link>
            </li>
            <li className="mb-2 text-[0.88rem]">
              <Link to="/blog" className="text-slate-400 no-underline transition-colors duration-200 hover:text-sky-600">
                Blog
              </Link>
            </li>
          </ul>
        </div>

        {/* Kolom 3: Metode Pembayaran */}
        <div>
          <h4 className="mb-3 text-[1.05rem] font-bold text-amber-500">
            Metode Pembayaran
          </h4>
          <p className="mt-2.5 text-[0.88rem] text-slate-400">
            <i className="fa-solid fa-wallet mr-[6px] text-amber-500"></i>
            Cash dan Transfer
          </p>
        </div>

        {/* Kolom 4: Kontak & Lokasi */}
        <div>
          <h4 className="mb-3 text-[1.05rem] font-bold text-amber-500">
            Kontak & Lokasi
          </h4>
          <p className="mt-2.5 text-[0.88rem] text-slate-400">
            <i className="fa-solid fa-location-dot mr-[6px] text-amber-500"></i>
            Lombok, NTB
          </p>
          <ul className="mt-2 list-none p-0">
            <li className="mb-[6px]">
              <a
                href="https://wa.me/6287757004214"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[0.88rem] text-slate-400 no-underline transition-colors duration-200 hover:text-sky-600"
              >
                <i className="fa-brands fa-whatsapp text-[#25d366]"></i> +62 877-5700-4214
              </a>
            </li>
            <li className="mb-[6px]">
              <a
                href="https://wa.me/6287862358975"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[0.88rem] text-slate-400 no-underline transition-colors duration-200 hover:text-sky-600"
              >
                <i className="fa-brands fa-whatsapp text-[#25d366]"></i> +62 878-6235-8975
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-[30px] max-w-[1200px] border-t border-white/10 pt-5 text-center text-[0.78rem] text-slate-500">
        &copy; {new Date().getFullYear()} Dafatih Transport. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
