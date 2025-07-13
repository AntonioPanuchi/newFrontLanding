const ping = require('ping');
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

            return {
                name: server.name,
                status: statusData.status || 'unknown',
                uptime: statusData.uptime || 'N/A',
                ping: pingResult.time || 'N/A',
                users: statusData.users || 0,
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
        
        const response = await this.fetchDataWithRetry(statusUrl, cookie);
        return response;
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

    async fetchDataWithRetry(url, cookie, method = 'GET', retries = 3) {
        for (let i = 0; i < retries; i++) {
            try {
                const response = await fetch(url, {
                    method,
                    headers: {
                        'Cookie': cookie,
                        'Content-Type': 'application/json',
                    },
                    signal: AbortSignal.timeout(15000) // 15 секунд таймаут
                });

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
            const result = await ping.promise.probe(host, {
                timeout: 10,
                extra: ['-c', '1']
            });
            
            return {
                alive: result.alive,
                time: result.alive ? result.time : null
            };
        } catch (error) {
            logger.error(`Ping error for ${host}:`, error);
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