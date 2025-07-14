import React, { useState } from 'react';
import Section from './Section';

const faqs = [
  {
    question: 'Как подключиться к ROX.VPN?',
    answer: 'Просто напишите нашему Telegram-боту и следуйте инструкциям.',
  },
  {
    question: 'Сколько стоит сервис?',
    answer: 'Есть бесплатный пробный период, далее — по тарифу.',
  },
];

const FaqSection: React.FC = () => {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <Section title="Часто задаваемые вопросы">
      <div className="max-w-2xl mx-auto space-y-4 animate-fade-in-up">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className={`rounded-2xl border border-blue-200 bg-white/90 shadow-md transition-all duration-300 ${open === idx ? 'ring-2 ring-blue-400' : ''}`}
          >
            <button
              className="w-full text-left px-6 py-5 text-lg font-semibold text-blue-700 flex items-center justify-between focus:outline-none"
              onClick={() => setOpen(open === idx ? null : idx)}
              aria-expanded={open === idx}
            >
              <span>{faq.question}</span>
              <svg className={`w-5 h-5 ml-2 transform transition-transform duration-300 ${open === idx ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 px-6 ${open === idx ? 'max-h-40 py-2' : 'max-h-0 py-0'}`}
              style={{ color: '#334155' }}
            >
              {open === idx && <div className="text-base">{faq.answer}</div>}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
};

export default FaqSection; 