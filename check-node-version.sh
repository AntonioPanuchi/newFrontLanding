#!/bin/bash

# Скрипт для проверки совместимости Node.js с ROX VPN API
set -e

echo "🔍 Проверка совместимости Node.js..."

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

# Проверяем наличие Node.js
if ! command -v node &> /dev/null; then
    log_error "Node.js не установлен"
    exit 1
fi

# Получаем версию Node.js
NODE_VERSION=$(node --version)
NODE_MAJOR=$(echo $NODE_VERSION | sed 's/v//' | cut -d. -f1)

log_info "Обнаружена версия Node.js: $NODE_VERSION"

# Проверяем минимальную версию
if [ "$NODE_MAJOR" -lt 18 ]; then
    log_warning "Node.js версии $NODE_VERSION ниже рекомендуемой (18.x)"
    log_info "Будет использован полифилл node-fetch для совместимости"
    
    # Проверяем наличие node-fetch
    if [ -f "backend/node_modules/node-fetch/package.json" ]; then
        log_success "Полифилл node-fetch установлен"
    else
        log_warning "Полифилл node-fetch не установлен. Установите зависимости:"
        echo "  cd backend && npm install"
    fi
else
    log_success "Node.js версии $NODE_VERSION поддерживает нативный fetch API"
fi

# Проверяем npm
if ! command -v npm &> /dev/null; then
    log_error "npm не установлен"
    exit 1
fi

NPM_VERSION=$(npm --version)
log_info "Обнаружена версия npm: $NPM_VERSION"

# Проверяем минимальную версию npm
NPM_MAJOR=$(echo $NPM_VERSION | cut -d. -f1)
if [ "$NPM_MAJOR" -lt 8 ]; then
    log_warning "npm версии $NPM_VERSION ниже рекомендуемой (8.x)"
else
    log_success "npm версии $NPM_VERSION соответствует требованиям"
fi

echo
log_info "Рекомендации:"
if [ "$NODE_MAJOR" -lt 18 ]; then
    echo "  - Обновите Node.js до версии 18.x или выше для лучшей производительности"
    echo "  - Убедитесь, что установлен полифилл node-fetch"
else
    echo "  - Версия Node.js оптимальна для работы с ROX VPN API"
fi

echo
log_success "Проверка завершена!" 