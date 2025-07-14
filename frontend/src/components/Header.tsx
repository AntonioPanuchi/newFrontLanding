import React, { useState, useEffect } from 'react';

const navLinks = [
  { href: '/', label: 'Главная' },
  { href: '/servers', label: 'Серверы' },
  { href: '/faq', label: 'FAQ' },
];

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  return (
    <header className="w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      <div className="container mx-auto px-4 flex items-center justify-between h-16 lg:h-20">
        {/* Логотип */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm lg:text-base">R</span>
          </div>
          <span className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">ROX.VPN</span>
        </div>
        {/* Навигация (десктоп) */}
        <nav className="hidden lg:flex items-center space-x-8">
          {navLinks.map(link => (
            <a key={link.href} href={link.href} className="nav-link hover:underline">
              {link.label}
            </a>
          ))}
        </nav>
        {/* Правая часть header */}
        <div className="flex items-center space-x-4">
          {/* Переключатель темы */}
          <button
            onClick={() => setDark(d => !d)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Переключить тёмный режим"
          >
            {dark ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m8.66-8.66l-.71.71M4.05 19.07l-.71.71M21 12h-1M4 12H3m16.95 7.07l-.71-.71M4.05 4.93l-.71-.71M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" /></svg>
            )}
          </button>
          {/* CTA кнопка */}
          <a href="https://t.me/RX_VPN_Seller_bot" target="_blank" rel="noopener noreferrer" className="hidden sm:inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105">
            <span className="mr-2">Telegram</span>
          </a>
          {/* Мобильное меню */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Открыть меню"
            onClick={() => setMenuOpen(m => !m)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
        </div>
      </div>
      {/* Мобильное меню */}
      {menuOpen && (
        <div className="lg:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-4">
              {navLinks.map(link => (
                <a key={link.href} href={link.href} className="mobile-nav-link text-lg py-2 hover:underline" onClick={() => setMenuOpen(false)}>
                  {link.label}
                </a>
              ))}
              <a href="https://t.me/RX_VPN_Seller_bot" target="_blank" rel="noopener noreferrer" className="mobile-nav-link bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold rounded-lg px-4 py-3 text-center mt-2">
                Telegram
              </a>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header; 