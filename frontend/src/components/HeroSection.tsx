import React from 'react';
import Button from './Button';
import { useInView } from '../hooks/useInView';

const HeroSection: React.FC = () => {
  const [ref, inView] = useInView();
  return (
    <section
      ref={ref}
      className={`relative overflow-hidden py-24 sm:py-32 text-center bg-hero-gradient dark:bg-gradient-to-br dark:from-slate-900 dark:via-blue-900 dark:to-gray-900 transition-colors duration-300 transition-opacity ${inView ? 'opacity-100 animate-fade-in-up' : 'opacity-0'}`}
    >
      {/* Фоновые blur-элементы */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] sm:w-[800px] h-[500px] sm:h-[800px] bg-accent dark:bg-blue-900 opacity-20 blur-3xl rounded-full pointer-events-none z-0 transition-colors duration-300" />
      <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-primary dark:bg-indigo-900 opacity-10 blur-2xl rounded-full pointer-events-none z-0 transition-colors duration-300" />
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
            aria-label="Начать бесплатно в Telegram"
          >
            Начать бесплатно
          </Button>
          <Button
            as="a"
            href="servers"
            variant="secondary"
            className="w-full sm:w-auto px-8 sm:px-12 py-4 sm:py-5 text-lg sm:text-xl rounded-3xl font-bold border-2 border-accent text-accent bg-white/80 hover:bg-blue-50 hover:scale-105 transition-all duration-300 shadow-lg"
            aria-label="Посмотреть статус серверов"
          >
            Статус серверов
          </Button>
        </div>
      </div>
      {/* SVG wave bottom - удалён, теперь используется SectionDivider на странице */}
    </section>
  );
};

export default HeroSection; 