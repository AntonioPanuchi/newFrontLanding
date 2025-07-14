# ROX VPN API

**ROX VPN API** — комплексное решение для мониторинга и управления статусом VPN-серверов с современным веб-интерфейсом.

---

## 🚀 Возможности

- Мониторинг статуса VPN серверов в реальном времени
- API для получения информации о серверах
- Кэширование и логирование
- Rate limiting и CORS
- Валидация переменных окружения
- Современный UI (Vite + React + TailwindCSS)
- Storybook для UI-компонентов

---

## 🛠️ Технологии

- **Backend:** Node.js, Express
- **Frontend:** React, Vite, TailwindCSS, Storybook
- **CI/CD:** GitHub Actions, PM2
- **Тесты:** Jest, ESLint, Prettier

---

## 📋 Требования

- Node.js >= 16.0.0
- npm >= 8.0.0

---

## ⚡ Установка и запуск

### Backend

```bash
cd backend
npm install
cp env.example .env
# настройте .env
npm run dev      # запуск в режиме разработки
npm start        # запуск в продакшн
```

### Frontend

```bash
cd frontend
npm install
npm run dev      # запуск в режиме разработки (http://localhost:5173)
npm run build    # сборка для продакшн
npm run preview  # предпросмотр сборки
npm run storybook # запуск Storybook (http://localhost:6006)
```

---

## ⚙️ CI/CD

Используйте GitHub Actions для автоматизации тестирования, сборки и деплоя.

Пример workflow (`.github/workflows/ci-cd.yml`):

```yaml
name: CI/CD Pipeline
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 18
      - name: Install backend dependencies
        run: cd backend && npm ci
      - name: Lint backend
        run: cd backend && npm run lint
      - name: Test backend
        run: cd backend && npm test
      - name: Install frontend dependencies
        run: cd frontend && npm ci
      - name: Build frontend
        run: cd frontend && npm run build
  deploy:
    needs: build-and-test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      - name: Deploy to server via SSH
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.SSH_HOST }}
          username: ${{ secrets.SSH_USER }}
          key: ${{ secrets.SSH_KEY }}
          port: ${{ secrets.SSH_PORT }}
          script: |
            cd /var/www/rx_test_ru_usr/data/www/rx-test.ru/newFrontLanding
            git pull
            ./deploy.sh quick
```

---

## 📝 Доступные скрипты

### Backend
- `npm run dev` — разработка
- `npm start` — продакшн
- `npm test` — тесты
- `npm run lint` — линтинг
- `npm run format` — форматирование

### Frontend
- `npm run dev` — разработка
- `npm run build` — сборка
- `npm run preview` — предпросмотр
- `npm run storybook` — Storybook

---

## 🔌 API

- `GET /api/server-statuses` — статусы серверов
- `GET /health` — здоровье сервиса

Примеры запросов:

```bash
curl https://rx-test.ru/api/server-statuses
curl https://rx-test.ru/health
```

Примеры ответов:

```json
{
  "servers": [
    {
      "name": "Germany",
      "status": "online",
      "uptime": "5д 12ч 30м",
      "ping": 45,
      "users": 1250,
      "lastUpdate": "2024-01-15T10:30:00Z"
    }
  ],
  "lastUpdate": "2024-01-15T10:30:00Z"
}
```

---

## 🏗️ Структура проекта

```
├── frontend/                 # Фронтенд (Vite + React)
│   ├── .storybook/           # Конфиги Storybook
│   ├── css/                  # Стили
│   ├── dist/                 # Сборка фронта
│   ├── examples/             # Примеры
│   ├── js/                   # JS-модули
│   ├── node_modules/         # Зависимости
│   ├── src/                  # Исходный код (React)
│   ├── index.html            # Точка входа
│   ├── index-redesigned.html # Альтернативная версия
│   ├── index-original.html   # Оригинальная версия
│   ├── package.json          # Скрипты и зависимости
│   ├── postcss.config.js     # PostCSS конфиг
│   ├── tailwind.config.js    # Tailwind конфиг
│   ├── tsconfig.json         # TypeScript конфиг
│   └── vite.config.ts        # Vite конфиг
├── backend/                  # Бэкенд (Node.js)
│   ├── logs/                 # Логи
│   ├── node_modules/         # Зависимости
│   ├── src/                  # Исходный код
│   ├── env.example           # Пример .env
│   ├── eslint.config.js      # ESLint конфиг
│   ├── package.json          # Скрипты и зависимости
│   ├── server.js             # Точка входа
│   ├── utils.js              # Утилиты
│   └── .prettierrc           # Prettier конфиг
├── .gitignore                # Исключения Git
├── deploy.sh                 # Скрипт деплоя
├── ecosystem.config.js       # PM2 конфиг
├── package.json              # Корневой package.json (если есть)
├── README.md                 # Документация
```

---

## 🧪 Тестирование

```bash
npm test
npm run test:coverage
npm run test:watch
```

---

## 🔒 Безопасность

- Rate limiting: 3000 запросов/мин
- CORS
- Валидация переменных окружения
- Логирование

---

## 📈 Аналитика и метрики

- Google Analytics 4
- Core Web Vitals

---

## 🤝 Вклад в проект

1. Форкните репозиторий
2. Создайте ветку
3. Откройте Pull Request

---

## 📄 Лицензия и автор

ISC License  
**Antonio Panuchi** — [GitHub](https://github.com/AntonioPanuchi)

---

## 🐛 Поддержка

Вопросы и баги — через Issues на GitHub. 