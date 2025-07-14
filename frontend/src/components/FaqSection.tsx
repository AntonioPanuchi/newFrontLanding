import React, { useState } from 'react';
import { FaChevronDown, FaQuestionCircle } from 'react-icons/fa';
import { useInView } from '../hooks/useInView';

const faqs = [
  {
    question: 'Как начать пользоваться ROX.VPN?',
    answer: 'Просто нажмите кнопку “Начать бесплатно” и следуйте инструкциям в Telegram-боте.'
  },
  {
    question: 'Безопасно ли это?',
    answer: 'Да, все данные шифруются, а логи не хранятся.'
  },
  {
    question: 'Есть ли бесплатный пробный период?',
    answer: 'Да, вы можете попробовать сервис бесплатно.'
  },
  {
    question: 'Какие устройства поддерживаются?',
    answer: 'Вы можете использовать ROX.VPN на iOS, Android, Windows, Mac, Smart TV, AndroidTV и других устройствах с поддержкой VPN.'
  },
  {
    question: 'Есть ли ограничения по странам/локациям серверов?',
    answer: 'На данный момент доступны серверы в Германии, Финляндии и США. Мы регулярно расширяем географию.'
  },
  {
    question: 'Какие способы оплаты поддерживаются?',
    answer: 'Вы можете оплатить банковской картой, через СБП, электронные кошельки и другие популярные способы.'
  },
];

const FaqSection: React.FC = () => {
  const [open, setOpen] = useState<number | null>(null);
  const [ref, inView] = useInView();

  return (
    <section
      ref={ref}
      className={`py-16 sm:py-24 bg-bg dark:bg-slate-900 transition-colors duration-300 transition-opacity ${inView ? 'opacity-100 animate-fade-in-up' : 'opacity-0'}`}
    >
      <div className="container mx-auto px-4 sm:px-8 max-w-3xl sm:max-w-4xl">
        <h2 className="text-4xl sm:text-5xl font-bold mb-12 text-center dark:text-gray-100">Часто задаваемые вопросы</h2>
        <div className="flex flex-col gap-6">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={`transition-shadow duration-300 rounded-2xl shadow-md bg-white/90 dark:bg-slate-800/90 border border-gray-100 dark:border-gray-700 overflow-hidden ${open === i ? 'shadow-lg bg-gradient-to-br from-blue-50/80 to-green-50/80 dark:from-blue-900/40 dark:to-green-900/40 border-primary dark:border-primary' : ''}`}
            >
              <button
                className="w-full flex items-center justify-between gap-4 px-6 py-5 sm:py-6 text-left focus:outline-none"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
                aria-label={`Показать ответ на вопрос: ${faq.question}`}
              >
                <div className="flex items-center gap-3">
                  <FaQuestionCircle className="text-primary text-xl shrink-0" />
                  <span className="text-lg sm:text-xl font-semibold dark:text-gray-100">{faq.question}</span>
                </div>
                <FaChevronDown
                  className={`text-accent text-xl transform transition-transform duration-300 ${open === i ? 'rotate-180' : ''}`}
                />
              </button>
              <div
                className={`transition-all duration-300 px-6 ${open === i ? 'max-h-40 py-2 opacity-100' : 'max-h-0 py-0 opacity-0'} text-gray-700 dark:text-gray-300 text-base sm:text-lg`}
                style={{ overflow: 'hidden' }}
              >
                {faq.answer}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqSection; 