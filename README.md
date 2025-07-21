# 📘 Документация по агентам проекта `newFrontLanding`

## 🔰 Общее описание

Этот документ описывает программных агентов, участвующих в разработке проекта [newFrontLanding](https://github.com/AntonioPanuchi/newFrontLanding). Каждый агент выполняет специализированные задачи в рамках архитектуры проекта. Документация служит живым контекстом и будет дополняться по мере развития системы.

Полное собрание технических документов перемещено в каталог [docs](./docs).
Дополнительные инструкции смотрите в [API_REFERENCE.md](docs/API_REFERENCE.md) и
[DEPLOYMENT.md](docs/DEPLOYMENT.md).

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
- SEO-оптимизация с динамическими заголовками страниц
- Open Graph и Twitter Card мета-теги

---

## 🛠️ Технологии

- **Backend:** Node.js, Express
- **Frontend:** React, Vite, TailwindCSS, Storybook
- **CI/CD:** GitHub Actions, PM2 *(workflow требует настройки)*
- **Линтинг/Форматирование:** ESLint, Prettier (только backend)

---

## 📋 Требования

- Node.js >= 18.0.0 (рекомендуется 18.x или выше)
- npm >= 8.0.0

> **Важно:** Проект требует Node.js 18+. Код содержит полифилл `node-fetch` для старых версий Node, однако официальная поддержка Node.js 16 и 17 прекращена.
>
> 📖 Подробнее о совместимости: [COMPATIBILITY.md](./docs/COMPATIBILITY.md)

---

## ⚡ Установка и запуск

### Backend

```bash
cd backend
npm install
cp env.example .env
# внесите реальные значения в .env (API URL, TELEGRAM_BOT_TOKEN, JWT_SECRET и др.)
# подробнее о переменных смотрите в [docs/ENVIRONMENT.md](docs/ENVIRONMENT.md)
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

*Ниже приведён пример workflow для GitHub Actions. Создайте файл `.github/workflows/ci-cd.yml` в своём репозитории и адаптируйте его под свои нужды.*

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
- `npm run lint` — линтинг
- `npm run lint:fix` — автоисправление
- `npm run format` — форматирование
- `npm run format:check` — проверка форматирования
- `npm run security:audit` — аудит зависимостей
- `npm run security:fix` — автоисправление уязвимостей
- `npm run clean` — очистка логов
- `npm run logs` — просмотр логов
- `npm run pm2:*` — управление процессом через PM2
- `npm run validate` — линтинг + проверка форматирования

### Frontend
- `npm run dev` — разработка
- `npm run build` — сборка
- `npm run preview` — предпросмотр
- `npm run storybook` — Storybook
- `npm run build-storybook` — сборка Storybook
- `npm run update-frontend` — сборка фронтенда и перезапуск сервера

### Управление зависимостями
- `./clean-dependencies.sh` — очистка неиспользуемых зависимостей
- `./check-node-version.sh` — проверка совместимости Node.js

### Тестирование
- `node test-fetch.js` — тестирование fetch API
- `node test-polyfill-logic.js` — тестирование логики полифилла

---

## 🔌 API

Полное описание эндпоинтов приведено в [docs/API_REFERENCE.md](docs/API_REFERENCE.md).

- `GET /api/server-statuses` — статусы серверов
- `POST /api/refresh-cache` — принудительное обновление кэша
- `GET /api/health` — здоровье сервиса
- `POST /api/refresh-cache` — ручное обновление кэша статусов
- `POST /api/log` — фронтенд‑логирование


Примеры запросов:

```bash
curl https://rx-test.ru/api/server-statuses
curl https://rx-test.ru/api/health
curl -X POST https://rx-test.ru/api/refresh-cache
curl -X POST https://rx-test.ru/api/log -d '{"level":"info","message":"hi"}' -H "Content-Type: application/json"
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
│   ├── config/               # Конфигурация и сервисы
│   ├── middleware/           # Middleware Express
│   ├── routes/               # Маршруты API
│   ├── utils/                # Вспомогательные модули
│   ├── logs/                 # Логи
│   ├── env.example           # Пример .env
│   ├── eslint.config.js      # ESLint конфиг
│   ├── package.json          # Скрипты и зависимости
│   ├── server.js             # Точка входа
│   └── .prettierrc           # Prettier конфиг
├── .gitignore                # Исключения Git
├── deploy.sh                 # Скрипт деплоя
├── ecosystem.config.js       # PM2 конфиг
├── package.json              # Корневой package.json
├── README.md                 # Документация
```

---

## 📦 Фронтенд-агент 🟦

**Роль:**
Разработка пользовательского интерфейса, отрисовка компонентов и взаимодействие с API.

**Входные данные:**
- JSON от API `/api/server-statuses`
- UI/UX-требования

**Выходные данные:**
- JSX-компоненты, HTML-структура, стили
- SEO-метаданные через PageHead

**Основные действия:**
- Реализация компонентов
- Получение данных от API
- Интеграция с роутингом, темами, состояниями

**Инструменты:**
React, Vite, TailwindCSS, React Router, HelmetProvider, Storybook

**Зависимости:**
- Бэкенд-агент (для данных)
- Агент документации и SEO (для метаданных)

**Примеры взаимодействия:**
- Обновление `<ServerCard />` после изменения API
- Отображение новых серверов на домашней странице

**Связанные файлы:**
- `frontend/src/components/ServerCard.tsx`
- `frontend/src/routes/Home.tsx`

**Контрольные точки:**
- Время отрисовки < 100ms
- Storybook покрытие компонентов ≥ 90%

---

## ⚙️ Бэкенд-агент 🟥

**Роль:**
Обработка запросов, предоставление данных для UI, мониторинг состояния серверов.

**Входные данные:**
- HTTP-запросы (например, GET `/api/server-statuses`)

**Выходные данные:**
- JSON-ответы со статусами серверов
- Логи в Winston

**Основные действия:**
- Пинг серверов
- Кеширование и выдача статусов
- Обработка ошибок

**Инструменты:**
Node.js, Express, Winston, Ping, node-fetch

**Зависимости:**
- Фронтенд-агент (использует данные)
- Агент тестирования (валидирует логику)

**Примеры взаимодействия:**
- Возвращает список серверов по API
- Логирует сбои соединения

**Связанные файлы:**
- `backend/routes/status.js`
- `backend/services/pingService.js`

**Контрольные точки:**
- API отклик < 300мс
- Аптайм API ≥ 99.9%

---

## 🚀 DevOps-агент 🟨

**Роль:**
Автоматизация процессов сборки, тестирования и деплоя проекта.

**Входные данные:**
- Git push, Pull Request

**Выходные данные:**
- CI-отчёты, билд-артефакты
- Деплой на сервер

**Основные действия:**
- Настройка workflow
- Выполнение shell-скриптов деплоя

**Инструменты:**
GitHub Actions, Appleboy SSH, PM2, deploy.sh

**Зависимости:**
- Все агенты (участвуют в пайплайне)

**Примеры взаимодействия:**
- Деплой фронта и бэка на push в `main`

**Связанные файлы:**
- `.github/workflows/ci.yml` *(пример конфигурации)*
- `deploy.sh`

**Контрольные точки:**
- Успешные билды ≥ 95%
- Время деплоя < 60 секунд

---

## 🧪 Агент тестирования 🟪

**Роль:**
Проверка корректности функционала с помощью автотестов.

**Входные данные:**
- Исходный код
- JSON от API

**Выходные данные:**
- Отчёты об успешности или сбоях тестов

**Основные действия:**
- Запуск unit и интеграционных тестов
- Проверка бизнес-логики

**Инструменты:**
Node.js, assert, собственные скрипты

**Зависимости:**
- Бэкенд и фронтенд агенты

**Примеры взаимодействия:**
- Запуск `test-fetch.js` после обновления API

**Связанные файлы:**
- `test-fetch.js`

**Контрольные точки:**
- Покрытие кода ≥ 80%
- Отчёты без ошибок в CI

---

## 🔍 Агент качества и безопасности 🟫

**Роль:**
Обеспечение читаемости, безопасности и совместимости кода.

**Входные данные:**
- Исходный код

**Выходные данные:**
- Отчёты линтинга и аудита

**Основные действия:**
- ESLint, Prettier, npm audit
- Исправление проблем

**Инструменты:**
ESLint, Prettier, npm audit

**Зависимости:**
- DevOps-агент (для CI)

**Примеры взаимодействия:**
- CI отклоняет PR с ошибками линтера

**Связанные файлы:**
- `.eslintrc`, `.prettierrc`

**Контрольные точки:**
- Ошибки линтера = 0
- Актуальность зависимостей ≥ 95%

---

## 📘 Агент документации и SEO 🟩

**Роль:**
Ведение технической и SEO-документации, генерация метатегов.

**Входные данные:**
- Контент страниц, заголовки, изображения

**Выходные данные:**
- Markdown-документация, SEO-теги

**Основные действия:**
- Обновление README, SEO_SUMMARY
- Создание `<PageHead />`

**Инструменты:**
Markdown, Helmet, Storybook

**Зависимости:**
- Фронтенд-агент (использует SEO-компоненты)

**Примеры взаимодействия:**
- Настройка метатегов при добавлении новой страницы

**Связанные файлы:**
- `frontend/src/components/PageHead.tsx`
- `docs/SEO_SUMMARY.md`
- `docs/API_ROUTES.md`

**Контрольные точки:**
- Lighthouse SEO ≥ 90
- Полное описание всех маршрутов

---

> 🧠 *Документ является живым. Новые агенты и изменения добавляются по мере развития проекта.*


## 🔒 Безопасность

- Rate limiting: 3000 запросов/мин
- CORS
- Валидация переменных окружения
- Логирование

---

## 📈 Аналитика и метрики

*Google Analytics 4, Core Web Vitals — требуют отдельной настройки и интеграции.*

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
