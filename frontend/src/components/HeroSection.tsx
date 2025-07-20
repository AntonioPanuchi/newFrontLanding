import React from "react";
import Button from "./Button";
import { useInView } from "../hooks/useInView";
// @ts-ignore
import heroSecurityUrl from "../assets/hero-security.svg";

const HeroSection: React.FC = () => {
  const [ref, inView] = useInView();
  const [animated, setAnimated] = React.useState(false);

  React.useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setAnimated(false);
    } else {
      setAnimated(true);
    }
  }, []);

  return (
    <section
      ref={ref}
      className={`relative overflow-hidden py-24 sm:py-32 bg-hero-gradient dark:bg-gradient-to-br dark:from-slate-900 dark:via-blue-900 dark:to-gray-900 transition-colors duration-300 transition-opacity ${inView ? "opacity-100 animate-fade-in-up" : "opacity-0"}`}
    >
      {/* Фоновые blur-элементы */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] sm:w-[800px] h-[500px] sm:h-[800px] bg-accent dark:bg-blue-900 opacity-20 blur-3xl rounded-full pointer-events-none z-0 transition-colors duration-300" />
      <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-primary dark:bg-indigo-900 opacity-10 blur-2xl rounded-full pointer-events-none z-0 transition-colors duration-300" />
      <div className="container mx-auto px-4 sm:px-8 relative z-10 max-w-6xl flex flex-col md:flex-row items-center justify-between">
        {/* Левый блок: текст и CTA */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black mb-8 sm:mb-12 leading-tight tracking-tight text-white drop-shadow-lg">
            Мониторинг <span className="text-primary">VPN</span>-серверов
          </h1>
          <p className="text-lg sm:text-2xl md:text-3xl mb-8 sm:mb-12 max-w-3xl mx-auto md:mx-0 text-white/90">
            Данные предоставляются исключительно в информационных целях и не
            являются рекламой сервисов VPN.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 justify-center md:justify-start items-center mb-10 sm:mb-14">
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
        {/* Правый блок: SVG иллюстрация */}
        <div className="flex-1 flex items-center justify-center mt-12 md:mt-0 w-full max-w-md">
          <img
            src={heroSecurityUrl}
            alt="Иллюстрация мониторинга VPN"
            className={animated ? "animated" : ""}
            style={{ maxWidth: 400, width: "100%", height: "auto" }}
            aria-hidden="true"
            loading="lazy"
          />
        </div>
      </div>
      {/* SVG wave bottom - удалён, теперь используется SectionDivider на странице */}
    </section>
  );
};

export default HeroSection;
