/**
 * ServerStatusManager - Модуль для управления статусом серверов
 */
class ServerStatusManager {
    constructor(config = {}) {
        this.config = {
            apiUrl: config.apiUrl || '/api/server-statuses',
            updateInterval: config.updateInterval || 60000,
            retryAttempts: config.retryAttempts || 3,
            retryDelay: config.retryDelay || 2000,
            requestTimeout: config.requestTimeout || 15000,
            cacheTimeout: config.cacheTimeout || 60000,
            enableAnalytics: config.enableAnalytics !== false,
            enableOfflineSupport: config.enableOfflineSupport !== false,
            ...config
        };

        this.state = {
            servers: [],
            isLoading: false,
            lastFetchTime: 0,
            updateTimer: null,
            retryCount: 0,
            cache: new Map(),
            observers: new Set()
        };

        this.elements = {
            container: document.getElementById('server-status-container'),
            lastUpdated: document.getElementById('last-updated'),
            errorContainer: null
        };

        this.init();
    }

    init() {
        this.validateElements();
        this.setupErrorContainer();
        this.loadInitialData();
        this.startAutoUpdate();
        this.setupEventListeners();
    }

    validateElements() {
        if (!this.elements.container) {
            throw new Error('Server status container not found');
        }
        if (!this.elements.lastUpdated) {
            throw new Error('Last updated element not found');
        }
    }

    setupErrorContainer() {
        this.elements.errorContainer = document.createElement('div');
        this.elements.errorContainer.className = 'error-container hidden';
        this.elements.errorContainer.innerHTML = `
            <div class="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-center">
                <div class="text-red-400 mb-2">⚠️ Ошибка загрузки данных</div>
                <div class="text-sm text-gray-400 mb-3">Не удалось получить статус серверов</div>
                <button class="retry-btn bg-red-500 hover:bg-red-400 text-white px-4 py-2 rounded-lg text-sm transition">
                    Попробовать снова
                </button>
            </div>
        `;
        
        this.elements.container.parentNode.insertBefore(
            this.elements.errorContainer, 
            this.elements.container
        );

        // Обработчик кнопки повтора
        this.elements.errorContainer.querySelector('.retry-btn').addEventListener('click', () => {
            this.loadServerStatuses();
        });
    }

