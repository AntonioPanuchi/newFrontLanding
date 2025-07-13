#!/bin/bash

# ROX VPN API Deployment Script
# Автоматическое развертывание приложения

set -e  # Остановка при ошибке

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Функции для логирования
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

# Проверка зависимостей
check_dependencies() {
    log_info "Проверка зависимостей..."
    
    local missing_deps=()
    
    if ! command -v node &> /dev/null; then
        missing_deps+=("node")
    fi
    
    if ! command -v npm &> /dev/null; then
        missing_deps+=("npm")
    fi
    
    if ! command -v pm2 &> /dev/null; then
        missing_deps+=("pm2")
    fi
    
    if [ ${#missing_deps[@]} -ne 0 ]; then
        log_error "Отсутствуют зависимости: ${missing_deps[*]}"
        log_info "Установите недостающие зависимости и повторите попытку"
        exit 1
    fi
    
    log_success "Все зависимости установлены"
}

# Проверка переменных окружения
check_environment() {
    log_info "Проверка переменных окружения..."
    
    # Загружаем переменные из .env файла в backend
    if [ -f "backend/.env" ]; then
        log_info "Загрузка переменных из backend/.env..."
        export $(grep -v '^#' backend/.env | xargs)
    else
        log_error "Файл backend/.env не найден"
        log_info "Создайте файл backend/.env на основе backend/env.example"
        exit 1
    fi
    
    local required_vars=(
        "GERMANY_API_URL"
        "USA_API_URL"
        "FINLAND_API_URL"
        "USERNAME"
        "PASSWORD"
        "PINGHOST1"
        "PINGHOST2"
        "PINGHOST3"
    )
    
    local missing_vars=()
    
    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            missing_vars+=("$var")
        fi
    done
    
    if [ ${#missing_vars[@]} -ne 0 ]; then
        log_error "Отсутствуют переменные окружения: ${missing_vars[*]}"
        log_info "Проверьте файл backend/.env"
        exit 1
    fi
    
    log_success "Все переменные окружения настроены"
}

# Установка зависимостей
install_dependencies() {
    log_info "Установка зависимостей Node.js..."
    
    cd backend
    npm install
    cd ..
    
    log_success "Зависимости установлены"
}

# Проверка кода
check_code() {
    log_info "Проверка кода..."
    
    cd backend
    if npm run lint 2>/dev/null; then
        log_success "Linting прошел успешно"
    else
        log_warning "Linting не прошел, но продолжаем деплой"
    fi
    cd ..
    
    log_success "Проверка кода завершена"
}

# Запуск с PM2
start_services() {
    log_info "Запуск сервисов..."
    
    # Останавливаем существующий процесс если есть
    pm2 stop rox-vpn-api 2>/dev/null || true
    pm2 delete rox-vpn-api 2>/dev/null || true
    
    # Запускаем через PM2
    pm2 start ecosystem.config.js
    
    # Сохраняем конфигурацию
    pm2 save
    
    log_success "Сервисы запущены"
}

# Проверка здоровья сервисов
health_check() {
    log_info "Проверка здоровья сервисов..."
    
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -f -s http://localhost:3000/health > /dev/null; then
            log_success "API сервис работает"
            break
        fi
        
        log_info "Попытка $attempt/$max_attempts - ожидание запуска API..."
        sleep 2
        ((attempt++))
    done
    
    if [ $attempt -gt $max_attempts ]; then
        log_error "API сервис не запустился в течение 60 секунд"
        pm2 logs rox-vpn-api --lines 20
        exit 1
    fi
    
    log_success "Все сервисы работают корректно"
}

# Остановка сервисов
stop_services() {
    log_info "Остановка сервисов..."
    
    pm2 stop rox-vpn-api
    
    log_success "Сервисы остановлены"
}

# Просмотр логов
show_logs() {
    log_info "Просмотр логов..."
    
    pm2 logs rox-vpn-api -f
}

# Очистка
cleanup() {
    log_info "Очистка..."
    
    pm2 flush
    
    log_success "Очистка завершена"
}

# Основное меню
show_menu() {
    echo
    echo "=== ROX VPN API Deployment Script ==="
    echo "1. Полное развертывание"
    echo "2. Только сборка и запуск"
    echo "3. Остановить сервисы"
    echo "4. Просмотр логов"
    echo "5. Проверка здоровья"
    echo "6. Очистка"
    echo "7. Выход"
    echo
    read -p "Выберите действие (1-7): " choice
}

# Полное развертывание
full_deploy() {
    log_info "Начинаем полное развертывание..."
    
    check_dependencies
    check_environment
    install_dependencies
    check_code
    start_services
    health_check
    
    log_success "Развертывание завершено успешно!"
    log_info "API доступен по адресу: http://localhost:3000"
}

# Быстрое развертывание
quick_deploy() {
    log_info "Быстрое развертывание..."
    
    start_services
    health_check
    
    log_success "Развертывание завершено!"
    log_info "API доступен по адресу: http://localhost:3000"
}

# Главная функция
main() {
    case "${1:-}" in
        "deploy")
            full_deploy
            ;;
        "quick")
            quick_deploy
            ;;
        "stop")
            stop_services
            ;;
        "logs")
            show_logs
            ;;
        "health")
            health_check
            ;;
        "cleanup")
            cleanup
            ;;
        *)
            while true; do
                show_menu
                case $choice in
                    1)
                        full_deploy
                        ;;
                    2)
                        quick_deploy
                        ;;
                    3)
                        stop_services
                        ;;
                    4)
                        show_logs
                        ;;
                    5)
                        health_check
                        ;;
                    6)
                        cleanup
                        ;;
                    7)
                        log_info "Выход..."
                        exit 0
                        ;;
                    *)
                        log_error "Неверный выбор"
                        ;;
                esac
                
                echo
                read -p "Нажмите Enter для продолжения..."
            done
            ;;
    esac
}

# Запуск скрипта
main "$@" 