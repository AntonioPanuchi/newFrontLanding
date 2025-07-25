# API Routes

Этот документ описывает доступные HTTP-эндпойнты backend-сервера ROX VPN API.

## Общая информация

Все маршруты начинаются с префикса `/api` и возвращают данные в формате JSON. При ошибках сервис отвечает объектом вида `{ error, message }`.

## Список маршрутов

### `GET /api/server-statuses`
Возвращает актуальные статусы VPN-серверов.
- **Ответ**: `{ servers: ServerStatus[], lastUpdate: ISOString }`

### `GET /api/health`
Проверка состояния сервера.
- **Ответ**: объект с метаданными, временем работы и информацией о кэше.

### `POST /api/refresh-cache`
Принудительное обновление кэша статусов серверов.
- **Ответ**: `{ success: boolean, message: string, data?: ServerStatus[] }`

### `POST /api/log`
Используется фронтендом для отправки логов на сервер.
- **Тело запроса**: `{ level?: string, message: string, ...meta }`
- **Ответ**: `204 No Content` при успешном приёме.

## Формат `ServerStatus`
```json
{
  "name": "Germany",
  "status": "online",
  "uptime": "5д 12ч 30м",
  "ping": 45,
  "users": 1250,
  "lastUpdate": "2024-01-15T10:30:00Z"
}
```


