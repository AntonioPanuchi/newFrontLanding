---

## name: "Руководство по разработке ROX VPN API и Landing Page" description: "Полное техническое руководство для проекта ROX VPN, включающее обзор, стек технологий, структуру, настройку окружения и описание ключевых компонентов" category: "Веб-приложение" author: "Antonio Panuchi" authorUrl: "[https://github.com/AntonioPanuchi](https://github.com/AntonioPanuchi)" tags: ["nodejs","express","react","vite","tailwindcss","storybook","vpn"] lastUpdated: "July 15, 2025"

# Руководство по разработке ROX VPN API и Landing Page

## Обзор проекта

**ROX VPN API** – это комплексное решение для мониторинга и управления статусом VPN-серверов с современным веб-интерфейсом. Система предоставляет API для получения реального статуса серверов, автоматическое кэширование результатов и подробную диагностику работы сервиса. Основные возможности включают:

- Мониторинг статуса VPN-серверов в реальном времени и выдачу информации через REST API.
- Кэширование данных статусов для ускорения ответов и снижения нагрузки.
- Централизованное логирование и обработку ошибок (с помощью Winston и DailyRotateFile).
- Ограничение частоты запросов (rate limiting) и настройку CORS для безопасности.
- Современный клиент на **React** (+ **TypeScript**, **Vite**) с адаптивным UI (используется **Tailwind CSS**).
- **Storybook** для документирования и визуального тестирования UI-компонентов.
- SEO-оптимизация: динамические метаданные (заголовки страниц, Open Graph, Twitter Card) для всех страниц.

## Стек технологий

- **Backend:** Node.js (>=18.x), Express.js. Используются библиотеки `cors`, `express-rate-limit`, `node-fetch`, `ping` и `winston`.
- **Frontend:** React 18+ с **TypeScript**, сборка через Vite, маршрутизация через React Router. Интерфейс – Tailwind CSS, иконки – Heroicons/React-Icons, анимации – Framer Motion.
- **UI-компоненты:** Storybook 8.x.
- **SEO:** `react-helmet-async` + `PageHead`.
- **CI/CD:** GitHub Actions + PM2.
- **Качество кода:** ESLint + Prettier + строгий TypeScript.

## Структура проекта

```bash
├── frontend/
│   ├── .storybook/
│   ├── css/
│   ├── dist/
│   ├── examples/
│   ├── js/
│   ├── node_modules/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── utils/
│   ├── index.html
│   ├── index-redesigned.html
│   ├── index-original.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── vite.config.ts
├── backend/
│   ├── logs/
│   ├── node_modules/
│   ├── src/
│   ├── env.example
│   ├── eslint.config.js
│   ├── package.json
│   ├── server.js
│   ├── vpnService.js
│   ├── utils/
│   ├── routes/
│   ├── config/
│   └── .prettierrc
├── .gitignore
├── deploy.sh
├── ecosystem.config.js
├── package.json
├── README.md
```

## Рекомендации по разработке

- Модули: routes, services, utils, components, context
- Стандарты: SOLID, функциональное программирование, чистый код
- Lint: ESLint + Prettier + TypeScript
- Типизация: везде интерфейсы и типы
- Документация компонентов – через Storybook
- Планируйте архитектуру перед началом работы

## Соглашения об именовании

- PascalCase – компоненты, страницы
- camelCase – переменные, функции, хуки, свойства
- UPPER\_SNAKE\_CASE – переменные окружения, константы
- kebab-case – имена файлов и URL-роуты

## Настройка окружения

### Требования

- Node.js >= 18.0.0
- npm >= 8.0.0

### Установка

```bash
git clone https://github.com/AntonioPanuchi/newFrontLanding.git
cd newFrontLanding
```

**Backend:**

```bash
cd backend
npm install
cp env.example .env
npm run dev
```

**Frontend:**

```bash
cd ../frontend
npm install
npm run dev
```

## Реализация ключевых функций

### API Backend

- `GET /api/server-statuses` – отдает актуальные или закэшированные данные о серверах
- `GET /api/health` – метрики, аптайм, память, статус
- `POST /api/refresh-cache` – форсирует обновление кэша
- `POST /api/log` – сбор логов с фронта

### UI Frontend

- SPA на React + React Router
- Тема – Context + Tailwind (dark/light)
- SEO – `PageHead` + Helmet
- Логирование – `logFrontend()` → POST /api/log
- Компоненты – Header, Hero, Footer, Servers, FAQ, и т.д.
- Документация через Storybook

```.env
# Обязательные переменные окружения
GERMANY_API_URL=https://rvpn.rox-net.ru:33000/Y2u3mwGrRKU3aeh
USA_API_URL=https://rvpn2.rox-net.ru:33000/Y2u3mwGrRKU3aeh
FINLAND_API_URL=https://rvpn3.rox-net.ru:33000/Y2u3mwGrRKU3aeh
USERNAME=aw775hats0on
PASSWORD=fbhWjpZWw9a6TmaeRKP4YV98K8Rcmm3BSPHs1ujXGkJEK6bYC1IkBuK0hECiLtHV

# Опциональные переменные окружения
PORT=3000
NODE_ENV=production
LOG_LEVEL=info

# Хосты для пинга (опционально)
PINGHOST1=103.7.55.165
PINGHOST2=167.224.64.248
PINGHOST3=46.8.71.6

# CORS настройки
ALLOWED_ORIGIN=https://rx-test.ru

# Настройки кэширования (в миллисекундах)
CACHE_DURATION=60000
COOKIE_CACHE_DURATION=3300000

# Настройки rate limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=3000

# Таймауты (в миллисекундах)
LOGIN_TIMEOUT=10000
PING_TIMEOUT=5000
FETCH_TIMEOUT=10000

# Настройки логирования
LOG_FILE_MAX_SIZE=10485760
LOG_FILE_MAX_FILES=5 
```