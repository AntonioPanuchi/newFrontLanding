const ping = require('ping');

function formatUptime(seconds) {
    if (!seconds || seconds <= 0) return 'N/A';
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor(seconds % (3600 * 24) / 3600);
    const m = Math.floor(seconds % 3600 / 60);
    let result = '';
    if (d > 0) result += `${d}д `;
    if (h > 0) result += `${h}ч `;
    if (m > 0) result += `${m}м`;
    return result.trim() || 'Только что';
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function pingServer(host) {
    try {
        const res = await ping.promise.probe(host, { timeout: 5 });
        return { time: res.time !== 'unknown' ? res.time : -1, alive: res.alive };
    } catch (error) {
        return { time: -1, alive: false };
    }
}

async function getCookie(server, cookieCache, logger) {
    const cached = cookieCache[server.baseUrl];
    const now = Date.now();
    if (cached && cached.expiresAt > now) {
        logger && logger.debug && logger.debug(`Using cached cookie for ${server.name}`);
        return cached.cookie;
    }
    logger && logger.info && logger.info(`Attempting to log in to ${server.name}`);
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        const response = await fetch(`${server.baseUrl}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'ROX-VPN-Monitor/1.0',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ username: server.username, password: server.password }),
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Login failed: HTTP ${response.status} - ${errorText}`);
        }
        const cookie = response.headers.get('set-cookie');
        if (!cookie) {
            const responseText = await response.text();
            throw new Error(`No 'set-cookie' header returned. Response: ${responseText}`);
        }
        cookieCache[server.baseUrl] = {
            cookie,
            expiresAt: now + (55 * 60 * 1000)
        };
        logger && logger.info && logger.info(`Successfully logged in to ${server.name}`);
        return cookie;
    } catch (error) {
        logger && logger.error && logger.error(`Failed to get cookie for ${server.name}:`, {
            error: error.message,
            stack: error.stack
        });
        throw error;
    }
}

async function fetchDataWithRetry(url, cookie, method = 'GET', retries = 3, logger, serverName, apiName) {
    for (let i = 0; i < retries; i++) {
        const start = Date.now();
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);
            const response = await fetch(url, {
                method,
                headers: {
                    'Cookie': cookie,
                    'Accept': 'application/json, text/plain, */*',
                    'User-Agent': 'ROX-VPN-Monitor/1.0',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            const duration = Date.now() - start;
            if (logger && logger.info) {
                logger.info(`API response time: ${serverName} ${apiName} ${duration}ms`, {
                    server: serverName,
                    api: apiName,
                    duration
                });
            }
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            const textResponse = await response.text();
            if (!textResponse) {
                throw new Error('Empty response received');
            }
            let data;
            try {
                data = JSON.parse(textResponse);
            } catch (parseError) {
                throw new Error(`Invalid JSON response: ${parseError.message}`);
            }
            if (data.success === false) {
                throw new Error(`API error: ${data.msg || 'Request not successful'}`);
            }
            if (typeof data.obj !== 'undefined') return data.obj;
            if (typeof data.data !== 'undefined') return data.data;
            return data;
        } catch (error) {
            if (i === retries - 1) {
                throw error;
            }
            await sleep(1000 * (i + 1));
        }
    }
}

async function getServerStatus(server, cookieCache, logger, prevStatus = null) {
    let currentStatus = 'offline';
    try {
        const cookie = await getCookie(server, cookieCache, logger);
        const STATUS_PATH = '/server/status';
        const INBOUNDS_PATH = '/panel/inbound/list';
        const ONLINE_USERS_PATH = '/panel/inbound/onlines';
        const [systemStatus, inboundList, onlineUsers, pingResult] = await Promise.all([
            fetchDataWithRetry(`${server.baseUrl}${STATUS_PATH}`, cookie, 'POST', 3, logger, server.name, 'status'),
            fetchDataWithRetry(`${server.baseUrl}${INBOUNDS_PATH}`, cookie, 'POST', 3, logger, server.name, 'inbound-list'),
            fetchDataWithRetry(`${server.baseUrl}${ONLINE_USERS_PATH}`, cookie, 'POST', 3, logger, server.name, 'online-users'),
            pingServer(server.pingHost || new URL(server.baseUrl).hostname)
        ]);
        if (!systemStatus || !inboundList) {
            throw new Error('Missing required API response data');
        }
        let trafficUsed = 0;
        if (Array.isArray(inboundList)) {
            inboundList.forEach(inbound => {
                if (inbound.enable) {
                    trafficUsed += (inbound.up || 0) + (inbound.down || 0);
                }
            });
        }
        const cpuCores = systemStatus.cpuCores || 1;
        let cpuLoad = 0;
        if (Array.isArray(systemStatus.loads) && systemStatus.loads.length) {
            cpuLoad = (systemStatus.loads[0] / cpuCores) * 100;
        } else if (typeof systemStatus.cpu === 'number' && systemStatus.cpu > 0 && systemStatus.cpu <= 100) {
            cpuLoad = systemStatus.cpu;
        }
        cpuLoad = Number(Math.min(cpuLoad, 100).toFixed(2));
        currentStatus = 'online';
        // Логирование смены статуса
        if (prevStatus && prevStatus !== currentStatus && logger && logger.info) {
            logger.info(`Server status changed: ${server.name} ${prevStatus} → ${currentStatus}`);
        }
        return {
            name: server.name,
            status: currentStatus,
            uptime: formatUptime(systemStatus.uptime),
            users_online: Array.isArray(onlineUsers) ? onlineUsers.length : 0,
            traffic_used: trafficUsed,
            cpu_load: parseFloat(cpuLoad),
            mem_used: systemStatus.mem?.current || 0,
            mem_total: systemStatus.mem?.total || 0,
            ping_ms: pingResult.time
        };
    } catch (error) {
        if (logger && logger.error) {
            logger.error(`Error fetching status for ${server.name}:`, {
                error: error.message,
                stack: error.stack,
                server: server.name
            });
        }
        // Логирование смены статуса
        if (prevStatus && prevStatus !== 'offline' && logger && logger.warn) {
            logger.warn(`Server status changed: ${server.name} ${prevStatus} → offline`);
        }
        return {
            name: server.name,
            status: 'offline',
            uptime: 'N/A',
            users_online: 0,
            traffic_used: 0,
            cpu_load: 0,
            mem_used: 0,
            mem_total: 0,
            ping_ms: -1
        };
    }
}

module.exports = {
    formatUptime,
    sleep,
    pingServer,
    getCookie,
    fetchDataWithRetry,
    getServerStatus
}; 