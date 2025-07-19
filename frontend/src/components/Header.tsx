import React, { useState, useEffect, useRef } from 'react';
import { FaHome, FaServer, FaQuestionCircle, FaTelegramPlane } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

const navLinks = [
  { href: '/', label: 'Главная', icon: <FaHome />, ariaLabel: 'Главная' },
  { href: '/servers', label: 'Серверы', icon: <FaServer />, ariaLabel: 'Серверы' },
  { href: '/faq', label: 'FAQ', icon: <FaQuestionCircle />, ariaLabel: 'FAQ' },
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
  const { dark, toggleTheme } = useTheme();
  const [showTooltip, setShowTooltip] = useState(false);
  const [pop, setPop] = useState(false);
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const firstMobileLinkRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    if (pop) {
      const timeout = setTimeout(() => setPop(false), 180);
      return () => clearTimeout(timeout);
    }
  }, [pop]);

  // Автоматическое скрытие хедера при скролле
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Скрываем хедер при скролле вниз, показываем при скролле вверх
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsHeaderHidden(true);
      } else if (currentScrollY < lastScrollY) {
        setIsHeaderHidden(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Фокусировка на первом пункте мобильного меню при открытии
  useEffect(() => {
    if (menuOpen && firstMobileLinkRef.current) {
      firstMobileLinkRef.current.focus();
    }
  }, [menuOpen]);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-accent/60 ` +
    (isActive
      ? 'bg-gradient-to-r from-green-200/80 to-blue-200/80 dark:from-blue-900/60 dark:to-green-900/60 text-accent'
      : 'text-gray-700 dark:text-gray-200 hover:bg-gradient-to-r hover:from-green-100/80 hover:to-blue-100/80 dark:hover:from-blue-900/60 dark:hover:to-green-900/60 hover:text-accent');

  const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 text-lg px-4 py-3 rounded-xl font-semibold transition-all duration-200 shadow-sm ` +
    (isActive
      ? 'bg-gradient-to-r from-green-200/80 to-blue-200/80 dark:from-blue-900/60 dark:to-green-900/60 text-accent'
      : 'text-gray-700 dark:text-gray-200 hover:bg-gradient-to-r hover:from-green-100/80 hover:to-blue-100/80 dark:hover:from-blue-900/60 dark:hover:to-green-900/60 hover:text-accent');

  return (
    <header className={`w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 fixed top-0 left-0 right-0 z-50 shadow-lg transition-all duration-300 ${isHeaderHidden ? '-translate-y-full' : 'translate-y-0'}`}>
      <div className="container mx-auto px-4 flex items-center justify-between h-16 lg:h-20">
        {/* Логотип */}
        <NavLink to="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-green-400 via-blue-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <span className="text-white font-black text-lg drop-shadow-lg">R</span>
          </div>
          <span className="text-2xl font-extrabold bg-gradient-to-r from-green-600 via-blue-500 to-blue-700 bg-clip-text text-transparent tracking-tight group-hover:drop-shadow-lg transition-all">ROX.VPN</span>
        </NavLink>
        {/* Навигация (десктоп) */}
        <nav className="hidden lg:flex items-center space-x-2 xl:space-x-4">
          {navLinks.map(link => (
            <NavLink
              key={link.href}
              to={link.href}
              className={navLinkClass}
              end={link.href === '/'}
            >
              <span className="text-lg opacity-80" aria-label={link.ariaLabel} title={link.ariaLabel}>{link.icon}</span>
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>
        {/* Правая часть header */}
        <div className="flex items-center space-x-2 xl:space-x-4">
          {/* Переключатель темы */}
          <div className="relative">
            <button
              onClick={() => { toggleTheme(); setPop(true); }}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              onFocus={() => setShowTooltip(true)}
              onBlur={() => setShowTooltip(false)}
              className="p-2 rounded-xl bg-white/60 dark:bg-gray-800/60 hover:bg-accent/20 dark:hover:bg-accent/20 transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 shadow"
              aria-label="Переключить тёмный режим"
              type="button"
            >
              <span className={`inline-block transition-transform duration-150 ${pop ? 'scale-125' : 'scale-100'}`}>
                {dark ? (
                  <SunIcon className="w-6 h-6 text-yellow-400 transition-colors duration-300" />
                ) : (
                  <MoonIcon className="w-6 h-6 text-gray-700 dark:text-gray-200 transition-colors duration-300" />
                )}
              </span>
            </button>
            {showTooltip && (
              <span className="absolute left-1/2 -translate-x-1/2 mt-2 px-3 py-1 rounded bg-gray-900 text-white text-xs shadow-lg z-50 whitespace-nowrap select-none pointer-events-none animate-fade-in">
                {dark ? 'Светлая тема' : 'Тёмная тема'}
              </span>
            )}
          </div>
          {/* CTA кнопка - скрыта на мобильных, так как есть плавающая кнопка */}
          <a
            href="https://t.me/RX_VPN_Seller_bot"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-green-500 via-blue-500 to-blue-700 text-white font-bold rounded-2xl shadow-xl hover:from-green-600 hover:to-blue-800 hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent/60"
            aria-label="Контакты в Telegram"
          >
            <FaTelegramPlane className="text-lg" />
            <span>Контакты</span>
          </a>
          {/* Мобильное меню */}
          <button
            className="lg:hidden p-2 rounded-xl bg-white/60 dark:bg-gray-800/60 hover:bg-accent/20 dark:hover:bg-accent/20 transition-colors shadow"
            aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
            onClick={() => setMenuOpen(m => !m)}
          >
            <div className="w-7 h-7 relative">
              <span className={`absolute left-0 w-7 h-0.5 bg-current transform transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-0' : '-translate-y-2'}`} />
              <span className={`absolute left-0 w-7 h-0.5 bg-current transform transition-all duration-300 ${menuOpen ? 'opacity-0' : 'opacity-100'}`} />
              <span className={`absolute left-0 w-7 h-0.5 bg-current transform transition-all duration-300 ${menuOpen ? '-rotate-45 translate-y-0' : 'translate-y-2'}`} />
            </div>
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
            <div className="bg-white/95 dark:bg-gray-900/95 border-t border-gray-200 dark:border-gray-700 shadow-2xl rounded-b-3xl">
              <div className="container mx-auto px-4 py-6">
                <nav className="flex flex-col space-y-3">
                  {navLinks.map((link, idx) => (
                    <NavLink
                      key={link.href}
                      to={link.href}
                      className={mobileNavLinkClass}
                      end={link.href === '/'}
                      onClick={() => setMenuOpen(false)}
                      ref={idx === 0 ? firstMobileLinkRef : undefined}
                    >
                      <span className="text-xl opacity-80" aria-label={link.ariaLabel} title={link.ariaLabel}>{link.icon}</span>
                      <span>{link.label}</span>
                    </NavLink>
                  ))}
                  <a
                    href="https://t.me/RX_VPN_Seller_bot"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 justify-center bg-gradient-to-r from-green-500 via-blue-500 to-blue-700 text-white font-bold rounded-2xl px-4 py-4 text-lg mt-2 shadow-xl hover:from-green-600 hover:to-blue-800 hover:scale-105 transition-all duration-300"
                  >
                    <FaTelegramPlane className="text-xl" />
                    <span>Контакты</span>
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