import React from "react";
import { NavLink } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";

const Footer: React.FC = () => {
  const { dark, toggleTheme } = useTheme();
  const [pop, setPop] = React.useState(false);

  React.useEffect(() => {
    if (pop) {
      const timeout = setTimeout(() => setPop(false), 180);
      return () => clearTimeout(timeout);
    }
  }, [pop]);

  return (
    <footer className="py-10 sm:py-14 bg-dark text-white mt-16 sm:mt-24">
      <div className="container mx-auto px-4 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-8">
        <div className="font-bold text-lg sm:text-xl">
          ROX.VPN © {new Date().getFullYear()}
        </div>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-8 items-center text-base sm:text-lg">
          <a
            href="https://t.me/RX_VPN_Seller_bot"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            Telegram
          </a>
          <NavLink to="/" className="hover:underline">
            Главная
          </NavLink>
          <NavLink to="/servers" className="hover:underline">
            Серверы
          </NavLink>
          <NavLink to="/faq" className="hover:underline">
            FAQ
          </NavLink>
        </div>
        <div className="flex items-center">
          <button
            onClick={() => {
              toggleTheme();
              setPop(true);
            }}
            className="p-2 rounded-xl bg-white/20 dark:bg-gray-800/60 hover:bg-accent/20 dark:hover:bg-accent/20 transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-dark shadow"
            aria-label="Переключить тёмный режим"
            type="button"
          >
            <span
              className={`inline-block transition-transform duration-150 ${pop ? "scale-125" : "scale-100"}`}
            >
              {dark ? (
                <SunIcon className="w-6 h-6 text-yellow-400 transition-colors duration-300" />
              ) : (
                <MoonIcon className="w-6 h-6 text-gray-200 transition-colors duration-300" />
              )}
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
