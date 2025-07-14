# ROX VPN API

Backend сервис для мониторинга статуса VPN серверов и предоставления данных в реальном времени.

## 🚀 Возможности

- Мониторинг статуса VPN серверов в реальном времени
- API для получения информации о серверах
- Кэширование данных для оптимизации производительности
- Логирование всех операций
- Rate limiting для защиты от DDoS
- CORS настройки для веб-клиентов
- **Валидация переменных окружения при запуске**

## 🎨 UI/UX Улучшения

### Доступность (Accessibility)
- ✅ ARIA-атрибуты для FAQ и навигации
- ✅ Skip-link для клавиатурной навигации
- ✅ Поддержка screen readers
- ✅ Focus states для всех интерактивных элементов
- ✅ Поддержка high-contrast и reduced-motion

### Производительность
- ✅ Preload критических ресурсов (CSS, шрифты)
- ✅ Defer для не-критических скриптов
- ✅ Минификация CSS через Tailwind
- ✅ Оптимизация анимаций с will-change
- ✅ Lazy loading для изображений

### Визуальный дизайн
- ✅ Тёмный режим с toggle-кнопкой
- ✅ Parallax-эффекты для blur-ball
- ✅ Анимированные градиенты
- ✅ Улучшенная типографика
- ✅ Hover-эффекты и микроанимации

### Пользовательский опыт
- ✅ Smooth scrolling между секциями
- ✅ Swipe-жесты для мобильной навигации
- ✅ A/B-тестирование CTA-кнопок
- ✅ Система уведомлений
- ✅ Loading states для интерактивных элементов

### SEO и аналитика
- ✅ Schema.org markup для FAQ
- ✅ Google Analytics 4 интеграция
- ✅ Улучшенные meta-теги
- ✅ Трекинг конверсий и engagement
- ✅ Error tracking и fallback режимы

## 📋 Требования

- Node.js >= 16.0.0
- npm >= 8.0.0

## 🛠️ Установка

1. Клонируйте репозиторий:
```bash
git clone https://github.com/AntonioPanuchi/newFrontLanding.git
cd newFrontLanding
```

2. Перейдите в папку backend и установите зависимости:
```bash
cd backend
npm install
```

3. Создайте файл `.env` на основе `env.example`:
```bash
cp env.example .env
```

4. Настройте переменные окружения в файле `.env`:
```env
# Порт сервера
PORT=3000

# Уровень логирования
LOG_LEVEL=info

# Режим работы
NODE_ENV=development

# URL API серверов
GERMANY_API_URL=https://germany-vpn.example.com
USA_API_URL=https://usa-vpn.example.com
FINLAND_API_URL=https://finland-vpn.example.com

# Учетные данные для API
USERNAME=your_username
PASSWORD=your_password

# Хосты для пинга
PINGHOST1=germany-vpn.example.com
PINGHOST2=usa-vpn.example.com
PINGHOST3=finland-vpn.example.com

# CORS настройки
ALLOWED_ORIGIN=https://rx-test.ru

# Google Analytics ID (опционально)
GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

## 🔍 Валидация переменных окружения

При запуске приложения автоматически выполняется валидация всех переменных окружения:

### Обязательные переменные
- `GERMANY_API_URL`, `USA_API_URL`, `FINLAND_API_URL` - должны быть валидными HTTP/HTTPS URL
- `USERNAME` - минимум 3 символа
- `PASSWORD` - минимум 8 символов

### Опциональные переменные
- `PORT` - число от 1 до 65535 (по умолчанию: 3000)
- `NODE_ENV` - одно из: development, production, test (по умолчанию: development)
- `LOG_LEVEL` - одно из: error, warn, info, debug (по умолчанию: info)
- `GA_MEASUREMENT_ID` - ID Google Analytics для трекинга

### Примеры ошибок валидации
```bash
# Неверный URL
Environment variables validation failed: GERMANY_API_URL URL is not a valid URL: invalid-url

# Слишком короткий пароль
Environment variables validation failed: PASSWORD must be at least 8 characters long

# Неверный порт
Environment variables validation failed: PORT must be a number between 1 and 65535, got: 99999

# Неверный уровень логирования
Environment variables validation failed: LOG_LEVEL must be one of: error, warn, info, debug, got: invalid
```

При ошибке валидации приложение завершается с кодом 1 и выводит подробное сообщение об ошибке.

## 🚀 Запуск

### Разработка
```bash
cd backend
npm run dev
```

### Продакшн
```bash
cd backend
npm start
```

### Сборка фронтенда
```bash
# Минификация CSS
npm run build:css

# Полная сборка
npm run build:prod
```

### PM2 (рекомендуется)
```bash
# Быстрое развертывание
./deploy.sh quick

# Полное развертывание с проверками
./deploy.sh deploy

# Остановка сервисов
./deploy.sh stop

# Просмотр логов
./deploy.sh logs
```

### Ручное развертывание с PM2
```bash
# Установка PM2 (если не установлен)
npm install -g pm2

# Запуск приложения
pm2 start ecosystem.config.js

