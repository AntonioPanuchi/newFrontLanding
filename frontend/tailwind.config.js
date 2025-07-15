/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  // Safelist для классов, которые генерируются динамически
  safelist: [
    // Анимации
    'animate-fade-in-up',
    'animate-fade-in',
    'animate-pulse-slow',
    
    // Состояния видимости
    'opacity-100',
    'opacity-0',
    
    // Трансформации для мобильного меню
    'rotate-180',
    'rotate-45',
    '-rotate-45',
    'translate-y-0',
    '-translate-y-2',
    'translate-y-2',
    '-translate-y-full',
    'scale-125',
    'scale-100',
    
    // Высота для FAQ аккордеона
    'max-h-40',
    'max-h-0',
    'py-2',
    'py-0',
    
    // Цвета статуса серверов
    'text-green-600',
    'text-red-500',
    'bg-green-400',
    'bg-red-400',
    
    // Классы для Button компонента
    'btn-base',
    'btn-primary',
    'btn-secondary',
    'btn-outline',
    'btn-glass',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#22c55e',
          light: '#4ade80',
          dark: '#15803d',
        },
        accent: '#0ea5e9',
        indigo: '#6366f1',
        bg: '#f0f4f8',
        dark: '#18181b',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        'wow': '0 8px 32px 0 rgba(34,197,94,0.15), 0 1.5px 6px 0 rgba(14,165,233,0.10)',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #22c55e 0%, #0ea5e9 50%, #6366f1 100%)',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.8s cubic-bezier(0.4,0,0.2,1) both',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '.5' },
        },
      },
    },
  },
  plugins: [],
}

