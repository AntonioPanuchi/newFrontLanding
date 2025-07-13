# ROX VPN API

Backend сервис для мониторинга статуса VPN серверов и предоставления данных в реальном времени.

## 🚀 Возможности

- Мониторинг статуса VPN серверов в реальном времени
- API для получения информации о серверах
- Кэширование данных для оптимизации производительности
- Логирование всех операций
- Rate limiting для защиты от DDoS
- CORS настройки для веб-клиентов

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
ALLOWED_ORIGIN=https://static.rox-net.ru
```

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

### Docker (рекомендуется)
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

### Ручное развертывание с Docker
```bash
# Сборка образа
docker build -t rox-vpn-api .

# Запуск с Docker Compose
docker-compose up -d

# Проверка статуса
docker-compose ps
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

### Docker скрипты
- `npm run docker:build` - Сборка Docker образа
- `npm run docker:run` - Запуск контейнера
- `npm run docker:compose` - Запуск с Docker Compose
- `npm run docker:compose:down` - Остановка Docker Compose
- `npm run docker:logs` - Просмотр логов контейнеров

### Скрипты развертывания
- `./deploy.sh deploy` - Полное развертывание
- `./deploy.sh quick` - Быстрое развертывание
- `./deploy.sh stop` - Остановка сервисов
- `./deploy.sh logs` - Просмотр логов
- `./deploy.sh health` - Проверка здоровья
- `./deploy.sh cleanup` - Очистка Docker

## 🔌 API Endpoints

### GET /api/status
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
```

## 📁 Структура проекта

```
├── frontend/                 # Фронтенд файлы
│   ├── index.html           # Главная страница
│   ├── style.css            # Стили
│   └── js/                  # JavaScript модули
│       └── server-status.js # Модуль управления статусом серверов
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
├── Dockerfile              # Конфигурация Docker
├── docker-compose.yml      # Docker Compose
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