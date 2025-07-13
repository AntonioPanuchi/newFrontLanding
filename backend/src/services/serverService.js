const { logger } = require('../utils/logger');
const { sleep } = require('../utils/helpers');

class ServerService {
    constructor() {
        this.cookieCache = {};
        this.cachedStatuses = [];
        this.lastFetchTime = 0;
        this.CACHE_DURATION = 60 * 1000; // 60 секунд
        this.COOKIE_CACHE_DURATION = 55 * 60 * 1000; // 55 минут
        
        this.SERVER_CONFIGS = [
            { 
                name: "Germany", 
                baseUrl: process.env.GERMANY_API_URL,
                username: process.env.USERNAME,
                password: process.env.PASSWORD,
                pingHost: process.env.PINGHOST1
            },
            { 
                name: "USA", 
                baseUrl: process.env.USA_API_URL,
                username: process.env.USERNAME,
                password: process.env.PASSWORD,
                pingHost: process.env.PINGHOST2
            },
            { 
                name: "Finland", 
                baseUrl: process.env.FINLAND_API_URL,
                username: process.env.USERNAME,
                password: process.env.PASSWORD,
                pingHost: process.env.PINGHOST3
            }
        ];
    }

    async getAllServerStatuses() {
        const now = Date.now();
        
        // Проверяем кэш
        if (now - this.lastFetchTime < this.CACHE_DURATION && this.cachedStatuses.length > 0) {
            logger.debug('Returning cached server statuses');
            return this.cachedStatuses;
        }

        logger.info('Fetching fresh server statuses');
        
        try {
            const serverPromises = this.SERVER_CONFIGS.map(server => 
                this.getServerStatus(server)
            );
            
            const results = await Promise.allSettled(serverPromises);
            const servers = results.map(result => 
                result.status === 'fulfilled' ? result.value : this.createErrorServer(result.reason)
            );
            
            this.cachedStatuses = servers;
            this.lastFetchTime = now;
            
            return servers;
        } catch (error) {
            logger.error('Error fetching server statuses:', error);
            throw error;
        }
    }

    async getServerStatus(server) {
        try {
            const [statusData, pingResult] = await Promise.all([
                this.fetchServerData(server),
                this.pingServer(server.pingHost)
            ]);

            // Определяем статус на основе состояния xray
            const status = statusData.xray && statusData.xray.state === 'running' ? 'online' : 'offline';
            
            // Вычисляем использование памяти в процентах
            const memUsagePercent = statusData.mem ? 
                Math.round((statusData.mem.current / statusData.mem.total) * 100) : 0;

            // Подсчитываем пользователей онлайн на основе времени суток
            const hour = new Date().getHours();
            let baseUsers = 15; // базовое количество пользователей
            
            // Увеличиваем количество пользователей в пиковые часы
            if (hour >= 9 && hour <= 12) baseUsers = 35; // утренний пик
            else if (hour >= 18 && hour <= 23) baseUsers = 45; // вечерний пик
            else if (hour >= 0 && hour <= 6) baseUsers = 8; // ночные часы
            
            // Добавляем случайность ±30%
            const variation = Math.floor(baseUsers * 0.3);
            const usersOnline = Math.max(1, baseUsers + Math.floor(Math.random() * (variation * 2 + 1)) - variation);

            return {
                name: server.name,
                status: status,
                uptime: statusData.uptime || 'N/A',
                ping_ms: pingResult.time ? Math.round(pingResult.time) : -1,
                users_online: usersOnline,
                cpu_load: Math.round(statusData.cpu || 0),
                mem_used: statusData.mem ? statusData.mem.current : 0,
                mem_total: statusData.mem ? statusData.mem.total : 0,
                traffic_used: Math.floor(Math.random() * 1000000000) + 100000000, // Временная заглушка
                lastUpdate: new Date().toISOString()
            };
        } catch (error) {
            logger.error(`Error getting status for ${server.name}:`, error);
            return this.createErrorServer(error, server.name);
        }
    }

    async fetchServerData(server) {
        const cookie = await this.getCookie(server);
        const statusUrl = `${server.baseUrl}/server/status`;
        
        // Используем POST метод с пустым телом для получения статуса сервера
        const response = await this.fetchDataWithRetry(statusUrl, cookie, 'POST', 3, {});
        return response.obj; // Возвращаем только объект с данными
    }

    async getCookie(server) {
        const cacheKey = `${server.name}_cookie`;
        const now = Date.now();
        
        // Проверяем кэш cookie
        if (this.cookieCache[cacheKey] && 
            now - this.cookieCache[cacheKey].timestamp < this.COOKIE_CACHE_DURATION) {
            return this.cookieCache[cacheKey].cookie;
        }

        const loginUrl = `${server.baseUrl}/login`;
        const loginData = {
            username: server.username,
            password: server.password
        };

        try {
            const response = await fetch(loginUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData)
            });

            if (!response.ok) {
                throw new Error(`Login failed for ${server.name}: ${response.status}`);
            }

            const cookies = response.headers.get('set-cookie');
            if (!cookies) {
                throw new Error(`No cookies received for ${server.name}`);
            }

            // Кэшируем cookie
            this.cookieCache[cacheKey] = {
                cookie: cookies,
                timestamp: now
            };

            return cookies;
        } catch (error) {
            logger.error(`Error getting cookie for ${server.name}:`, error);
            throw error;
        }
    }

    async fetchDataWithRetry(url, cookie, method = 'GET', retries = 3, body = null) {
        for (let i = 0; i < retries; i++) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 15000);
                
                const requestOptions = {
                    method,
                    headers: {
                        'Cookie': cookie,
                        'Content-Type': 'application/json',
                    },
                    signal: controller.signal
                };
                
                // Добавляем тело запроса, если оно предоставлено
                if (body !== null) {
                    requestOptions.body = JSON.stringify(body);
                }
                
                const response = await fetch(url, requestOptions);
                
                clearTimeout(timeoutId);

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                return await response.json();
            } catch (error) {
                logger.warn(`Attempt ${i + 1} failed for ${url}:`, error.message);
                
                if (i === retries - 1) {
                    throw error;
                }
                
                await sleep(1000 * (i + 1)); // Экспоненциальная задержка
            }
        }
    }

    async pingServer(host) {
        try {
            // Используем HTTP ping вместо ICMP ping (работает в любом окружении)
            const startTime = Date.now();
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);
            
            const response = await fetch(`http://${host}`, {
                method: 'HEAD', // Используем HEAD для минимального трафика
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            const endTime = Date.now();
            const pingTime = endTime - startTime;
            
            return {
                alive: response.ok,
                time: response.ok ? pingTime : null
            };
        } catch (error) {
            logger.error(`HTTP ping error for ${host}:`, error);
            return { alive: false, time: null };
        }
    }

    createErrorServer(error, serverName = 'Unknown') {
        return {
            name: serverName,
            status: 'error',
            uptime: 'N/A',
            ping: 'N/A',
            users: 0,
            lastUpdate: new Date().toISOString(),
            error: error.message
        };
    }
}

module.exports = ServerService; 