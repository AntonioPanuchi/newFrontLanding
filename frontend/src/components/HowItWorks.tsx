import React from 'react';
import { FaTelegramPlane, FaCheckCircle, FaDownload } from 'react-icons/fa';
import Button from './Button';
import { useInView } from '../hooks/useInView';

const steps = [
  {
    icon: <FaTelegramPlane className="text-white text-2xl" />,
    iconBg: 'bg-gradient-to-br from-green-400 to-primary',
    title: 'Откройте Telegram-бота',
    link: 'https://t.me/RX_VPN_Seller_bot',
    note: 'В боте нажмите «СТАРТ»',
  },
  {
    icon: <FaCheckCircle className="text-white text-2xl" />,
    iconBg: 'bg-gradient-to-br from-green-400 to-blue-400',
    title: 'Активируй пробный доступ',
  },
  {
    icon: <FaDownload className="text-white text-2xl" />,
    iconBg: 'bg-gradient-to-br from-blue-400 to-accent',
    title: 'Скачайте приложение',
    deviceIcon: (
      <svg width="44" height="32" viewBox="0 0 44 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="mt-2">
        <rect x="1" y="5" width="30" height="20" rx="2" fill="#38eafc" stroke="#222" strokeWidth="2"/>
        <rect x="7" y="9" width="28" height="16" rx="2" fill="#60a5fa" stroke="#222" strokeWidth="2"/>
        <rect x="29" y="13" width="12" height="16" rx="2" fill="#60a5fa" stroke="#222" strokeWidth="2"/>
        <rect x="33" y="27" width="4" height="2" rx="1" fill="#fde68a" stroke="#222" strokeWidth="1"/>
        <rect x="35" y="15" width="2" height="10" rx="1" fill="#fde68a" stroke="#222" strokeWidth="1"/>
      </svg>
    ),
  },
  {
    icon: <FaCheckCircle className="text-white text-2xl" />,
    iconBg: 'bg-gradient-to-br from-green-400 to-primary',
    title: 'Нажми ПОДКЛЮЧИТЬ в боте',
  },
];

const Arrow = () => (
  <svg width="48" height="24" viewBox="0 0 48 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="hidden md:block mx-2">
    <path d="M2 12H46M46 12L40 6M46 12L40 18" stroke="url(#arrow-gradient)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <defs>
      <linearGradient id="arrow-gradient" x1="2" y1="12" x2="46" y2="12" gradientUnits="userSpaceOnUse">
        <stop stopColor="#34d399"/>
        <stop offset="1" stopColor="#3b82f6"/>
      </linearGradient>
    </defs>
  </svg>
);

const HowItWorks: React.FC = () => {
  const [ref, inView] = useInView();
  return (
    <section
      ref={ref}
      className={`relative py-16 sm:py-24 bg-gradient-to-br from-white/90 to-blue-50/60 backdrop-blur-2xl transition-opacity duration-700 ${inView ? 'opacity-100 animate-fade-in-up' : 'opacity-0'}`}
    >
      {/* SVG wave top - удалён, теперь используется SectionDivider на странице */}
      <div className="container mx-auto px-4 sm:px-8 max-w-6xl relative z-10">
        <h2 className="text-4xl sm:text-5xl font-bold mb-14 text-center">Как это работает?</h2>
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-0 relative">
          {steps.map((step, i) => (
            <React.Fragment key={i}>
              <div className="flex flex-col items-center justify-center text-center bg-white/80 rounded-3xl shadow-2xl p-8 w-[250px] h-[260px] min-w-[210px] min-h-[220px] mx-auto backdrop-blur-xl border border-blue-100 transition-transform duration-300 hover:scale-105 hover:shadow-3xl animate-fade-in-up" style={{ animationDelay: `${i * 0.12 + 0.1}s`, animationFillMode: 'both' }}>
                <div className={`w-16 h-16 flex items-center justify-center rounded-full mb-4 shadow-lg ${step.iconBg} animate-pulse-slow`}>{step.icon}</div>
                {step.link ? (
                  <>
                    <a
                      href={step.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg sm:text-xl font-bold mb-3 leading-tight text-primary hover:underline focus:underline transition"
                    >
                      {step.title}
                    </a>
                    <div className="text-gray-400 text-sm mt-3">{step.note}</div>
                  </>
                ) : (
                  <>
                    <div className="text-lg sm:text-xl font-bold mb-1 leading-tight flex-1 flex items-center justify-center">{step.title}</div>
                    {step.deviceIcon ? (
                      <div className="my-4 flex items-center justify-center w-full">{step.deviceIcon}</div>
                    ) : null}
                  </>
                )}
              </div>
              {i < steps.length - 1 && <Arrow />}
              {i < steps.length - 1 && (
                <div className="md:hidden flex items-center justify-center my-2">
                  <svg width="24" height="32" viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2V30M12 30L6 24M12 30L18 24" stroke="url(#arrow-gradient-vert)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                    <defs>
                      <linearGradient id="arrow-gradient-vert" x1="12" y1="2" x2="12" y2="30" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#34d399"/>
                        <stop offset="1" stopColor="#3b82f6"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
      {/* SVG wave bottom - удалён, теперь используется SectionDivider на странице */}
    </section>
  );
};

export default HowItWorks; 