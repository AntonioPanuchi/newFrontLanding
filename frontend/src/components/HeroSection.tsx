import React from 'react';
import Button from './Button';
import FloatingParticles from './FloatingParticles';

const HeroSection: React.FC = () => (
  <section className="relative overflow-hidden pt-32 pb-24 text-center bg-gradient-to-br from-green-400 via-blue-500 to-indigo-500 animate-fade-in-up">
    <FloatingParticles />
    <div className="container mx-auto px-4 relative z-10">
      <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight tracking-tight bg-gradient-to-r from-white via-blue-100 to-green-100 bg-clip-text text-transparent drop-shadow-lg animate-fade-in-up">
        VPN за <span className="bg-gradient-to-r from-green-200 via-blue-300 to-indigo-400 bg-clip-text text-transparent">30 секунд</span><br />прямо в Telegram
      </h1>
      <p className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto text-white/90 animate-fade-in-up" style={{animationDelay: '0.1s', animationFillMode: 'both'}}>
        Забудь про сложные настройки! ROX.VPN работает через Telegram-бота — просто нажми кнопку и получи быстрый защищённый интернет.
      </p>
      <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-10 animate-fade-in-up" style={{animationDelay: '0.2s', animationFillMode: 'both'}}>
        <Button as="a" href="https://t.me/RX_VPN_Seller_bot" target="_blank" rel="noopener noreferrer" className="px-8 py-4 text-lg rounded-xl font-bold bg-gradient-to-r from-green-500 to-blue-500 shadow-xl hover:from-green-600 hover:to-blue-600 transition-all duration-300">
          Начать бесплатно
        </Button>
        <Button variant="secondary" as="a" href="#servers" className="px-8 py-4 text-lg rounded-xl font-bold border-2 border-blue-500 text-blue-700 bg-white/80 hover:bg-blue-50 transition-all duration-300">
          Статус серверов
        </Button>
      </div>
    </div>
  </section>
);

export default HeroSection; 