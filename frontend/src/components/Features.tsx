import React from 'react';
import Card from './Card';

const features = [
  {
    icon: '⚡',
    iconColor: 'bg-gradient-to-br from-green-400 to-blue-400 text-white',
    title: 'Максимальная скорость',
    description: 'Работает на полной мощности, сколько бы вы ни качали',
  },
  {
    icon: '🛡️',
    iconColor: 'bg-gradient-to-br from-blue-400 to-indigo-400 text-white',
    title: 'Полный инкогнито-режим',
    description: 'Данные под надёжным цифровым замком',
  },
  {
    icon: '🤖',
    iconColor: 'bg-gradient-to-br from-indigo-400 to-green-400 text-white',
    title: 'Подключение за секунды',
    description: 'Автоматическая конфигурация за пару секунд',
  },
];

const Features: React.FC = () => (
  <section className="py-16 bg-gray-50 animate-fade-in-up">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto">
        {features.map((f, i) => (
          <Card key={f.title} className="text-center p-8 rounded-2xl shadow-xl bg-white/90 backdrop-blur border border-gray-100 animate-fade-in-up" style={{animationDelay: `${i * 0.1 + 0.1}s`, animationFillMode: 'both'}}>
            <div className={`mx-auto mb-6 w-16 h-16 flex items-center justify-center text-4xl rounded-full shadow-lg ${f.iconColor}`}>{f.icon}</div>
            <h3 className="text-2xl font-bold mb-2 text-gray-900">{f.title}</h3>
            <p className="text-gray-500 text-lg">{f.description}</p>
          </Card>
        ))}
      </div>
    </div>
  </section>
);

export default Features; 