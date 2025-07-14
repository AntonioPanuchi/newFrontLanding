import React from 'react';
import Button from './Button';

const HeroSection: React.FC = () => (
  <section className="relative overflow-hidden py-24 sm:py-32 text-center bg-hero-gradient animate-fade-in-up">
    {/* Фоновые blur-элементы */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] sm:w-[800px] h-[500px] sm:h-[800px] bg-accent opacity-20 blur-3xl rounded-full pointer-events-none z-0" />
    <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-primary opacity-10 blur-2xl rounded-full pointer-events-none z-0" />
    <div className="container mx-auto px-4 sm:px-8 relative z-10 max-w-5xl">
      <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black mb-8 sm:mb-12 leading-tight tracking-tight text-white drop-shadow-lg">
        VPN за <span className="text-primary">30 секунд</span><br />прямо в Telegram
      </h1>
      <p className="text-lg sm:text-2xl md:text-3xl mb-8 sm:mb-12 max-w-3xl mx-auto text-white/90">
        Забудь про сложные настройки! ROX.VPN работает через Telegram-бота — просто нажми кнопку и получи быстрый защищённый интернет.
      </p>
      <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 justify-center items-center mb-10 sm:mb-14">
        <Button
          as="a"
          href="https://t.me/RX_VPN_Seller_bot"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto px-8 sm:px-12 py-4 sm:py-5 text-lg sm:text-xl rounded-3xl font-bold bg-gradient-to-r from-primary to-accent shadow-wow hover:from-green-600 hover:to-blue-600 hover:scale-105 transition-all duration-300 text-white enhanced-button shadow-lg"
        >
          Начать бесплатно
        </Button>
        <Button
          as="a"
          href="#servers"
          variant="secondary"
          className="w-full sm:w-auto px-8 sm:px-12 py-4 sm:py-5 text-lg sm:text-xl rounded-3xl font-bold border-2 border-accent text-accent bg-white/80 hover:bg-blue-50 hover:scale-105 transition-all duration-300 shadow-lg"
        >
          Статус серверов
        </Button>
      </div>
    </div>
  </section>
);

export default HeroSection; 