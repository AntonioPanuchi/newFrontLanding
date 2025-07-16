# ROX VPN API – Справочник эндпоинтов

Этот документ описывает доступные маршруты backend сервера и примерные ответы.

## Основные эндпоинты

### GET `/api/server-statuses`

Ответ:

```json
{
  "servers": [
    {
      "name": "Germany",
      "status": "online",
      "uptime": "5d 12h 30m",
      "ping": 45,
      "users": 1250,
      "lastUpdate": "2024-01-15T10:30:00Z"

    }
  ],
  "lastUpdate": "2024-01-15T10:30:00Z"
}
```


Принудительно обновляет кэш статусов серверов.

Пример ответа при успехе:

### POST `/api/refresh-cache`

Ответ при успехе:

```json
{
  "success": true,
  "message": "Cache refreshed successfully",

  "data": [ /* актуальные статусы */ ]
}
```

### GET `/api/health`
Проверка состояния сервера и кэша.

Ответ:
```json
{
  "status": "OK",
  "uptime": 123.45,
  "timestamp": "2024-01-15T10:40:00Z",
  "version": "1.0.0",
  "cache": {
    "servers": 3,
    "lastUpdate": "2024-01-15T10:30:00Z",
    "cacheAge": 60000
  },
  "memory": {
    "used": 50,
    "total": 120
  }
}
```

Эндпоинты доступны по умолчанию на `http://localhost:3000`. Порт и другие параметры можно настроить через [переменные окружения](ENVIRONMENT.md).
=======
  "timestamp": "2024-01-15T10:30:00Z",
  "cache": {
    "servers": 3,
    "lastUpdate": "2024-01-15T10:30:00Z",
    "cacheAge": 1000

### POST `/api/log`
Позволяет фронтенду отправлять сообщения в систему логирования.
Тело запроса:
```json
{ "level": "info", "message": "Hello", "meta": {}} 
```
Ответ: `204 No Content`.

## Примечания
- Все маршруты префиксируются `/api` в `server.js`.
- Сервис использует кэш для ускорения ответов. Время жизни кэша регулируется переменными окружения.
