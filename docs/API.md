# ROX VPN API Documentation

## Обзор

ROX VPN API предоставляет RESTful интерфейс для получения статуса VPN серверов в реальном времени.

**Base URL:** `https://rx-test.ru/api`

## Аутентификация

В настоящее время API не требует аутентификации для публичных endpoints. Для защищенных endpoints может потребоваться API ключ в заголовке `X-API-Key`.

## Endpoints

### 1. Получение статуса серверов

**GET** `/server-statuses`

Возвращает статус всех VPN серверов.

#### Параметры запроса

Нет

#### Пример запроса

```bash
curl -X GET "https://rx-test.ru/api/server-statuses" \
  -H "Content-Type: application/json"
```

#### Пример ответа

```json
{
  "success": true,
  "data": {
    "servers": [
      {
        "name": "Germany",
        "status": "online",
        "uptime": "5д 12ч 30м",
        "ping": 45,
        "users": 1250,
        "lastUpdate": "2024-01-15T10:30:00Z"
      },
      {
        "name": "USA",
        "status": "online",
        "uptime": "3д 8ч 15м",
        "ping": 120,
        "users": 890,
        "lastUpdate": "2024-01-15T10:30:00Z"
      },
      {
        "name": "Finland",
        "status": "offline",
        "uptime": "N/A",
        "ping": "N/A",
        "users": 0,
        "lastUpdate": "2024-01-15T10:30:00Z"
      }
    ],
    "lastUpdate": "2024-01-15T10:30:00Z"
  },
  "message": "",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

#### Коды статусов

- `200` - Успешный запрос
- `429` - Слишком много запросов (rate limit)
- `500` - Внутренняя ошибка сервера

### 2. Проверка здоровья сервиса

**GET** `/health`

Возвращает статус здоровья API сервиса.

#### Параметры запроса

Нет

#### Пример запроса

```bash
curl -X GET "https://rx-test.ru/api/health" \
  -H "Content-Type: application/json"
```

#### Пример ответа

```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00Z",
  "uptime": "5д 12ч 30м",
  "version": "1.0.0",
  "environment": "production"
}
```

#### Коды статусов

- `200` - Сервис работает нормально
- `503` - Сервис недоступен

## Модели данных

### Server

```json
{
  "name": "string",        // Название сервера
  "status": "string",      // Статус: "online", "offline", "error", "unknown"
  "uptime": "string",      // Время работы в формате "Xd Yh Zm"
  "ping": "number|string", // Пинг в миллисекундах или "N/A"
  "users": "number",       // Количество активных пользователей
  "lastUpdate": "string"   // ISO 8601 timestamp последнего обновления
}
```

### API Response

```json
{
  "success": "boolean",    // Успешность операции
  "data": "object|null",   // Данные ответа
  "message": "string",     // Сообщение (для ошибок)
  "timestamp": "string"    // ISO 8601 timestamp
}
```

## Ограничения

### Rate Limiting

- **Лимит:** 3000 запросов в минуту
- **Заголовки:** `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`
- **Исключения:** Health check endpoint не ограничен

### CORS

Разрешенные origins:
- `https://rx-test.ru`
- `https://www.rx-test.ru`
- `http://localhost:3000`
- `http://127.0.0.1:3000`

## Обработка ошибок

### Стандартный формат ошибки

```json
{
  "error": "string",       // Описание ошибки
  "timestamp": "string",   // ISO 8601 timestamp
  "path": "string"         // Путь запроса
}
```

### Коды ошибок

- `400` - Неверный запрос
- `401` - Не авторизован
- `404` - Ресурс не найден
- `429` - Слишком много запросов
- `500` - Внутренняя ошибка сервера

## Примеры использования

### JavaScript (Fetch API)

```javascript
async function getServerStatuses() {
  try {
    const response = await fetch('https://rx-test.ru/api/server-statuses');
    const data = await response.json();
    
    if (data.success) {
      console.log('Servers:', data.data.servers);
    } else {
      console.error('Error:', data.message);
    }
  } catch (error) {
    console.error('Request failed:', error);
  }
}
```

### Python (requests)

```python
import requests

def get_server_statuses():
    try:
        response = requests.get('https://rx-test.ru/api/server-statuses')
        response.raise_for_status()
        
        data = response.json()
        if data['success']:
            print('Servers:', data['data']['servers'])
        else:
            print('Error:', data['message'])
            
    except requests.exceptions.RequestException as e:
        print('Request failed:', e)
```

### cURL

```bash
# Получение статуса серверов
curl -X GET "https://rx-test.ru/api/server-statuses" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json"

# Проверка здоровья
curl -X GET "https://rx-test.ru/api/health" \
  -H "Content-Type: application/json"
```

## Мониторинг

### Health Check

Для мониторинга доступности API используйте endpoint `/health`:

```bash
# Проверка каждые 30 секунд
watch -n 30 'curl -s https://rx-test.ru/api/health | jq .'
```

### Логи

Логи API доступны в директории `logs/`:
- `logs/combined.log` - Все логи
- `logs/error.log` - Только ошибки
- `logs/pm2-error.log` - Ошибки PM2
- `logs/pm2-out.log` - Вывод PM2

### Метрики

Основные метрики для мониторинга:
- Время ответа API
- Количество запросов в секунду
- Количество ошибок
- Статус серверов VPN

## Поддержка

При возникновении проблем:
1. Проверьте статус сервиса: `GET /health`
2. Изучите логи ошибок
3. Создайте issue в репозитории проекта 