    setupEventListeners() {
        // Обработка видимости страницы для оптимизации
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAutoUpdate();
            } else {
                this.resumeAutoUpdate();
            }
        });

        // Обработка онлайн/оффлайн статуса
        window.addEventListener('online', () => {
            this.onNetworkOnline();
        });

        window.addEventListener('offline', () => {
            this.onNetworkOffline();
        });
    }

    async loadInitialData() {
        // Показываем skeleton loader
        this.showSkeletonLoaders();
        
        // Загружаем данные
        await this.loadServerStatuses();
    }

    showSkeletonLoaders() {
        const skeletonHTML = `
            <div class="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 animate-pulse">
                <div class="flex items-center justify-between mb-4">
                    <div class="h-6 bg-gray-600 rounded w-24"></div>
                    <div class="h-4 bg-gray-600 rounded w-16"></div>
                </div>
                <div class="space-y-3">
                    <div class="h-4 bg-gray-600 rounded w-full"></div>
                    <div class="h-4 bg-gray-600 rounded w-3/4"></div>
                    <div class="h-4 bg-gray-600 rounded w-1/2"></div>
                </div>
            </div>
        `;

        this.elements.container.innerHTML = skeletonHTML.repeat(3);
    }

    async loadServerStatuses() {
        if (this.state.isLoading) return;

        this.state.isLoading = true;
        this.hideError();

        try {
            console.log('Fetching server statuses from:', this.config.apiUrl);
            
            const response = await this.fetchWithTimeout(
                this.config.apiUrl,
                {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    }
                },
                this.config.requestTimeout
            );

            console.log('Response status:', response.status);
            console.log('Response ok:', response.ok);
            console.log('Response headers:', Object.fromEntries(response.headers.entries()));

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            // Сначала получаем текст ответа
            const text = await response.text();
            console.log('Response text length:', text.length);
            console.log('Response text preview:', text.substring(0, 200));

            // Парсим JSON
            let data;
            try {
                data = JSON.parse(text);
            } catch (parseError) {
                console.error('JSON parse error:', parseError);
                console.error('Response text:', text);
                throw new Error('Invalid JSON response');
            }

            console.log('Parsed data:', data);
            console.log('Data type:', typeof data);
            console.log('Is Array:', Array.isArray(data));
            console.log('Data length:', data ? data.length : 'null');
            
            if (data && Array.isArray(data)) {
                console.log('✅ Valid data received, processing...');
                this.state.servers = data;
                this.state.lastFetchTime = Date.now();
                this.state.retryCount = 0;
                
                this.renderServers();
                this.updateLastUpdated(Date.now());
                this.notifyObservers('dataLoaded', { servers: data });
                
                if (this.config.enableAnalytics) {
                    this.trackAnalytics('servers_loaded', { count: data.length });
                }
                
                console.log('✅ Server statuses loaded successfully');
            } else {
                console.error('❌ Invalid data format:', data);
                throw new Error('Invalid response format - expected array');
            }

        } catch (error) {
            console.error('❌ Error loading server statuses:', error);
            this.handleError(error);
        } finally {
            this.state.isLoading = false;
        }
    }

    async fetchWithTimeout(url, options, timeout) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        
        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            return response;
        } catch (error) {
            clearTimeout(timeoutId);
            throw error;
        }
    }

    renderServers() {
        if (!this.state.servers.length) {
            this.elements.container.innerHTML = `
                <div class="col-span-full text-center text-gray-400 py-8">
                    Нет данных о серверах
                </div>
            `;
            return;
        }

        this.elements.container.innerHTML = this.state.servers.map(server => 
            this.createServerCard(server)
        ).join('');
    }

    createServerCard(server) {
        const statusClass = this.getStatusClass(server.status);
        const statusIcon = this.getStatusIcon(server.status);
        
        return `
            <div class="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 hover:border-white/20 transition-all duration-300">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-xl font-semibold text-white">${server.name}</h3>
                    <div class="flex items-center gap-2">
                        <span class="text-2xl">${statusIcon}</span>
                        <span class="px-2 py-1 rounded-full text-xs font-medium ${statusClass}">
                            ${this.getStatusText(server.status)}
                        </span>
                    </div>
                </div>
                
                <div class="space-y-3">
                    <div class="flex justify-between items-center">
                        <span class="text-gray-400 text-sm">Время работы:</span>
                        <span class="text-white font-medium">${server.uptime}</span>
                    </div>
                    
                    <div class="flex justify-between items-center">
                        <span class="text-gray-400 text-sm">Пинг:</span>
                        <span class="text-white font-medium">${server.ping_ms} мс</span>
                    </div>
                    
                    <div class="flex justify-between items-center">
                        <span class="text-gray-400 text-sm">Пользователи:</span>
                        <span class="text-white font-medium">${server.users_online}</span>
                    </div>
                    
                    <div class="flex justify-between items-center">
                        <span class="text-gray-400 text-sm">CPU:</span>
                        <span class="text-white font-medium">${server.cpu_load}%</span>
                    </div>
                </div>
                
                <div class="mt-4 pt-4 border-t border-white/10">
                    <div class="text-xs text-gray-500">
                        Обновлено: ${this.formatTime(this.state.lastFetchTime)}
                    </div>
                </div>
            </div>
        `;
    }

    getStatusClass(status) {
        const classes = {
            'online': 'bg-green-500/20 text-green-400',
            'offline': 'bg-red-500/20 text-red-400',
            'error': 'bg-yellow-500/20 text-yellow-400',
            'unknown': 'bg-gray-500/20 text-gray-400'
        };
        return classes[status] || classes.unknown;
    }

    getStatusIcon(status) {
        const icons = {
            'online': '🟢',
            'offline': '🔴',
            'error': '🟡',
            'unknown': '⚪'
        };
        return icons[status] || icons.unknown;
    }

    getStatusText(status) {
        const texts = {
            'online': 'Работает',
            'offline': 'Не работает',
            'error': 'Ошибка',
            'unknown': 'Неизвестно'
        };
        return texts[status] || texts.unknown;
    }

    formatTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        
        if (diff < 60000) return 'Только что';
        if (diff < 3600000) return `${Math.floor(diff / 60000)} мин назад`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)} ч назад`;
        return date.toLocaleDateString('ru-RU');
    }

    updateLastUpdated(timestamp) {
        if (this.elements.lastUpdated) {
            this.elements.lastUpdated.textContent = `Последнее обновление: ${this.formatTime(timestamp)}`;
        }
    }

    handleError(error) {
        this.state.retryCount++;
        
        if (this.state.retryCount < this.config.retryAttempts) {
            console.log(`Retrying in ${this.config.retryDelay}ms... (${this.state.retryCount}/${this.config.retryAttempts})`);
            setTimeout(() => this.loadServerStatuses(), this.config.retryDelay);
        } else {
            this.showError(error);
        }
    }

    showError(error) {
        this.elements.errorContainer.classList.remove('hidden');
        this.elements.container.innerHTML = '';
        
        if (this.config.enableAnalytics) {
            this.trackAnalytics('error', { 
                message: error.message,
                retryCount: this.state.retryCount 
            });
        }
    }

    hideError() {
        this.elements.errorContainer.classList.add('hidden');
    }

    startAutoUpdate() {
        this.state.updateTimer = setInterval(() => {
            this.loadServerStatuses();
        }, this.config.updateInterval);
    }

    pauseAutoUpdate() {
        if (this.state.updateTimer) {
            clearInterval(this.state.updateTimer);
            this.state.updateTimer = null;
        }
    }

    resumeAutoUpdate() {
        if (!this.state.updateTimer) {
            this.startAutoUpdate();
        }
    }

    onNetworkOnline() {
        console.log('Network is online, resuming updates');
        this.loadServerStatuses();
    }

    onNetworkOffline() {
        console.log('Network is offline, pausing updates');
        this.pauseAutoUpdate();
    }

    // Observer pattern для интеграции с другими модулями
    addObserver(callback) {
        this.state.observers.add(callback);
    }

    removeObserver(callback) {
        this.state.observers.delete(callback);
    }

    notifyObservers(event, data) {
        this.state.observers.forEach(callback => {
            try {
                callback(event, data);
            } catch (error) {
                console.error('Observer error:', error);
            }
        });
    }

    // Простая аналитика
    trackAnalytics(event, data) {
        if (typeof gtag !== 'undefined') {
            gtag('event', event, data);
        }
        
        // Можно добавить отправку в свой аналитический сервис
        console.log('Analytics:', event, data);
    }

    // Публичные методы для внешнего управления
    refresh() {
        return this.loadServerStatuses();
    }

    getServers() {
        return this.state.servers;
    }

    getLastUpdate() {
        return this.state.lastFetchTime;
    }

    destroy() {
        this.pauseAutoUpdate();
        this.state.observers.clear();
    }
}

// Экспорт для использования
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ServerStatusManager;
} else {
    window.ServerStatusManager = ServerStatusManager;
} 