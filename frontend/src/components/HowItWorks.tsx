import React from "react";
import { FaCheckCircle, FaDownload } from "react-icons/fa";
import { useInView } from "../hooks/useInView";

const steps = [
  {
    icon: <FaCheckCircle className="text-white text-2xl" />,
    iconBg: "bg-gradient-to-br from-green-400 to-primary",
    title: "Сканирование серверов",
  },
  {
    icon: <FaDownload className="text-white text-2xl" />,
    iconBg: "bg-gradient-to-br from-blue-400 to-accent",
    title: "Сбор статистики",
  },
  {
    icon: <FaCheckCircle className="text-white text-2xl" />,
    iconBg: "bg-gradient-to-br from-green-400 to-blue-400",
    title: "Отображение статуса",
  },
];

const Arrow = () => (
  <svg
    width="48"
    height="24"
    viewBox="0 0 48 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="hidden md:block mx-2"
  >
    <path
      d="M2 12H46M46 12L40 6M46 12L40 18"
      stroke="url(#arrow-gradient)"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <defs>
      <linearGradient
        id="arrow-gradient"
        x1="2"
        y1="12"
        x2="46"
        y2="12"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#34d399" />
        <stop offset="1" stopColor="#3b82f6" />
      </linearGradient>
    </defs>
  </svg>
);

const HowItWorks: React.FC = () => {
  const [ref, inView] = useInView();
  return (
    <section
      ref={ref}
      className={`relative py-16 sm:py-24 bg-gradient-to-br from-white/90 to-blue-50/60 backdrop-blur-2xl transition-opacity duration-700 ${inView ? "opacity-100 animate-fade-in-up" : "opacity-0"}`}
    >
      {/* SVG wave top - удалён, теперь используется SectionDivider на странице */}
      <div className="container mx-auto px-4 sm:px-8 max-w-6xl relative z-10">
        <h2 className="text-4xl sm:text-5xl font-bold mb-14 text-center">
          Как это работает?
        </h2>
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-0 relative">
          {steps.map((step, i) => (
            <React.Fragment key={i}>
              <div
                className="flex flex-col items-center justify-center text-center bg-white/80 rounded-3xl shadow-2xl p-8 w-[250px] h-[260px] min-w-[210px] min-h-[220px] mx-auto backdrop-blur-xl border border-blue-100 transition-transform duration-300 hover:scale-105 hover:shadow-3xl animate-fade-in-up"
                style={{
                  animationDelay: `${i * 0.12 + 0.1}s`,
                  animationFillMode: "both",
                }}
              >
                <div
                  className={`w-16 h-16 flex items-center justify-center rounded-full mb-4 shadow-lg ${step.iconBg} animate-pulse-slow`}
                >
                  {step.icon}
                </div>
                <div className="text-lg sm:text-xl font-bold mb-1 leading-tight flex-1 flex items-center justify-center">
                  {step.title}
                </div>
              </div>
              {i < steps.length - 1 && <Arrow />}
              {i < steps.length - 1 && (
                <div className="md:hidden flex items-center justify-center my-2">
                  <svg
                    width="24"
                    height="32"
                    viewBox="0 0 24 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 2V30M12 30L6 24M12 30L18 24"
                      stroke="url(#arrow-gradient-vert)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <defs>
                      <linearGradient
                        id="arrow-gradient-vert"
                        x1="12"
                        y1="2"
                        x2="12"
                        y2="30"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#34d399" />
                        <stop offset="1" stopColor="#3b82f6" />
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
