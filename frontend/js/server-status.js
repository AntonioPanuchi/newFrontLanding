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
                    <div class="text-6xl mb-4">🔄</div>
                    <div class="text-xl font-semibold mb-2">Загрузка серверов...</div>
                    <div class="text-sm opacity-70">Получаем актуальную информацию</div>
                </div>
            `;
            return;
        }
        
        // Получаем все серверы (без фильтрации)
        const allServers = this.getAllServers();
        
        // Рендерим карточки серверов с задержкой для анимации
        this.elements.container.innerHTML = allServers.map((server, index) => 
            this.createServerCard(server, index)
        ).join('');
    }

    // Получение всех серверов (без фильтрации)
    getAllServers() {
        return this.state.servers;
    }





    createServerCard(server, index = 0) {
        const statusClass = this.getStatusClass(server.status);
        const statusIcon = this.getStatusIcon(server.status);
        const countryFlag = this.getCountryFlag(server.name);
        const animationDelay = index * 100; // Задержка для каскадной анимации
        
        // Определяем цвет региона
        const regionColor = this.getRegionColor(server.name);
        
        return `
            <div class="enhanced-server-card neo-card p-6 hover:scale-105 transition-all duration-500 cursor-pointer" 
                 data-server-id="${server.name}"
                 data-status="${server.status}"
                 data-region="${this.getRegionFromName(server.name)}"
                 style="animation-delay: ${animationDelay}ms;"
                 onclick="showServerDetails('${server.name}')">
                
                <!-- Header с флагом и статусом -->
                <div class="flex items-center justify-between mb-6">
                    <div class="flex items-center gap-3">
                        <div class="relative">
                            <span class="text-3xl filter drop-shadow-lg">${countryFlag}</span>
                            <div class="absolute -top-1 -right-1 w-4 h-4 ${statusClass} rounded-full border-2 border-white"></div>
                        </div>
                        <div>
                            <h3 class="text-xl font-bold text-white mb-1">${server.name}</h3>
                            <div class="flex items-center gap-2">
                                <span class="text-lg">${statusIcon}</span>
                                <span class="px-3 py-1 rounded-full text-xs font-semibold ${statusClass} border border-current border-opacity-20">
                                    ${this.getStatusText(server.status)}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="text-right">
                        <div class="text-xs opacity-60 mb-1">Регион</div>
                        <div class="text-sm font-medium" style="color: ${regionColor}">${this.getRegionName(server.name)}</div>
                    </div>
                </div>
                
                <!-- Статистика сервера с прогресс-барами -->
                <div class="space-y-4">
                    <!-- Время работы -->
                    <div class="metric-item">
                        <div class="flex justify-between items-center mb-2">
                            <div class="flex items-center gap-2">
                                <span class="text-blue-400 text-lg">⏱️</span>
                                <span class="text-gray-300 text-sm font-medium">Время работы</span>
                            </div>
                            <span class="text-white font-semibold text-sm">${server.uptime}</span>
                        </div>
                        <div class="w-full bg-white/10 rounded-full h-2">
                            <div class="bg-blue-500 h-2 rounded-full" style="width: 100%"></div>
                        </div>
                    </div>
                    
                    <!-- Пинг -->
                    <div class="metric-item">
                        <div class="flex justify-between items-center mb-2">
                            <div class="flex items-center gap-2">
                                <span class="text-green-400 text-lg">📡</span>
                                <span class="text-gray-300 text-sm font-medium">Пинг</span>
                            </div>
                            <span class="text-white font-semibold text-sm ${this.getPingClass(server.ping_ms)}">${server.ping_ms} мс</span>
                        </div>
                        <div class="w-full bg-white/10 rounded-full h-2">
                            <div class="${this.getPingBarClass(server.ping_ms)} h-2 rounded-full transition-all duration-300" 
                                 style="width: ${this.getPingPercentage(server.ping_ms)}%"></div>
                        </div>
                    </div>
                    
                    <!-- Пользователи -->
                    <div class="metric-item">
                        <div class="flex justify-between items-center mb-2">
                            <div class="flex items-center gap-2">
                                <span class="text-purple-400 text-lg">👥</span>
                                <span class="text-gray-300 text-sm font-medium">Пользователи</span>
                            </div>
                            <span class="text-white font-semibold text-sm">${this.formatNumber(server.users_online)}</span>
                        </div>
                        <div class="w-full bg-white/10 rounded-full h-2">
                            <div class="bg-purple-500 h-2 rounded-full transition-all duration-300" 
                                 style="width: ${Math.min((server.users_online / 1000) * 100, 100)}%"></div>
                        </div>
                    </div>
                    
                    <!-- CPU -->
                    <div class="metric-item">
                        <div class="flex justify-between items-center mb-2">
                            <div class="flex items-center gap-2">
                                <span class="text-orange-400 text-lg">⚡</span>
                                <span class="text-gray-300 text-sm font-medium">CPU</span>
                            </div>
                            <span class="text-white font-semibold text-sm ${this.getCpuClass(server.cpu_load)}">${server.cpu_load}%</span>
                        </div>
                        <div class="w-full bg-white/10 rounded-full h-2">
                            <div class="${this.getCpuBarClass(server.cpu_load)} h-2 rounded-full transition-all duration-300" 
                                 style="width: ${server.cpu_load}%"></div>
                        </div>
                    </div>
                    
                    <!-- RAM (если доступно) -->
                    ${server.ram_usage ? `
                    <div class="metric-item">
                        <div class="flex justify-between items-center mb-2">
                            <div class="flex items-center gap-2">
                                <span class="text-cyan-400 text-lg">💾</span>
                                <span class="text-gray-300 text-sm font-medium">RAM</span>
                            </div>
                            <span class="text-white font-semibold text-sm ${this.getRamClass(server.ram_usage)}">${server.ram_usage}%</span>
                        </div>
                        <div class="w-full bg-white/10 rounded-full h-2">
                            <div class="${this.getRamBarClass(server.ram_usage)} h-2 rounded-full transition-all duration-300" 
                                 style="width: ${server.ram_usage}%"></div>
                        </div>
                    </div>
                    ` : ''}
                </div>
                
                <!-- Footer с временем обновления и действиями -->
                <div class="mt-6 pt-4 border-t border-white/10">
                    <div class="flex items-center justify-between text-xs">
                        <div class="flex items-center gap-2">
                            <span class="text-gray-400">🔄</span>
                            <span class="text-gray-300">${this.formatTime(this.state.lastFetchTime)}</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <button class="text-blue-400 hover:text-blue-300 transition-colors" 
                                    onclick="event.stopPropagation(); copyServerInfo('${server.name}')" 
                                    title="Копировать информацию">
                                <i class="fas fa-copy"></i>
                            </button>
                            <button class="text-green-400 hover:text-green-300 transition-colors" 
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

    // Возвращает CSS класс для пинга в зависимости от значения
    getPingClass(ping) {
        if (ping <= 50) return 'text-green-400';
        if (ping <= 100) return 'text-yellow-400';
        return 'text-red-400';
    }

    // Возвращает CSS класс для CPU в зависимости от нагрузки
    getCpuClass(cpu) {
        if (cpu <= 30) return 'text-green-400';
        if (cpu <= 70) return 'text-yellow-400';
        return 'text-red-400';
    }

    // Возвращает CSS класс для прогресс-бара CPU
    getCpuBarClass(cpu) {
        if (cpu <= 30) return 'bg-green-500';
        if (cpu <= 70) return 'bg-yellow-500';
        return 'bg-red-500';
    }

    // Возвращает CSS класс для RAM
    getRamClass(ram) {
        if (ram <= 50) return 'text-green-400';
        if (ram <= 80) return 'text-yellow-400';
        return 'text-red-400';
    }

    // Возвращает CSS класс для прогресс-бара RAM
    getRamBarClass(ram) {
        if (ram <= 50) return 'bg-green-500';
        if (ram <= 80) return 'bg-yellow-500';
        return 'bg-red-500';
    }

    // Возвращает CSS класс для прогресс-бара пинга
    getPingBarClass(ping) {
        if (ping <= 50) return 'bg-green-500';
        if (ping <= 100) return 'bg-yellow-500';
        return 'bg-red-500';
    }

    // Возвращает процент для прогресс-бара пинга
    getPingPercentage(ping) {
        // Нормализуем пинг: 0-50мс = 100%, 50-200мс = 50-100%, >200мс = 0-50%
        if (ping <= 50) return 100;
        if (ping <= 200) return 100 - ((ping - 50) / 150) * 50;
        return Math.max(0, 50 - ((ping - 200) / 100) * 50);
    }

    // Возвращает регион из названия сервера
    getRegionFromName(name) {
        const lowerName = name.toLowerCase();
        if (lowerName.includes('germany') || lowerName.includes('deutschland')) return 'germany';
        if (lowerName.includes('usa') || lowerName.includes('united states')) return 'usa';
        if (lowerName.includes('finland') || lowerName.includes('suomi')) return 'finland';
        return 'unknown';
    }

    // Возвращает название региона
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

    // Возвращает цвет региона
    getRegionColor(name) {
        const region = this.getRegionFromName(name);
        const colors = {
            'germany': '#ff6b6b',
            'usa': '#4ecdc4',
            'finland': '#45b7d1',
            'unknown': '#95a5a6'
        };
        return colors[region] || '#95a5a6';
    }

    // Форматирует числа с разделителями
    formatNumber(num) {
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    formatTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        
        if (diff < 60000) {
            // Показываем точное время для обновлений менее минуты назад
            return date.toLocaleTimeString('ru-RU', { 
                hour: '2-digit', 
                minute: '2-digit',
                second: '2-digit'
            });
        }
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

    // Возвращает emoji-флаг по названию сервера (страны)
    getCountryFlag(name) {
        const map = {
            'Germany': '🇩🇪',
            'Deutschland': '🇩🇪',
            'USA': '🇺🇸',
            'United States': '🇺🇸',
            'Finland': '🇫🇮',
            'France': '🇫🇷',
            'Russia': '🇷🇺',
            'Россия': '🇷🇺',
            'Singapore': '🇸🇬',
            'Netherlands': '🇳🇱',
            'Poland': '🇵🇱',
            'Japan': '🇯🇵',
            'Hong Kong': '🇭🇰',
            'Turkey': '🇹🇷',
            'Ukraine': '🇺🇦',
            'Canada': '🇨🇦',
            'United Kingdom': '🇬🇧',
            'UK': '🇬🇧',
            'Sweden': '🇸🇪',
            'Norway': '🇳🇴',
            'Italy': '🇮🇹',
            'Spain': '🇪🇸',
            'Estonia': '🇪🇪',
            'Czech': '🇨🇿',
            'Czechia': '🇨🇿',
            'Korea': '🇰🇷',
            'South Korea': '🇰🇷',
            'India': '🇮🇳',
            'Brazil': '🇧🇷',
            'Australia': '🇦🇺',
            'Israel': '🇮🇱',
            'Switzerland': '🇨🇭',
            'Austria': '🇦🇹',
            'Romania': '🇷🇴',
            'Latvia': '🇱🇻',
            'Lithuania': '🇱🇹',
            'Belarus': '🇧🇾',
            'Georgia': '🇬🇪',
            'Kazakhstan': '🇰🇿',
            'Uzbekistan': '🇺🇿',
            'Armenia': '🇦🇲',
            'Azerbaijan': '🇦🇿',
            'Kyrgyzstan': '🇰🇬',
            'Moldova': '🇲🇩',
            'Bulgaria': '🇧🇬',
            'Slovakia': '🇸🇰',
            'Slovenia': '🇸🇮',
            'Serbia': '🇷🇸',
            'Croatia': '🇭🇷',
            'Bosnia': '🇧🇦',
            'Montenegro': '🇲🇪',
            'Albania': '🇦🇱',
            'Greece': '🇬🇷',
            'Portugal': '🇵🇹',
            'Belgium': '🇧🇪',
            'Denmark': '🇩🇰',
            'Hungary': '🇭🇺',
            'Luxembourg': '🇱🇺',
            'Ireland': '🇮🇪',
            'Iceland': '🇮🇸',
            'Mexico': '🇲🇽',
            'Argentina': '🇦🇷',
            'Chile': '🇨🇱',
            'Colombia': '🇨🇴',
            'South Africa': '🇿🇦',
            'UAE': '🇦🇪',
            'Saudi Arabia': '🇸🇦',
            'Qatar': '🇶🇦',
            'Egypt': '🇪🇬',
            'Thailand': '🇹🇭',
            'Malaysia': '🇲🇾',
            'Indonesia': '🇮🇩',
            'Vietnam': '🇻🇳',
            'Philippines': '🇵🇭',
            'China': '🇨🇳',
            'Hongkong': '🇭🇰',
        };
        // Поиск по ключу (без учета регистра)
        for (const key in map) {
            if (name && name.toLowerCase().includes(key.toLowerCase())) {
                return map[key];
            }
        }
        return '🌐';
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
        if (this.state.updateTimer) {
            clearInterval(this.state.updateTimer);
        }
        this.state.observers.clear();
    }
}

