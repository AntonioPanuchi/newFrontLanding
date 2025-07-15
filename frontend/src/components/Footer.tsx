import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

function getInitialDark() {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  return false;
}

const Footer: React.FC = () => {
  const [dark, setDark] = useState(getInitialDark);
  const [pop, setPop] = useState(false);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  useEffect(() => {
    if (pop) {
      const timeout = setTimeout(() => setPop(false), 180);
      return () => clearTimeout(timeout);
    }
  }, [pop]);

  return (
    <footer className="py-10 sm:py-14 bg-dark text-white mt-16 sm:mt-24">
      <div className="container mx-auto px-4 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-8">
        <div className="font-bold text-lg sm:text-xl">ROX.VPN © {new Date().getFullYear()}</div>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-8 items-center text-base sm:text-lg">
          <a href="https://t.me/RX_VPN_Seller_bot" target="_blank" rel="noopener noreferrer" className="hover:underline">Telegram</a>
          <NavLink to="/" className="hover:underline">Главная</NavLink>
          <NavLink to="/servers" className="hover:underline">Серверы</NavLink>
          <NavLink to="/faq" className="hover:underline">FAQ</NavLink>
        </div>
        <div className="flex items-center">
          <button
            onClick={() => { setDark(d => !d); setPop(true); }}
            className="p-2 rounded-xl bg-white/20 dark:bg-gray-800/60 hover:bg-accent/20 dark:hover:bg-accent/20 transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-dark shadow"
            aria-label="Переключить тёмный режим"
            type="button"
          >
            <span className={`inline-block transition-transform duration-150 ${pop ? 'scale-125' : 'scale-100'}`}>
              {dark ? (
                <svg className="w-6 h-6 text-yellow-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m8.66-8.66l-.71.71M4.05 19.07l-.71.71M21 12h-1M4 12H3m16.95 7.07l-.71-.71M4.05 4.93l-.71-.71M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              ) : (
                <svg className="w-6 h-6 text-gray-200 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" /></svg>
              )}
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 