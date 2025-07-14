import React from 'react';

const TelegramFab: React.FC = () => (
  <a
    href="https://t.me/RX_VPN_Seller_bot"
    target="_blank"
    rel="noopener noreferrer"
    className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-blue-500 text-white shadow-2xl hover:scale-110 hover:shadow-wow active:scale-95 transition-all duration-300 sm:hidden"
    aria-label="Открыть Telegram-бота"
  >
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="16" fill="url(#tg-gradient)" />
      <path d="M23.5 9.5L19.5 23.5C19.5 23.5 19 24 18.5 24C18 24 17.5 23.5 17.5 23.5L14.5 20.5L12.5 19.5L9.5 18.5C9.5 18.5 8.5 18 8.5 17.5C8.5 17 9.5 16.5 9.5 16.5L22.5 9.5C22.5 9.5 23.5 9 23.5 9.5Z" fill="white"/>
      <defs>
        <linearGradient id="tg-gradient" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#34d399"/>
          <stop offset="1" stopColor="#3b82f6"/>
        </linearGradient>
      </defs>
    </svg>
  </a>
);

export default TelegramFab; 