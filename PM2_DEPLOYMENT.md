# ROX VPN API - Деплой через PM2

## Обзор

Приложение теперь развертывается через PM2 вместо Docker. Это обеспечивает более простую настройку и управление процессом.

## Требования

- Node.js 18+
- npm
- PM2

## Установка PM2

```bash
npm install -g pm2
```

## Структура проекта

```
newFrontLanding/
├── backend/           # Backend приложение
│   ├── server.js     # Основной сервер
│   ├── package.json  # Зависимости
│   └── .env         # Переменные окружения
├── frontend/         # Frontend файлы
├── ecosystem.config.js # Конфигурация PM2
├── deploy.sh         # Скрипт деплоя
└── logs/            # Логи приложения
```

## Конфигурация

### Переменные окружения

Создайте файл `backend/.env` на основе `backend/env.example`:

```env
# URL API серверов VPN
GERMANY_API_URL=https://germany-vpn.example.com
USA_API_URL=https://usa-vpn.example.com
FINLAND_API_URL=https://finland-vpn.example.com

# Учетные данные
USERNAME=your_username_here
PASSWORD=your_password_here

# Хосты для ping (опционально)
PINGHOST1=google.com
PINGHOST2=cloudflare.com
PINGHOST3=github.com
```

## Команды деплоя

### Полный деплой
```bash
./deploy.sh deploy
```

### Быстрый деплой (только перезапуск)
```bash
./deploy.sh quick
```

### Остановка сервисов
```bash
./deploy.sh stop
```

### Просмотр логов
```bash
./deploy.sh logs
```

### Проверка здоровья
```bash
./deploy.sh health
```

### Очистка логов
```bash
./deploy.sh cleanup
```

## Управление через PM2

### Статус приложения
```bash
pm2 status
```

### Просмотр логов
```bash
pm2 logs rox-vpn-api
```

### Перезапуск
```bash
pm2 restart rox-vpn-api
```

### Остановка
```bash
pm2 stop rox-vpn-api
```

### Удаление
```bash
pm2 delete rox-vpn-api
```

## Автозапуск

PM2 настроен на автозапуск при перезагрузке системы:

```bash
pm2 save
pm2 startup
```

## API Endpoints

- **Health Check**: `GET /health`
- **Server Statuses**: `GET /api/server-statuses`
- **Refresh Cache**: `POST /api/refresh-cache`

## Логи

Логи сохраняются в директории `logs/`:
- `pm2-error.log` - ошибки
- `pm2-out.log` - стандартный вывод
- `pm2-combined.log` - все логи

## Мониторинг

PM2 предоставляет встроенный мониторинг:

```bash
pm2 monit
```

## Troubleshooting

### Приложение не запускается
1. Проверьте логи: `pm2 logs rox-vpn-api`
2. Проверьте переменные окружения в `backend/.env`
3. Убедитесь, что порт 3000 свободен

### Ошибки подключения к VPN серверам
1. Проверьте URL серверов в `.env`
2. Проверьте учетные данные
3. Убедитесь, что серверы доступны

### Проблемы с ping
- Ping использует HTTP HEAD запросы
- Убедитесь, что ping хосты имеют открытые HTTP порты
- Можно использовать публичные домены (google.com, cloudflare.com) 