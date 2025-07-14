import React from 'react';

const Footer: React.FC = () => (
  <footer className="w-full bg-gradient-to-r from-slate-900 via-blue-900 to-slate-800 py-8 text-center text-white mt-16">
    <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="text-lg font-semibold">&copy; {new Date().getFullYear()} ROX.VPN. Все права защищены.</div>
      <div className="flex items-center gap-4 justify-center">
        <a href="https://t.me/RX_VPN_Seller_bot" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition" aria-label="Telegram">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M9.04 16.62l-.39 3.66c.56 0 .8-.24 1.09-.53l2.62-2.49 5.44 3.98c1 .55 1.72.26 1.97-.92l3.58-16.77c.33-1.53-.56-2.13-1.53-1.76L2.2 9.3c-1.5.6-1.48 1.45-.27 1.84l4.6 1.44 10.7-6.74c.5-.33.96-.15.58.21"/></svg>
        </a>
        <a href="mailto:support@rx-test.ru" className="hover:text-green-400 transition" aria-label="Email">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M2 4a2 2 0 012-2h16a2 2 0 012 2v16a2 2 0 01-2 2H4a2 2 0 01-2-2V4zm2 0v.01L12 13 20 4.01V4H4zm16 2.41l-7.07 7.07a1 1 0 01-1.42 0L4 6.41V20h16V6.41z"/></svg>
        </a>
      </div>
    </div>
  </footer>
);

export default Footer; 