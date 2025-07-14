# Руководство по развертыванию улучшенного интерфейса мониторинга серверов

## 🚀 Быстрый старт

### 1. Проверка зависимостей
Убедитесь, что у вас установлены все необходимые зависимости:

```bash
# В корневой директории проекта
npm install

# В директории backend
cd backend
npm install
```

### 2. Настройка переменных окружения
Скопируйте файл с примерами переменных окружения:

```bash
cd backend
cp env.example .env
```

Заполните `.env` файл необходимыми данными:
```env
# API URLs для серверов
GERMANY_API_URL=https://your-germany-server.com
USA_API_URL=https://your-usa-server.com
FINLAND_API_URL=https://your-finland-server.com

# Учетные данные для доступа к API
USERNAME=your_username
PASSWORD=your_password

# Хосты для проверки пинга (опционально)
PINGHOST1=germany-server.com
PINGHOST2=usa-server.com
PINGHOST3=finland-server.com

# Настройки сервера
PORT=3000
NODE_ENV=production
LOG_LEVEL=info
```

### 3. Сборка фронтенда
Соберите CSS файлы:

```bash
# В корневой директории проекта
npm run build:css
```

### 4. Запуск сервера
Запустите backend сервер:

```bash
cd backend
npm start
```

Или используйте PM2 для production:

```bash
cd backend
pm2 start ecosystem.config.js
```

## 📁 Структура файлов

```
newFrontLanding/
├── frontend/
│   ├── index.html                 # Основная страница
│   ├── js/
│   │   └── server-status.js       # Улучшенный JS для мониторинга
│   ├── dist/
│   │   ├── output.css             # Tailwind CSS
│   │   └── neomorphic-styles.css  # Дополнительные стили
│   └── examples/
│       └── enhanced-server-monitoring.html  # Демо страница
├── backend/
│   ├── server.js                  # API сервер
│   ├── package.json
│   └── ecosystem.config.js        # PM2 конфигурация
├── UI_UX_IMPROVEMENTS.md          # Документация улучшений
└── DEPLOYMENT_GUIDE.md            # Это руководство
```

## 🔧 Конфигурация

### Настройка API endpoints
В файле `frontend/js/server-status.js` настройте URL для API:

```javascript
window.serverManager = new ServerStatusManager({
    apiUrl: '/api/server-statuses',  // Измените на ваш endpoint
    updateInterval: 30000,           // Интервал обновления в мс
    enableAnalytics: true
});
```

### Настройка фильтров
В файле `frontend/index.html` настройте фильтры по регионам:

```html
<select id="region-filter">
    <option value="all">Все регионы</option>
    <option value="germany">🇩🇪 Германия</option>
    <option value="usa">🇺🇸 США</option>
    <option value="finland">🇫🇮 Финляндия</option>
    <!-- Добавьте свои регионы -->
</select>
```

### Настройка цветов регионов
В файле `frontend/js/server-status.js` настройте цвета для регионов:

```javascript
getRegionColor(name) {
    const region = this.getRegionFromName(name);
    const colors = {
        'germany': '#ff6b6b',
        'usa': '#4ecdc4',
        'finland': '#45b7d1',
        'your-region': '#your-color'  // Добавьте свои цвета
    };
    return colors[region] || '#95a5a6';
}
```

## 🎨 Кастомизация дизайна

### Изменение цветовой схемы
Отредактируйте файл `frontend/dist/neomorphic-styles.css`:

```css
:root {
    /* Основные цвета */
    --primary-500: #3b82f6;  /* Измените на ваш цвет */
    --success-500: #22c55e;  /* Цвет для онлайн статуса */
    --error-500: #ef4444;    /* Цвет для офлайн статуса */
    --warning-500: #f59e0b;  /* Цвет для ошибок */
}
```

### Изменение анимаций
Настройте анимации в CSS:

```css
/* Скорость анимаций */
--transition-fast: 0.15s ease;
--transition-normal: 0.3s ease;
--transition-slow: 0.5s ease;

/* Анимация появления карточек */
.enhanced-server-card {
    animation: slideInUp 0.6s ease forwards;
}
```

## 📱 Адаптивность

### Мобильные устройства
Стили автоматически адаптируются под мобильные устройства:

