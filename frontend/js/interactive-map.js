/**
 * InteractiveWorldMap - Интерактивная карта мира с серверами
 */
class InteractiveWorldMap {
    constructor(containerId = 'world-map-container') {
        this.container = document.getElementById(containerId);
        this.servers = [
            { 
                name: 'Germany', 
                lat: 51.1657, 
                lng: 10.4515, 
                status: 'online',
                users: 1250,
                ping: 45,
                color: '#22c55e'
            },
            { 
                name: 'USA', 
                lat: 39.8283, 
                lng: -98.5795, 
                status: 'online',
                users: 2100,
                ping: 120,
                color: '#0ea5e9'
            },
            { 
                name: 'Finland', 
                lat: 61.9241, 
                lng: 25.7482, 
                status: 'online',
                users: 850,
                ping: 35,
                color: '#8b5cf6'
            }
        ];
        
        this.isInitialized = false;
        this.activeServer = null;
        
        this.init();
    }

    init() {
        if (!this.container) {
            console.warn('World map container not found');
            return;
        }

        this.createMap();
        this.addServerMarkers();
        this.addInteractions();
        this.startAnimations();
        this.isInitialized = true;
    }

    createMap() {
        this.container.innerHTML = `
            <div class="world-map-wrapper relative w-full h-64 md:h-80 rounded-lg overflow-hidden bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-white/10">
                <div class="world-map-bg absolute inset-0 opacity-20">
                    <svg viewBox="0 0 1000 500" class="w-full h-full">
                        <!-- Упрощенная карта мира -->
                        <path d="M150,200 Q200,180 250,200 T350,200 Q400,220 450,200 T550,200 Q600,180 650,200 T750,200" 
                              fill="none" stroke="currentColor" stroke-width="1" class="text-white/30"/>
                        <path d="M200,250 Q250,230 300,250 T400,250 Q450,270 500,250 T600,250 Q650,230 700,250" 
                              fill="none" stroke="currentColor" stroke-width="1" class="text-white/30"/>
                        <path d="M250,300 Q300,280 350,300 T450,300 Q500,320 550,300 T650,300 Q700,280 750,300" 
                              fill="none" stroke="currentColor" stroke-width="1" class="text-white/30"/>
                    </svg>
                </div>
                
                <div class="server-markers absolute inset-0"></div>
                
                <div class="map-overlay absolute inset-0 pointer-events-none">
                    <div class="connection-lines"></div>
                </div>
                
                <div class="map-legend absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg p-3 text-xs">
                    <div class="flex items-center gap-4">
                        <div class="flex items-center gap-2">
                            <div class="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                            <span class="text-white/80">Онлайн</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <div class="w-3 h-3 bg-red-400 rounded-full"></div>
                            <span class="text-white/80">Оффлайн</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.markersContainer = this.container.querySelector('.server-markers');
        this.connectionLines = this.container.querySelector('.connection-lines');
    }

    addServerMarkers() {
        this.servers.forEach((server, index) => {
            const marker = this.createServerMarker(server, index);
            this.markersContainer.appendChild(marker);
        });
    }

    createServerMarker(server, index) {
        const marker = document.createElement('div');
        marker.className = 'server-marker absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300';
        marker.style.left = `${this.lngToX(server.lng)}%`;
        marker.style.top = `${this.latToY(server.lat)}%`;
        marker.dataset.serverIndex = index;

        const statusClass = server.status === 'online' ? 'online' : 'offline';
        const pulseClass = server.status === 'online' ? 'animate-pulse' : '';

        marker.innerHTML = `
            <div class="relative">
                <!-- Основная точка -->
                <div class="w-4 h-4 ${server.color} rounded-full shadow-lg border-2 border-white/20 ${pulseClass}"></div>
                
                <!-- Пульсирующий круг -->
                <div class="absolute inset-0 w-4 h-4 ${server.color} rounded-full opacity-30 animate-ping"></div>
                
                <!-- Информационная панель -->
                <div class="server-info absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 pointer-events-none transition-opacity duration-300 bg-black/90 backdrop-blur-sm rounded-lg p-3 text-xs text-white min-w-32 z-10">
                    <div class="text-center">
                        <div class="font-semibold text-sm mb-1">${server.name}</div>
                        <div class="flex items-center justify-center gap-1 mb-1">
                            <div class="w-2 h-2 ${server.status === 'online' ? 'bg-green-400' : 'bg-red-400'} rounded-full"></div>
                            <span class="text-xs">${server.status === 'online' ? 'Онлайн' : 'Оффлайн'}</span>
                        </div>
                        <div class="text-xs text-gray-300">
                            <div>Пользователей: ${server.users}</div>
                            <div>Ping: ${server.ping}ms</div>
                        </div>
                    </div>
                    <!-- Стрелка -->
                    <div class="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/90"></div>
                </div>
            </div>
        `;

        return marker;
    }

    addInteractions() {
        this.markersContainer.addEventListener('mouseover', (e) => {
            const marker = e.target.closest('.server-marker');
            if (marker) {
                this.showServerInfo(marker);
            }
        });

        this.markersContainer.addEventListener('mouseout', (e) => {
            const marker = e.target.closest('.server-marker');
            if (marker) {
                this.hideServerInfo(marker);
            }
        });

        this.markersContainer.addEventListener('click', (e) => {
            const marker = e.target.closest('.server-marker');
            if (marker) {
                this.selectServer(marker);
            }
        });
    }

    showServerInfo(marker) {
        const info = marker.querySelector('.server-info');
        if (info) {
            info.classList.remove('opacity-0', 'pointer-events-none');
            info.classList.add('opacity-100');
        }
    }

    hideServerInfo(marker) {
        const info = marker.querySelector('.server-info');
        if (info) {
            info.classList.add('opacity-0', 'pointer-events-none');
            info.classList.remove('opacity-100');
        }
    }

    selectServer(marker) {
        const serverIndex = parseInt(marker.dataset.serverIndex);
        const server = this.servers[serverIndex];
        
        // Убираем выделение с предыдущего сервера
        this.markersContainer.querySelectorAll('.server-marker').forEach(m => {
            m.classList.remove('scale-125', 'z-10');
        });
        
        // Выделяем выбранный сервер
        marker.classList.add('scale-125', 'z-10');
        
        // Показываем уведомление
        if (window.ROXNotifications) {
            window.ROXNotifications.show(
                `Выбран сервер ${server.name} (Ping: ${server.ping}ms)`, 
                'info', 
                3000
            );
        }
        
        this.activeServer = server;
        this.createConnectionLines(server);
    }

    createConnectionLines(server) {
        this.connectionLines.innerHTML = '';
        
        // Создаем линии подключения от центра к серверу
        const centerX = 50;
        const centerY = 50;
        const serverX = this.lngToX(server.lng);
        const serverY = this.latToY(server.lat);
        
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        line.setAttribute('viewBox', '0 0 100 100');
        line.style.position = 'absolute';
        line.style.top = '0';
        line.style.left = '0';
        line.style.width = '100%';
        line.style.height = '100%';
        line.style.pointerEvents = 'none';
        
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', `M ${centerX} ${centerY} L ${serverX} ${serverY}`);
        path.setAttribute('stroke', server.color);
        path.setAttribute('stroke-width', '2');
        path.setAttribute('stroke-dasharray', '5,5');
        path.setAttribute('fill', 'none');
        path.style.animation = 'dash 2s linear infinite';
        
        line.appendChild(path);
        this.connectionLines.appendChild(line);
    }

    startAnimations() {
        // Анимация появления маркеров
        this.markersContainer.querySelectorAll('.server-marker').forEach((marker, index) => {
            marker.style.opacity = '0';
            marker.style.transform = 'translate(-50%, -50%) scale(0)';
            
            setTimeout(() => {
                marker.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
                marker.style.opacity = '1';
                marker.style.transform = 'translate(-50%, -50%) scale(1)';
            }, index * 200);
        });
    }

    updateServerStatus(serverName, status, users, ping) {
        const server = this.servers.find(s => s.name === serverName);
        if (server) {
            server.status = status;
            server.users = users;
            server.ping = ping;
            
            // Обновляем маркер
            const marker = this.markersContainer.querySelector(`[data-server-index="${this.servers.indexOf(server)}"]`);
            if (marker) {
                const dot = marker.querySelector('.w-4.h-4');
                const pulse = marker.querySelector('.animate-ping');
                
                if (status === 'online') {
                    dot.classList.add('animate-pulse');
                    pulse.classList.add('animate-ping');
                } else {
                    dot.classList.remove('animate-pulse');
                    pulse.classList.remove('animate-ping');
                }
            }
        }
    }

    // Утилиты для конвертации координат
    lngToX(lng) {
        return ((lng + 180) / 360) * 100;
    }

    latToY(lat) {
        return ((90 - lat) / 180) * 100;
    }

    // Публичные методы
    refresh() {
        if (this.isInitialized) {
            this.startAnimations();
        }
    }

    destroy() {
        if (this.container) {
            this.container.innerHTML = '';
        }
        this.isInitialized = false;
    }
}

// Добавляем CSS анимации
const style = document.createElement('style');
style.textContent = `
    @keyframes dash {
        to {
            stroke-dashoffset: -10;
        }
    }
    
    .server-marker:hover {
        transform: translate(-50%, -50%) scale(1.2) !important;
    }
    
    .server-marker.selected {
        transform: translate(-50%, -50%) scale(1.3) !important;
    }
`;
document.head.appendChild(style);

// Экспорт для использования
window.InteractiveWorldMap = InteractiveWorldMap; 