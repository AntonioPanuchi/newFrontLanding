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
    
    if ! command -v docker &> /dev/null; then
        missing_deps+=("docker")
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        missing_deps+=("docker-compose")
    fi
    
    if ! command -v node &> /dev/null; then
        missing_deps+=("node")
    fi
    
    if ! command -v npm &> /dev/null; then
        missing_deps+=("npm")
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
        log_info "Создайте файл .env на основе env.example"
        exit 1
    fi
    
    log_success "Все переменные окружения настроены"
}

# Установка зависимостей
install_dependencies() {
    log_info "Установка зависимостей Node.js..."
    
    cd backend
    npm ci --only=production
    cd ..
    
    log_success "Зависимости установлены"
}

# Сборка Docker образа
build_docker() {
    log_info "Сборка Docker образа..."
    
    docker build -t rox-vpn-api:latest .
    
    log_success "Docker образ собран"
}

# Запуск с Docker Compose
start_services() {
    log_info "Запуск сервисов..."
    
    docker-compose up -d
    
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
        docker-compose logs rox-vpn-api
        exit 1
    fi
    
    # Проверка nginx
    if curl -f -s http://localhost:80 > /dev/null; then
        log_success "Nginx работает"
    else
        log_warning "Nginx не отвечает на порту 80"
    fi
}

# Остановка сервисов
stop_services() {
    log_info "Остановка сервисов..."
    
    docker-compose down
    
    log_success "Сервисы остановлены"
}

# Просмотр логов
show_logs() {
    log_info "Просмотр логов..."
    
    docker-compose logs -f
}

# Очистка
cleanup() {
    log_info "Очистка..."
    
    docker system prune -f
    docker volume prune -f
    
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
    build_docker
    start_services
    health_check
    
    log_success "Развертывание завершено успешно!"
    log_info "API доступен по адресу: http://localhost:3000"
    log_info "Frontend доступен по адресу: http://localhost:80"
}

# Быстрое развертывание
quick_deploy() {
    log_info "Быстрое развертывание..."
    
    build_docker
    start_services
    health_check
    
    log_success "Развертывание завершено!"
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