```css
@media (max-width: 768px) {
    .server-grid {
        grid-template-columns: 1fr;  /* Одна колонка */
    }
    
    .enhanced-filters .grid {
        grid-template-columns: 1fr;  /* Фильтры в столбец */
    }
}
```

### Планшеты
```css
@media (min-width: 769px) and (max-width: 1024px) {
    .server-grid {
        grid-template-columns: repeat(2, 1fr);  /* Две колонки */
    }
}
```

## 🔍 Отладка

### Проверка API
Убедитесь, что API возвращает правильный формат данных:

```bash
curl http://localhost:3000/api/server-statuses
```

Ожидаемый ответ:
```json
[
    {
        "name": "Germany - Frankfurt",
        "status": "online",
        "ping_ms": 45,
        "users_online": 1234,
        "cpu_load": 23,
        "uptime": "15d 23h 45m"
    }
]
```

### Проверка консоли браузера
Откройте Developer Tools (F12) и проверьте:
- Нет ли ошибок JavaScript
- Правильно ли загружаются CSS файлы
- Работают ли API запросы

### Логи сервера
Проверьте логи backend сервера:

```bash
# Если используете PM2
pm2 logs

# Если запускаете напрямую
cd backend
npm start
```

## 🚀 Production развертывание

### 1. Настройка Nginx
Создайте конфигурацию Nginx:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    # Фронтенд
    location / {
        root /var/www/rx-test.ru/newFrontLanding/frontend;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
    
    # API
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 2. Настройка PM2
Используйте PM2 для управления процессом:

```bash
# Установка PM2
npm install -g pm2

# Запуск приложения
cd backend
pm2 start ecosystem.config.js

# Автозапуск при перезагрузке
pm2 startup
pm2 save
```

### 3. SSL сертификат
Настройте SSL с Let's Encrypt:

```bash
# Установка Certbot
sudo apt install certbot python3-certbot-nginx

# Получение сертификата
sudo certbot --nginx -d your-domain.com
```

## 📊 Мониторинг

### Метрики производительности
- Время загрузки страницы: < 2 секунды
- Время ответа API: < 500мс
- Обновление данных: каждые 30 секунд

### Логирование
Логи сохраняются в директории `backend/logs/`:
- `error-YYYY-MM-DD.log` - ошибки
- `combined-YYYY-MM-DD.log` - все логи

### Алерты
Настройте мониторинг для:
- Доступности API
- Времени ответа серверов
- Количества ошибок

## 🔒 Безопасность

### Защита API
- Используйте HTTPS
- Настройте rate limiting
- Валидируйте входные данные
- Логируйте подозрительную активность

### Переменные окружения
- Никогда не коммитьте `.env` файлы
- Используйте разные учетные данные для dev/prod
- Регулярно обновляйте пароли

## 🆘 Устранение неполадок

### Проблема: Карточки не загружаются
**Решение:**
1. Проверьте консоль браузера на ошибки
2. Убедитесь, что API сервер запущен
3. Проверьте URL в конфигурации

### Проблема: Фильтры не работают
**Решение:**
1. Проверьте ID элементов в HTML
2. Убедитесь, что JavaScript загружен
3. Проверьте консоль на ошибки

### Проблема: Анимации не работают
**Решение:**
1. Проверьте загрузку CSS файлов
2. Убедитесь, что браузер поддерживает CSS анимации
3. Проверьте настройки производительности браузера

### Проблема: API возвращает ошибки
**Решение:**
1. Проверьте переменные окружения
2. Убедитесь, что серверы доступны
3. Проверьте логи backend

## 📞 Поддержка

При возникновении проблем:

1. Проверьте документацию в `UI_UX_IMPROVEMENTS.md`
2. Изучите логи сервера
3. Проверьте консоль браузера
4. Убедитесь, что все зависимости установлены

## 🔄 Обновления

Для обновления интерфейса:

1. Остановите сервер: `pm2 stop all`
2. Обновите код из репозитория
3. Установите новые зависимости: `npm install`
4. Пересоберите CSS: `npm run build:css`
5. Запустите сервер: `pm2 start all`

## 📈 Аналитика

Для отслеживания использования:

1. Настройте Google Analytics
2. Добавьте логирование пользовательских действий
3. Мониторьте производительность API
4. Отслеживайте ошибки в реальном времени 