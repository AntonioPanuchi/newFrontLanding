# ROX VPN API – Справочник эндпоинтов

Ниже перечислены HTTP‑эндпоинты, доступные в ROX VPN API.

## GET `/api/server-statuses`
Возвращает текущие статусы всех VPN‑серверов.

Пример ответа:
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

## POST `/api/refresh-cache`
Принудительно обновляет кэш статусов серверов.

Пример ответа при успехе:
```json
{
  "success": true,
  "message": "Cache refreshed successfully",
  "data": [ /* актуальные статусы */ ]
}
```

## GET `/api/health`
Возвращает информацию о состоянии сервиса и кэша.

Пример ответа:
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

## POST `/api/log`
Принимает логи с фронтенда. Тело запроса должно содержать поля `level` и `message`.
При успешной обработке возвращает статус `204 No Content`.

---

Эндпоинты доступны по умолчанию на `http://localhost:3000`. Порт и другие параметры можно настроить через [переменные окружения](ENVIRONMENT.md).
