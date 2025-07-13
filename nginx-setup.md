# Настройка nginx для ROX.VPN API

## Проблема
Фронтенд загружается с `https://rx-test.ru`, но API запросы `/api/*` должны обрабатываться Node.js сервером на порту 3000.

## Решение: Настройка nginx

Добавьте в конфигурацию nginx для домена `rx-test.ru`:

```nginx
server {
    listen 80;
    server_name rx-test.ru;
    
    # Проксирование API запросов к Node.js серверу
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Остальная конфигурация для статических файлов и PHP
    # ...
}
```

## Альтернативные решения

### 1. Запуск Node.js на порту 80 (требует sudo)
```bash
# Измените в backend/server.js:
const port = process.env.PORT || 80;

# Запустите с sudo:
sudo npm start
```

### 2. Использование PM2 с правами администратора
```bash
# Установите PM2 глобально
sudo npm install -g pm2

# Запустите с правами администратора
sudo pm2 start backend/server.js --name rox-vpn-api

# Настройте автозапуск
sudo pm2 startup
sudo pm2 save
```

### 3. Использование systemd service
Создайте файл `/etc/systemd/system/rox-vpn-api.service`:

```ini
[Unit]
Description=ROX VPN API Server
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/path/to/your/project/backend
ExecStart=/usr/bin/node server.js
Restart=always
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

Затем:
```bash
sudo systemctl enable rox-vpn-api
sudo systemctl start rox-vpn-api
```

## Проверка работы

После настройки проверьте:

1. **API endpoint работает:**
   ```bash
   curl https://rx-test.ru/api/server-statuses
   ```

2. **Фронтенд загружает данные:**
   - Откройте `https://rx-test.ru`
   - Проверьте консоль браузера (F12)
   - Должны загрузиться карточки серверов

3. **Логи Node.js сервера:**
   ```bash
   tail -f backend/logs/combined.log
   ```

## Текущий статус

- ✅ Node.js сервер работает на порту 3000
- ✅ API endpoint возвращает данные
- ❌ nginx не проксирует `/api/*` запросы к Node.js серверу
- ❌ Фронтенд получает 404 вместо JSON данных 