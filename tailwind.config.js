/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./frontend/**/*.{html,js}",
    "./frontend/src/**/*.{css,js}",
    "./frontend/dist/**/*.{css,js}"
  ],
  // Safelist для важных классов, которые могут генерироваться динамически
  safelist: [
    'dark',
    'animate-fade-in',
    'animate-fade-in-up',
    'animate-scale-in',
    'hover-lift',
    'focus-brand',
    'text-readable',
    'bg-surface',
    'bg-surface-secondary',
    'border-brand',
    'shadow-glow',
    'shadow-glow-lg'
  ],
  theme: {
    extend: {
      // Единая система контейнеров
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem',
        },
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
          '2xl': '1536px',
        },
      },
      
      // Единая система отступов (кратные 4px)
      spacing: {
        '18': '4.5rem',    // 72px
        '88': '22rem',     // 352px
        '112': '28rem',    // 448px
        '128': '32rem',    // 512px
      },
      
      // Бренд-цвета через CSS-переменные
      colors: {
        primary: {
          50: 'hsl(var(--c-primary-50))',
          100: 'hsl(var(--c-primary-100))',
          200: 'hsl(var(--c-primary-200))',
          300: 'hsl(var(--c-primary-300))',
          400: 'hsl(var(--c-primary-400))',
          500: 'hsl(var(--c-primary-500))',
          600: 'hsl(var(--c-primary-600))',
          700: 'hsl(var(--c-primary-700))',
          800: 'hsl(var(--c-primary-800))',
          900: 'hsl(var(--c-primary-900))',
        },
        secondary: {
          50: 'hsl(var(--c-secondary-50))',
          100: 'hsl(var(--c-secondary-100))',
          200: 'hsl(var(--c-secondary-200))',
          300: 'hsl(var(--c-secondary-300))',
          400: 'hsl(var(--c-secondary-400))',
          500: 'hsl(var(--c-secondary-500))',
          600: 'hsl(var(--c-secondary-600))',
          700: 'hsl(var(--c-secondary-700))',
          800: 'hsl(var(--c-secondary-800))',
          900: 'hsl(var(--c-secondary-900))',
        },
        background: {
          DEFAULT: 'hsl(var(--c-bg))',
          secondary: 'hsl(var(--c-bg-secondary))',
          tertiary: 'hsl(var(--c-bg-tertiary))',
        },
        surface: {
          DEFAULT: 'hsl(var(--c-surface))',
          secondary: 'hsl(var(--c-surface-secondary))',
          tertiary: 'hsl(var(--c-surface-tertiary))',
        },
      },
      
      // Улучшенная типографика
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },
      
      // Улучшенные тени
      boxShadow: {
        'glow': '0 0 20px rgba(34, 197, 94, 0.3)',
        'glow-lg': '0 0 40px rgba(34, 197, 94, 0.4)',
        'inner-glow': 'inset 0 2px 4px 0 rgba(34, 197, 94, 0.1)',
      },
      
      // Анимации
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'fade-in-down': 'fadeInDown 0.6s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.5s ease-out',
        'slide-in-left': 'slideInLeft 0.5s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '.5' },
        },
      },
    },
  },
  plugins: [
    // Плагин для создания утилитарных классов контейнеров
    function({ addComponents, theme }) {
      addComponents({
        '.container-section': {
          maxWidth: theme('container.screens.2xl'),
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingLeft: theme('container.padding.DEFAULT'),
          paddingRight: theme('container.padding.DEFAULT'),
          '@screen sm': {
            paddingLeft: theme('container.padding.sm'),
            paddingRight: theme('container.padding.sm'),
          },
          '@screen lg': {
            paddingLeft: theme('container.padding.lg'),
            paddingRight: theme('container.padding.lg'),
          },
          '@screen xl': {
            paddingLeft: theme('container.padding.xl'),
            paddingRight: theme('container.padding.xl'),
          },
          '@screen 2xl': {
            paddingLeft: theme('container.padding.2xl'),
            paddingRight: theme('container.padding.2xl'),
          },
        },
        '.section-spacing': {
          paddingTop: theme('spacing.24'),
          paddingBottom: theme('spacing.24'),
          '@screen lg': {
            paddingTop: theme('spacing.32'),
            paddingBottom: theme('spacing.32'),
          },
        },
        '.section-spacing-sm': {
          paddingTop: theme('spacing.16'),
          paddingBottom: theme('spacing.16'),
          '@screen lg': {
            paddingTop: theme('spacing.24'),
            paddingBottom: theme('spacing.24'),
          },
        },
      })
    }
  ],
} 