# Проверка статуса
pm2 status
```

## 📝 Доступные скрипты

### Backend скрипты
- `npm start` - Запуск в продакшн режиме
- `npm run dev` - Запуск в режиме разработки с автоперезагрузкой
- `npm test` - Запуск тестов
- `npm run test:watch` - Запуск тестов в режиме наблюдения
- `npm run test:coverage` - Запуск тестов с отчетом о покрытии
- `npm run test:integration` - Запуск интеграционных тестов
- `npm run lint` - Проверка кода с ESLint
- `npm run lint:fix` - Автоисправление ошибок ESLint
- `npm run format` - Форматирование кода с Prettier
- `npm run format:check` - Проверка форматирования
- `npm run security:audit` - Проверка безопасности зависимостей
- `npm run security:fix` - Автоисправление уязвимостей
- `npm run clean` - Очистка логов
- `npm run logs` - Просмотр логов в реальном времени
- `npm run validate` - Полная проверка кода (lint + format + tests)

### Frontend скрипты
- `npm run build:css` - Минификация Tailwind CSS
- `npm run build:js` - Минификация JavaScript (планируется)
- `npm run build:prod` - Полная сборка для продакшна

### PM2 скрипты
- `npm run pm2:start` - Запуск приложения через PM2
- `npm run pm2:stop` - Остановка приложения
- `npm run pm2:restart` - Перезапуск приложения
- `npm run pm2:logs` - Просмотр логов PM2
- `npm run pm2:status` - Статус приложения

### Скрипты развертывания
- `./deploy.sh deploy` - Полное развертывание
- `./deploy.sh quick` - Быстрое развертывание
- `./deploy.sh stop` - Остановка сервисов
- `./deploy.sh logs` - Просмотр логов
- `./deploy.sh health` - Проверка здоровья
- `./deploy.sh cleanup` - Очистка логов

## 🔌 API Endpoints

### GET /api/server-statuses
Получение статуса всех серверов

**Ответ:**
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

### GET /health
Проверка здоровья сервиса

**Ответ:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00Z",
  "uptime": "5д 12ч 30м"
}
```

## 📊 Логирование

Логи сохраняются в директории `logs/`:
- `combined.log` - Все логи
- `error.log` - Только ошибки

## 🔒 Безопасность

- Rate limiting: 3000 запросов в минуту
- CORS настроен для разрешенных доменов
- Валидация переменных окружения
- Логирование всех запросов

## 🧪 Тестирование

```bash
# Запуск всех тестов
npm test

# Запуск тестов с покрытием
npm run test:coverage

# Запуск тестов в режиме наблюдения
npm run test:watch

# Lighthouse audit (вручную)
# Откройте Chrome DevTools → Lighthouse → Run audit
```

## 📈 Аналитика и метрики

### Google Analytics 4
- Трекинг page views и user sessions
- Конверсии CTA-кнопок
- Взаимодействие с FAQ
- Scroll depth и time on page
- Error tracking

### Core Web Vitals
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Cumulative Layout Shift (CLS)
- First Input Delay (FID)

## 📁 Структура проекта

```
├── frontend/                 # Фронтенд файлы
│   ├── index.html           # Главная страница
│   ├── style.css            # Основные стили
│   ├── enhanced-animations.css # Анимации
│   ├── readability-enhancements.css # Улучшения доступности
│   ├── dist/                # Собранные файлы
│   │   └── output.css       # Минифицированный Tailwind CSS
│   ├── src/                 # Исходные файлы
│   │   └── input.css        # Tailwind input
│   └── js/                  # JavaScript модули
│       ├── enhanced-features.js # Основные функции
│       ├── interactive-map.js # Интерактивная карта
│       ├── enhanced-mobile-nav.js # Мобильная навигация
│       └── server-status.js # Статус серверов
├── backend/                 # Бэкенд файлы
│   ├── src/                 # Исходный код
│   │   ├── app.js           # Основное приложение
│   │   ├── server.js        # Точка входа сервера
│   │   ├── controllers/     # Контроллеры
│   │   ├── services/        # Бизнес-логика
│   │   ├── routes/          # Маршруты API
│   │   ├── middleware/      # Middleware
│   │   └── utils/           # Утилиты
│   ├── package.json         # Зависимости и скрипты
│   ├── logs/                # Директория для логов
│   └── __tests__/           # Тесты
├── docs/                    # Документация
│   └── API.md              # Документация API
├── ecosystem.config.js     # Конфигурация PM2
├── nginx.conf              # Конфигурация Nginx
├── deploy.sh               # Скрипт развертывания
├── .gitignore              # Исключения Git
└── README.md               # Документация
```

## 🤝 Вклад в проект

1. Форкните репозиторий
2. Создайте ветку для новой функции (`git checkout -b feature/amazing-feature`)
3. Зафиксируйте изменения (`git commit -m 'Add amazing feature'`)
4. Отправьте в ветку (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

## 📄 Лицензия

Этот проект лицензирован под ISC License.

## 👨‍💻 Автор

**Antonio Panuchi**
- GitHub: [@AntonioPanuchi](https://github.com/AntonioPanuchi)

## 🐛 Поддержка

Если у вас есть вопросы или проблемы, создайте issue в репозитории. 