// Глобальные функции для интерактивности

// Показать детали сервера
function showServerDetails(serverName) {
    const server = window.serverManager?.getServers().find(s => s.name === serverName);
    if (!server) return;
    
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4';
    modal.innerHTML = `
        <div class="neo-card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div class="flex items-center justify-between mb-6">
                <h3 class="text-2xl font-bold">${server.name}</h3>
                <button onclick="this.closest('.fixed').remove()" class="text-gray-400 hover:text-white transition-colors">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-4">
                    <div class="bg-white/5 rounded-lg p-4">
                        <h4 class="font-semibold mb-3">📊 Статус системы</h4>
                        <div class="space-y-3">
                            <div class="flex justify-between">
                                <span>Статус:</span>
                                <span class="font-medium ${window.serverManager.getStatusClass(server.status)}">
                                    ${window.serverManager.getStatusText(server.status)}
                                </span>
                            </div>
                            <div class="flex justify-between">
                                <span>Время работы:</span>
                                <span class="font-medium">${server.uptime}</span>
                            </div>
                            <div class="flex justify-between">
                                <span>Пинг:</span>
                                <span class="font-medium ${window.serverManager.getPingClass(server.ping_ms)}">
                                    ${server.ping_ms} мс
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-white/5 rounded-lg p-4">
                        <h4 class="font-semibold mb-3">👥 Пользователи</h4>
                        <div class="text-3xl font-bold text-purple-400 mb-2">
                            ${window.serverManager.formatNumber(server.users_online)}
                        </div>
                        <div class="text-sm opacity-70">активных подключений</div>
                    </div>
                </div>
                
                <div class="space-y-4">
                    <div class="bg-white/5 rounded-lg p-4">
                        <h4 class="font-semibold mb-3">⚡ Производительность</h4>
                        <div class="space-y-3">
                            <div>
                                <div class="flex justify-between mb-1">
                                    <span>CPU:</span>
                                    <span class="font-medium ${window.serverManager.getCpuClass(server.cpu_load)}">
                                        ${server.cpu_load}%
                                    </span>
                                </div>
                                <div class="w-full bg-white/10 rounded-full h-2">
                                    <div class="${window.serverManager.getCpuBarClass(server.cpu_load)} h-2 rounded-full" 
                                         style="width: ${server.cpu_load}%"></div>
                                </div>
                            </div>
                            ${server.ram_usage ? `
                            <div>
                                <div class="flex justify-between mb-1">
                                    <span>RAM:</span>
                                    <span class="font-medium ${window.serverManager.getRamClass(server.ram_usage)}">
                                        ${server.ram_usage}%
                                    </span>
                                </div>
                                <div class="w-full bg-white/10 rounded-full h-2">
                                    <div class="${window.serverManager.getRamBarClass(server.ram_usage)} h-2 rounded-full" 
                                         style="width: ${server.ram_usage}%"></div>
                                </div>
                            </div>
                            ` : ''}
                        </div>
                    </div>
                    
                    <div class="bg-white/5 rounded-lg p-4">
                        <h4 class="font-semibold mb-3">🌍 Информация</h4>
                        <div class="space-y-2 text-sm">
                            <div class="flex justify-between">
                                <span>Регион:</span>
                                <span class="font-medium">${window.serverManager.getRegionName(server.name)}</span>
                            </div>
                            <div class="flex justify-between">
                                <span>Последнее обновление:</span>
                                <span class="font-medium">${window.serverManager.formatTime(window.serverManager.getLastUpdate())}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="mt-6 pt-4 border-t border-white/10 flex gap-3">
                <button onclick="copyServerInfo('${server.name}')" class="neo-button flex-1">
                    <i class="fas fa-copy mr-2"></i>
                    Копировать информацию
                </button>
                <button onclick="pingServer('${server.name}')" class="neo-button flex-1">
                    <i class="fas fa-network-wired mr-2"></i>
                    Проверить пинг
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Закрытие по клику вне модала
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
}

// Копировать информацию о сервере
function copyServerInfo(serverName) {
    const server = window.serverManager?.getServers().find(s => s.name === serverName);
    if (!server) return;
    
    const info = `
ROX.VPN - ${server.name}
Статус: ${window.serverManager.getStatusText(server.status)}
Пинг: ${server.ping_ms}мс
Пользователи: ${window.serverManager.formatNumber(server.users_online)}
CPU: ${server.cpu_load}%
Время работы: ${server.uptime}
Обновлено: ${window.serverManager.formatTime(window.serverManager.getLastUpdate())}
    `.trim();
    
    navigator.clipboard.writeText(info).then(() => {
        showNotification('Информация скопирована в буфер обмена', 'success');
    }).catch(() => {
        showNotification('Не удалось скопировать информацию', 'error');
    });
}

// Проверить пинг сервера
function pingServer(serverName) {
    const server = window.serverManager?.getServers().find(s => s.name === serverName);
    if (!server) return;
    
    showNotification('Проверка пинга...', 'info');
    
    // Имитация проверки пинга (в реальном приложении здесь был бы API запрос)
    setTimeout(() => {
        const ping = Math.floor(Math.random() * 100) + 20; // 20-120мс
        showNotification(`Пинг до ${server.name}: ${ping}мс`, 'success');
    }, 1000);
}

// Показать уведомление
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-20 right-4 z-[70] p-4 rounded-lg shadow-lg transition-all duration-300 transform translate-x-full`;
    
    const colors = {
        success: 'bg-green-500/90 text-white',
        error: 'bg-red-500/90 text-white',
        info: 'bg-blue-500/90 text-white',
        warning: 'bg-yellow-500/90 text-white'
    };
    
    notification.className += ` ${colors[type] || colors.info}`;
    notification.innerHTML = `
        <div class="flex items-center gap-3">
            <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'times' : 'info'}-circle"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-2 hover:opacity-70">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Анимация появления
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    // Автоматическое скрытие
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    window.serverManager = new ServerStatusManager({
        apiUrl: '/api/server-statuses',
        updateInterval: 30000,
        enableAnalytics: true
    });
});

// Экспорт для использования
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ServerStatusManager;
} else {
    window.ServerStatusManager = ServerStatusManager;
} 