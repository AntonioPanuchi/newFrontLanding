#!/bin/bash

# Скрипт для обновления фронтенда ROX VPN
# Usage: PROJECT_PATH=/path/to/newFrontLanding ./update-frontend.sh
#    или: ./update-frontend.sh /path/to/newFrontLanding
# Если путь не указан, используется директория расположения скрипта.
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_PATH="${PROJECT_PATH:-${1:-$SCRIPT_DIR}}"

chown rx_test_ru_usr:rx_test_ru_usr -R "$PROJECT_PATH"
echo "🔄 Обновление фронтенда ROX VPN..."

# Переходим в директорию фронтенда
cd "$PROJECT_PATH/frontend"

echo "📦 Сборка фронтенда..."
npm run build

echo "✅ Фронтенд собран успешно"

# Переходим в директорию backend
cd "$PROJECT_PATH/backend"
echo "🔄 Перезапуск сервера..."
pm2 restart rox-vpn

echo "✅ Сервер перезапущен"
echo "🎉 Обновление завершено!"
echo "🌐 Сайт доступен по адресу: http://localhost:3000"
