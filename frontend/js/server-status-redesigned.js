/**
 * ServerStatusManager - Улучшенная версия для нового дизайна
 */
class ServerStatusManager {
    constructor(config = {}) {
        this.config = {
            apiUrl: config.apiUrl || '/api/server-statuses',
            updateInterval: config.updateInterval || 30000,
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
            refreshButton: document.getElementById('refresh-servers'),
            onlineCount: document.getElementById('online-count'),
            offlineCount: document.getElementById('offline-count'),
            errorCount: document.getElementById('error-count'),
            errorContainer: null
        };

        this.init();
    }

    init() {
        this.validateElements();
        this.setupErrorContainer();
        this.setupEventListeners();
        this.loadInitialData();
        this.startAutoUpdate();
    }

    validateElements() {
        const requiredElements = ['container', 'lastUpdated', 'searchInput', 'statusFilter', 'regionFilter'];
        for (const elementName of requiredElements) {
            if (!this.elements[elementName]) {
                console.error(`Required element not found: ${elementName}`);
            }
        }
    }

    setupErrorContainer() {
        this.elements.errorContainer = document.createElement('div');
        this.elements.errorContainer.className = 'empty-state';
        this.elements.errorContainer.innerHTML = `
            <div class="empty-state-icon">⚠️</div>
            <h3 class="text-xl font-semibold mb-2">Ошибка загрузки данных</h3>
            <p class="text-gray-400 mb-4">Не удалось получить статус серверов</p>
            <button class="btn btn-primary retry-btn">
                <i class="fas fa-sync-alt"></i>
                Попробовать снова
            </button>
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
        // Кнопка обновления
        this.elements.refreshButton.addEventListener('click', () => {
            this.loadServerStatuses();
        });

        // Обработка видимости страницы
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
        this.showSkeletonLoaders();
        await this.loadServerStatuses();
    }

    showSkeletonLoaders() {
        const skeletonHTML = `
            <div class="card server-card animate-pulse">
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 bg-gray-600 rounded-full"></div>
                        <div>
                            <div class="h-4 bg-gray-600 rounded w-24 mb-2"></div>
                            <div class="h-3 bg-gray-600 rounded w-16"></div>
                        </div>
                    </div>
                    <div class="h-4 bg-gray-600 rounded w-12"></div>
                </div>
                <div class="space-y-3">
                    <div class="h-3 bg-gray-600 rounded w-full"></div>
                    <div class="h-3 bg-gray-600 rounded w-3/4"></div>
                    <div class="h-3 bg-gray-600 rounded w-1/2"></div>
                </div>
            </div>
        `;

        this.elements.container.innerHTML = skeletonHTML.repeat(6);
    }

    async loadServerStatuses() {
        if (this.state.isLoading) return;

        this.state.isLoading = true;
        this.hideError();
        this.elements.refreshButton.disabled = true;
        this.elements.refreshButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Обновление...';

        try {
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

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const text = await response.text();
            let data;
            
            try {
                data = JSON.parse(text);
            } catch (parseError) {
                console.error('JSON parse error:', parseError);
                throw new Error('Invalid JSON response');
            }
            
            if (data && Array.isArray(data)) {
                this.state.servers = data;
                this.state.lastFetchTime = Date.now();
                this.state.retryCount = 0;
                
                this.renderServers();
                this.updateLastUpdated(Date.now());
                this.notifyObservers('dataLoaded', { servers: data });
                
                if (this.config.enableAnalytics) {
                    this.trackAnalytics('servers_loaded', { count: data.length });
                }
                
                // Показываем уведомление об успешном обновлении
                if (window.showNotification) {
                    window.showNotification(`Обновлено ${data.length} серверов`, 'success');
                }
            } else {
                throw new Error('Invalid response format - expected array');
            }

        } catch (error) {
            console.error('Error loading server statuses:', error);
            this.handleError(error);
        } finally {
            this.state.isLoading = false;
            this.elements.refreshButton.disabled = false;
            this.elements.refreshButton.innerHTML = '<i class="fas fa-sync-alt"></i> Обновить';
        }
    }

    renderServers() {
        if (this.state.servers.length === 0) {
            this.showEmptyState();
            return;
        }

        const cardsHTML = this.state.servers
            .map((server, index) => this.createServerCard(server, index))
            .join('');

        this.elements.container.innerHTML = cardsHTML;
        this.updateCounters();
    }

    showEmptyState() {
        this.elements.container.innerHTML = `
            <div class="empty-state col-span-full">
                <div class="empty-state-icon">⚠️</div>
                <h3 class="text-xl font-semibold mb-2">Серверы недоступны</h3>
                <p class="text-gray-400">Не удалось загрузить данные серверов</p>
            </div>
        `;
    }

    createServerCard(server, index = 0) {
        const statusClass = this.getStatusClass(server.status);
        const statusIcon = this.getStatusIcon(server.status);
        const countryFlag = this.getCountryFlag(server.name);
        const regionColor = this.getRegionColor(server.name);
        const animationDelay = index * 100;
        
        return `
            <div class="card server-card ${server.status}" 
                 data-server-id="${server.name}"
                 data-status="${server.status}"
                 data-region="${this.getRegionFromName(server.name)}"
                 style="animation-delay: ${animationDelay}ms;"
                 onclick="showServerDetails('${server.name}')">
                
                <!-- Header -->
                <div class="flex items-center justify-between mb-6">
                    <div class="flex items-center gap-3">
                        <div class="relative">
                            <span class="text-2xl filter drop-shadow-lg">${countryFlag}</span>
                            <div class="absolute -top-1 -right-1 w-3 h-3 ${this.getStatusDotClass(server.status)} rounded-full border-2 border-white"></div>
                        </div>
                        <div>
                            <h3 class="text-lg font-bold text-white mb-1">${server.name}</h3>
                            <div class="flex items-center gap-2">
                                <span class="text-sm">${statusIcon}</span>
                                <span class="status-indicator ${statusClass}">
                                    ${this.getStatusText(server.status)}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="text-right">
                        <div class="text-xs text-gray-400 mb-1">Регион</div>
                        <div class="text-sm font-medium" style="color: ${regionColor}">${this.getRegionName(server.name)}</div>
                    </div>
                </div>
                
                <!-- Метрики -->
                <div class="space-y-4">
                    <!-- Пинг -->
                    <div class="metric">
                        <div class="metric-label">
                            <i class="fas fa-network-wired text-blue-400"></i>
                            <span>Пинг</span>
                        </div>
                        <div class="metric-value ${this.getPingClass(server.ping_ms)}">
                            ${server.ping_ms} мс
                        </div>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill ${this.getPingBarClass(server.ping_ms)}" 
                             style="width: ${this.getPingPercentage(server.ping_ms)}%"></div>
                    </div>
                    
                    <!-- Пользователи -->
                    <div class="metric">
                        <div class="metric-label">
                            <i class="fas fa-users text-purple-400"></i>
                            <span>Пользователи</span>
                        </div>
                        <div class="metric-value info">
                            ${this.formatNumber(server.users_online)}
                        </div>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill progress-info" 
                             style="width: ${Math.min((server.users_online / 1000) * 100, 100)}%"></div>
                    </div>
                    
                    <!-- CPU -->
                    <div class="metric">
                        <div class="metric-label">
                            <i class="fas fa-microchip text-orange-400"></i>
                            <span>CPU</span>
                        </div>
                        <div class="metric-value ${this.getCpuClass(server.cpu_load)}">
                            ${server.cpu_load}%
                        </div>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill ${this.getCpuBarClass(server.cpu_load)}" 
                             style="width: ${server.cpu_load}%"></div>
                    </div>
                    
                    <!-- RAM (если доступно) -->
                    ${server.ram_usage ? `
                    <div class="metric">
                        <div class="metric-label">
                            <i class="fas fa-memory text-cyan-400"></i>
                            <span>RAM</span>
                        </div>
                        <div class="metric-value ${this.getRamClass(server.ram_usage)}">
                            ${server.ram_usage}%
                        </div>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill ${this.getRamBarClass(server.ram_usage)}" 
                             style="width: ${server.ram_usage}%"></div>
                    </div>
                    ` : ''}
                </div>
                
                <!-- Footer -->
                <div class="mt-6 pt-4 border-t border-gray-700">
                    <div class="flex items-center justify-between text-xs text-gray-400">
                        <div class="flex items-center gap-2">
                            <i class="fas fa-clock"></i>
                            <span>Аптайм: ${server.uptime}</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <button class="hover:text-blue-400 transition-colors" 
                                    onclick="event.stopPropagation(); copyServerInfo('${server.name}')" 
                                    title="Копировать информацию">
                                <i class="fas fa-copy"></i>
                            </button>
                            <button class="hover:text-green-400 transition-colors" 
                                    onclick="event.stopPropagation(); pingServer('${server.name}')" 
                                    title="Проверить пинг">
                                <i class="fas fa-network-wired"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    updateCounters() {
        const counts = {
            online: this.state.servers.filter(s => s.status === 'online').length,
            offline: this.state.servers.filter(s => s.status === 'offline').length,
            error: this.state.servers.filter(s => s.status === 'error').length
        };

        this.elements.onlineCount.textContent = counts.online;
        this.elements.offlineCount.textContent = counts.offline;
        this.elements.errorCount.textContent = counts.error;
    }

    // Вспомогательные методы для стилей
    getStatusClass(status) {
        const classes = {
            'online': 'status-online',
            'offline': 'status-offline',
            'error': 'status-error'
        };
        return classes[status] || 'status-error';
    }

    getStatusDotClass(status) {
        const classes = {
            'online': 'bg-green-500',
            'offline': 'bg-red-500',
            'error': 'bg-yellow-500'
        };
        return classes[status] || 'bg-gray-500';
    }

    getStatusIcon(status) {
        const icons = {
            'online': '🟢',
            'offline': '🔴',
            'error': '🟡'
        };
        return icons[status] || '⚪';
    }

    getStatusText(status) {
        const texts = {
            'online': 'Работает',
            'offline': 'Не работает',
            'error': 'Ошибка'
        };
        return texts[status] || 'Неизвестно';
    }

    getPingClass(ping) {
        if (ping <= 50) return 'success';
        if (ping <= 100) return 'warning';
        return 'error';
    }

    getCpuClass(cpu) {
        if (cpu <= 30) return 'success';
        if (cpu <= 70) return 'warning';
        return 'error';
    }

    getRamClass(ram) {
        if (ram <= 50) return 'success';
        if (ram <= 80) return 'warning';
        return 'error';
    }

    getPingBarClass(ping) {
        if (ping <= 50) return 'progress-success';
        if (ping <= 100) return 'progress-warning';
        return 'progress-error';
    }

    getCpuBarClass(cpu) {
        if (cpu <= 30) return 'progress-success';
        if (cpu <= 70) return 'progress-warning';
        return 'progress-error';
    }

    getRamBarClass(ram) {
        if (ram <= 50) return 'progress-success';
        if (ram <= 80) return 'progress-warning';
        return 'progress-error';
    }

    getPingPercentage(ping) {
        // Нормализуем пинг к проценту (0-300мс = 0-100%)
        return Math.min((ping / 300) * 100, 100);
    }

    // Методы для работы с регионами
    getRegionFromName(name) {
        if (name.toLowerCase().includes('germany')) return 'germany';
        if (name.toLowerCase().includes('usa')) return 'usa';
        if (name.toLowerCase().includes('finland')) return 'finland';
        return 'unknown';
    }

    getRegionName(name) {
        const region = this.getRegionFromName(name);
        const names = {
            'germany': 'Германия',
            'usa': 'США',
            'finland': 'Финляндия',
            'unknown': 'Неизвестно'
        };
        return names[region] || 'Неизвестно';
    }

    getRegionColor(name) {
        const region = this.getRegionFromName(name);
        const colors = {
            'germany': '#3b82f6',
            'usa': '#10b981',
            'finland': '#8b5cf6',
            'unknown': '#6b7280'
        };
        return colors[region] || '#6b7280';
    }

    getCountryFlag(name) {
        const region = this.getRegionFromName(name);
        const flags = {
            'germany': '🇩🇪',
            'usa': '🇺🇸',
            'finland': '🇫🇮',
            'unknown': '🌍'
        };
        return flags[region] || '🌍';
    }

    // Утилиты
    formatNumber(num) {
        return new Intl.NumberFormat('ru-RU').format(num);
    }

    formatTime(timestamp) {
        const now = Date.now();
        const diff = now - timestamp;
        
        if (diff < 60000) return 'Только что';
        if (diff < 3600000) return `${Math.floor(diff / 60000)} мин назад`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)} ч назад`;
        return `${Math.floor(diff / 86400000)} дн назад`;
    }

    updateLastUpdated(timestamp) {
        this.elements.lastUpdated.textContent = `Последнее обновление: ${this.formatTime(timestamp)}`;
    }

    // Обработка ошибок
    handleError(error) {
        this.state.retryCount++;
        
        if (this.state.retryCount < this.config.retryAttempts) {
            setTimeout(() => {
                this.loadServerStatuses();
            }, this.config.retryDelay);
        } else {
            this.showError(error);
        }
    }

    showError(error) {
        console.error('Server status error:', error);
        this.elements.container.style.display = 'none';
        this.elements.errorContainer.style.display = 'block';
        
        if (window.showNotification) {
            window.showNotification('Ошибка загрузки данных серверов', 'error');
        }
    }

    hideError() {
        this.elements.container.style.display = 'grid';
        this.elements.errorContainer.style.display = 'none';
    }

    // Автообновление
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

    // Сетевые события
    onNetworkOnline() {
        console.log('Network online, resuming updates');
        this.resumeAutoUpdate();
        this.loadServerStatuses();
    }

    onNetworkOffline() {
        console.log('Network offline, pausing updates');
        this.pauseAutoUpdate();
    }

    // API методы
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

    // Наблюдатели
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

    // Аналитика
    trackAnalytics(event, data) {
        if (typeof gtag !== 'undefined') {
            gtag('event', event, data);
        }
    }

    // Публичные методы
    refresh() {
        this.loadServerStatuses();
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
        this.state.cache.clear();
    }
}

// Глобальные функции для взаимодействия с карточками
function showServerDetails(serverName) {
    const server = window.serverManager?.getServers().find(s => s.name === serverName);
    if (!server) return;

    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-md w-full mx-4">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-xl font-bold">${server.name}</h3>
                <button onclick="this.closest('.fixed').remove()" class="text-gray-400 hover:text-white">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="space-y-3 text-sm">
                <div class="flex justify-between">
                    <span class="text-gray-400">Статус:</span>
                    <span class="${window.serverManager.getStatusClass(server.status)}">${window.serverManager.getStatusText(server.status)}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-400">Пинг:</span>
                    <span>${server.ping_ms} мс</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-400">CPU:</span>
                    <span>${server.cpu_load}%</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-400">Пользователи:</span>
                    <span>${window.serverManager.formatNumber(server.users_online)}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-400">Аптайм:</span>
                    <span>${server.uptime}</span>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
}

function copyServerInfo(serverName) {
    const server = window.serverManager?.getServers().find(s => s.name === serverName);
    if (!server) return;

    const info = `
Сервер: ${server.name}
Статус: ${window.serverManager.getStatusText(server.status)}
Пинг: ${server.ping_ms} мс
CPU: ${server.cpu_load}%
Пользователи: ${window.serverManager.formatNumber(server.users_online)}
Аптайм: ${server.uptime}
    `.trim();

    navigator.clipboard.writeText(info).then(() => {
        if (window.showNotification) {
            window.showNotification('Информация скопирована', 'success');
        }
    }).catch(() => {
        if (window.showNotification) {
            window.showNotification('Ошибка копирования', 'error');
        }
    });
}

function pingServer(serverName) {
    if (window.showNotification) {
        window.showNotification('Проверка пинга...', 'info');
    }
    
    // Имитация пинга (в реальном приложении здесь был бы API запрос)
    setTimeout(() => {
        if (window.showNotification) {
            window.showNotification('Пинг выполнен', 'success');
        }
    }, 1000);
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // Создаем экземпляр менеджера серверов
    window.serverManager = new ServerStatusManager({
        apiUrl: '/api/server-statuses',
        updateInterval: 30000,
        enableAnalytics: true
    });
}); 