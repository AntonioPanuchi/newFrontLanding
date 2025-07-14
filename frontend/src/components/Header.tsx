import React, { useState, useEffect } from 'react';

const navLinks = [
  { href: '/', label: 'Главная' },
  { href: '/servers', label: 'Серверы' },
  { href: '/faq', label: 'FAQ' },
];

function getInitialDark() {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  return false;
}

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(getInitialDark);
  const [showTooltip, setShowTooltip] = useState(false);
  const [pop, setPop] = useState(false);

  // Сохраняем тему в localStorage и явно применяем класс
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  // Pop-эффект при клике
  useEffect(() => {
    if (pop) {
      const timeout = setTimeout(() => setPop(false), 180);
      return () => clearTimeout(timeout);
    }
  }, [pop]);

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
          <div className="relative">
            <button
              onClick={() => { setDark(d => !d); setPop(true); }}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              onFocus={() => setShowTooltip(true)}
              onBlur={() => setShowTooltip(false)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900"
              aria-label="Переключить тёмный режим"
              type="button"
            >
              <span className={`inline-block transition-transform duration-150 ${pop ? 'scale-125' : 'scale-100'}`}>
                {dark ? (
                  <svg className="w-5 h-5 text-yellow-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m8.66-8.66l-.71.71M4.05 19.07l-.71.71M21 12h-1M4 12H3m16.95 7.07l-.71-.71M4.05 4.93l-.71-.71M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                ) : (
                  <svg className="w-5 h-5 text-gray-700 dark:text-gray-200 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" /></svg>
                )}
              </span>
            </button>
            {showTooltip && (
              <span className="absolute left-1/2 -translate-x-1/2 mt-2 px-3 py-1 rounded bg-gray-900 text-white text-xs shadow-lg z-50 whitespace-nowrap select-none pointer-events-none animate-fade-in">
                {dark ? 'Светлая тема' : 'Тёмная тема'}
              </span>
            )}
          </div>
          {/* CTA кнопка */}
          <a href="https://t.me/RX_VPN_Seller_bot" target="_blank" rel="noopener noreferrer" className="hidden sm:inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105" aria-label="Открыть Telegram-бота">
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
        <>
          {/* Затемнение фона */}
          <div
            className="fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 animate-fade-in"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />
          {/* Мобильное меню с анимацией */}
          <div
            className="lg:hidden fixed top-0 left-0 right-0 z-50 transform transition-transform duration-300"
            style={{ transform: menuOpen ? 'translateY(0)' : 'translateY(-100%)' }}
          >
            <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-xl">
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
          </div>
        </>
      )}
    </header>
  );
};

export default Header; 