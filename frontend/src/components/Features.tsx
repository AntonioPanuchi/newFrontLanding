import React from 'react';

const features = [
  {
    icon: '⚡',
    title: 'Максимальная скорость',
    description: 'Работает на полной мощности, сколько бы вы ни качали',
  },
  {
    icon: '🛡️',
    title: 'Полный инкогнито-режим',
    description: 'Данные под надёжным цифровым замком',
  },
  {
    icon: '🤖',
    title: 'Подключение за секунды',
    description: 'Автоматическая конфигурация за пару секунд',
  },
];

const Features: React.FC = () => (
  <section className="py-16 sm:py-24 bg-bg animate-fade-in-up">
    <div className="container mx-auto px-4 sm:px-8 max-w-7xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 sm:gap-14 max-w-6xl mx-auto">
        {features.map((f, i) => (
          <div
            key={f.title}
            className="text-center p-8 sm:p-12 rounded-3xl shadow-wow bg-white/90 backdrop-blur-xl border border-gray-100 animate-fade-in-up transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
            style={{ animationDelay: `${i * 0.1 + 0.1}s`, animationFillMode: 'both' }}
          >
            <div className="mx-auto mb-6 sm:mb-8 w-16 sm:w-20 h-16 sm:h-20 flex items-center justify-center text-4xl sm:text-5xl rounded-full shadow-lg bg-gradient-to-br from-primary to-accent text-white">
              {f.icon}
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3 text-gray-900">{f.title}</h3>
            <p className="text-gray-500 text-lg sm:text-xl">{f.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Features; 