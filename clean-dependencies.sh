#!/bin/bash

# Скрипт для очистки неиспользуемых зависимостей ROX VPN
set -e

echo "🧹 Очистка неиспользуемых зависимостей..."

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Удаляем node_modules и package-lock.json в корне
log_info "Очистка корневых зависимостей..."
rm -rf node_modules package-lock.json

# Удаляем node_modules и package-lock.json в frontend
log_info "Очистка frontend зависимостей..."
rm -rf frontend/node_modules frontend/package-lock.json

# Удаляем node_modules и package-lock.json в backend
log_info "Очистка backend зависимостей..."
rm -rf backend/node_modules backend/package-lock.json

# Переустанавливаем зависимости
log_info "Переустановка зависимостей..."

# Backend
log_info "Установка backend зависимостей..."
cd backend
npm install
cd ..

# Frontend
log_info "Установка frontend зависимостей..."
cd frontend
npm install
cd ..

# Корневые зависимости
log_info "Установка корневых зависимостей..."
npm install

log_success "Очистка завершена!"
log_info "Удаленные неиспользуемые зависимости:"
echo "  - class-variance-authority (CVA)"
echo "  - clsx"
echo "  - tailwind-merge"
echo "  - tailwindcss-animate (заменен собственными анимациями)"
echo "  - framer-motion"
echo "  - @headlessui/react"

log_info "Добавленные анимации в Tailwind config:"
echo "  - animate-pulse"
echo "  - animate-pulse-slow"

echo
log_success "Проект готов к работе!" 