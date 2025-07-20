#!/bin/bash


chown rx_test_ru_usr:rx_test_ru_usr -R /var/www/rx_test_ru_usr/data/www/rx-test.ru/newFrontLanding/
# Скрипт для обновления фронтенда ROX VPN
set -e

echo "🔄 Обновление фронтенда ROX VPN..."

# Переходим в директорию фронтенда
cd frontend

echo "📦 Сборка фронтенда..."
npm run build

echo "✅ Фронтенд собран успешно"

# Возвращаемся в корневую директорию
cd ..

echo "🔄 Перезапуск сервера..."
pm2 restart rox-vpn-api

echo "✅ Сервер перезапущен"

echo "🎉 Обновление завершено!"
echo "🌐 Сайт доступен по адресу: http://localhost:3000" 