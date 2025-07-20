import React from "react";
import { useInView } from "../hooks/useInView";

const features = [
  {
    icon: (
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="20" cy="20" r="20" fill="url(#speed-gradient)" />
        <path
          d="M12 28L28 12"
          stroke="#fff"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M20 12L28 12L28 20"
          stroke="#fff"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <defs>
          <linearGradient
            id="speed-gradient"
            x1="0"
            y1="0"
            x2="40"
            y2="40"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#34d399" />
            <stop offset="1" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
      </svg>
    ),
    title: "Мониторинг доступности",
    description: "Отслеживание времени отклика серверов",
  },
  {
    icon: (
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="20" cy="20" r="20" fill="url(#shield-gradient)" />
        <path
          d="M20 10L30 15V22C30 28 20 32 20 32C20 32 10 28 10 22V15L20 10Z"
          stroke="#fff"
          strokeWidth="2.5"
          fill="#fff2"
        />
        <defs>
          <linearGradient
            id="shield-gradient"
            x1="0"
            y1="0"
            x2="40"
            y2="40"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#6366f1" />
            <stop offset="1" stopColor="#0ea5e9" />
          </linearGradient>
        </defs>
      </svg>
    ),
    title: "Защита данных",
    description: "Используются безопасные протоколы",
  },
  {
    icon: (
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="20" cy="20" r="20" fill="url(#robot-gradient)" />
        <rect
          x="12"
          y="16"
          width="16"
          height="12"
          rx="4"
          fill="#fff"
          stroke="#0ea5e9"
          strokeWidth="2"
        />
        <rect
          x="17"
          y="12"
          width="6"
          height="6"
          rx="3"
          fill="#fff"
          stroke="#22c55e"
          strokeWidth="2"
        />
        <circle cx="16" cy="22" r="1.5" fill="#22c55e" />
        <circle cx="24" cy="22" r="1.5" fill="#22c55e" />
        <defs>
          <linearGradient
            id="robot-gradient"
            x1="0"
            y1="0"
            x2="40"
            y2="40"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#0ea5e9" />
            <stop offset="1" stopColor="#34d399" />
          </linearGradient>
        </defs>
      </svg>
    ),
    title: "Быстрое обновление статуса",
    description: "Данные серверов обновляются каждые несколько секунд",
  },
];

const Features: React.FC = () => {
  const [ref, inView] = useInView();
  return (
    <section
      ref={ref}
      className={`relative py-16 sm:py-24 bg-bg dark:bg-slate-900 transition-colors duration-300 transition-opacity ${inView ? "opacity-100 animate-fade-in-up" : "opacity-0"}`}
    >
      {/* SVG wave top - удалён, теперь используется SectionDivider на странице */}
      <div className="container mx-auto px-4 sm:px-8 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 sm:gap-14 max-w-6xl mx-auto">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="text-center p-8 sm:p-12 rounded-3xl shadow-wow bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-gray-100 dark:border-gray-700 animate-fade-in-up transition-colors duration-300 transition-transform hover:scale-105 hover:shadow-2xl"
              style={{
                animationDelay: `${i * 0.1 + 0.1}s`,
                animationFillMode: "both",
              }}
            >
              <div className="mx-auto mb-6 sm:mb-8 w-16 sm:w-20 h-16 sm:h-20 flex items-center justify-center rounded-full shadow-lg bg-gradient-to-br from-primary to-accent text-white">
                {f.icon}
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3 text-gray-900 dark:text-gray-100">
                {f.title}
              </h3>
              <p className="text-gray-500 dark:text-gray-300 text-lg sm:text-xl">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>
      {/* SVG wave bottom - удалён, теперь используется SectionDivider на странице */}
    </section>
  );
};

export default Features;
