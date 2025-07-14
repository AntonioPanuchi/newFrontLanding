import React from 'react';
import { NavLink } from 'react-router-dom';

const Footer: React.FC = () => (
  <footer className="py-10 sm:py-14 bg-dark text-white mt-16 sm:mt-24">
    <div className="container mx-auto px-4 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-8">
      <div className="font-bold text-lg sm:text-xl">ROX.VPN © {new Date().getFullYear()}</div>
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-10 items-center text-base sm:text-lg">
        <a href="mailto:support@rx-test.ru" className="hover:underline">support@rx-test.ru</a>
        <a href="https://t.me/RX_VPN_Seller_bot" target="_blank" rel="noopener noreferrer" className="hover:underline">Telegram</a>
        <NavLink to="/faq" className="hover:underline">FAQ</NavLink>
      </div>
    </div>
  </footer>
);

export default Footer; 