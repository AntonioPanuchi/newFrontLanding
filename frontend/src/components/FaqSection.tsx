import React from 'react';

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
];

const FaqSection: React.FC = () => (
  <section className="py-16 sm:py-24 bg-bg animate-fade-in-up">
    <div className="container mx-auto px-4 sm:px-8 max-w-3xl sm:max-w-4xl">
      <h2 className="text-3xl sm:text-4xl font-bold mb-10 sm:mb-14 text-center">Часто задаваемые вопросы</h2>
      <div className="space-y-6 sm:space-y-8">
        {faqs.map((faq, i) => (
          <details key={i} className="faq-enhanced animate-fade-in-up text-lg sm:text-xl" style={{ animationDelay: `${i * 0.1 + 0.1}s`, animationFillMode: 'both' }}>
            <summary className="cursor-pointer font-semibold py-4 sm:py-6 px-6 sm:px-8 select-none text-xl sm:text-2xl">{faq.question}</summary>
            <div className="faq-content px-6 sm:px-8 pb-4 sm:pb-6 text-gray-700 text-lg sm:text-xl">{faq.answer}</div>
          </details>
        ))}
      </div>
    </div>
  </section>
);

export default FaqSection; 