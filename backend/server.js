const express = require('express');
const cors = require('cors');
const winston = require('winston');
const rateLimit = require('express-rate-limit');
const fs = require('fs');
const path = require('path');
const ping = require('ping');
const DailyRotateFile = require('winston-daily-rotate-file');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();

// --- ВАЛИДАЦИЯ ПЕРЕМЕННЫХ ОКРУЖЕНИЯ ---
const requiredEnvVars = [
    'GERMANY_API_URL',
    'USA_API_URL', 
    'FINLAND_API_URL',
    'USERNAME',
    'PASSWORD'
];

// Функция для валидации URL
function validateUrl(url, name) {
    if (!url) {
        throw new Error(`Missing ${name} URL`);
    }
    
    try {
        const urlObj = new URL(url);
        if (!['http:', 'https:'].includes(urlObj.protocol)) {
            throw new Error(`${name} URL must use HTTP or HTTPS protocol`);
        }
        if (!urlObj.hostname) {
            throw new Error(`${name} URL must have a valid hostname`);
        }
        return url;
    } catch (error) {
        if (error instanceof TypeError) {
            throw new Error(`${name} URL is not a valid URL: ${url}`);
        }
        throw error;
    }
}

// Функция для валидации учетных данных
function validateCredentials(username, password) {
    if (!username || username.trim().length === 0) {
        throw new Error('USERNAME cannot be empty');
    }
    
    if (username.length < 3) {
        throw new Error('USERNAME must be at least 3 characters long');
    }
    
    if (!password || password.trim().length === 0) {
        throw new Error('PASSWORD cannot be empty');
    }
    
    if (password.length < 8) {
        throw new Error('PASSWORD must be at least 8 characters long');
    }
    
    return { username: username.trim(), password: password.trim() };
}

// Функция для валидации опциональных переменных
function validateOptionalVars() {
    const optionalVars = {
        PORT: process.env.PORT || '3000',
        NODE_ENV: process.env.NODE_ENV || 'development',
        LOG_LEVEL: process.env.LOG_LEVEL || 'info'
    };
    
    // Валидация PORT
    const port = parseInt(optionalVars.PORT);
    if (isNaN(port) || port < 1 || port > 65535) {
        throw new Error(`PORT must be a number between 1 and 65535, got: ${optionalVars.PORT}`);
    }
    
    // Валидация NODE_ENV
    const validEnvs = ['development', 'production', 'test'];
    if (!validEnvs.includes(optionalVars.NODE_ENV)) {
        throw new Error(`NODE_ENV must be one of: ${validEnvs.join(', ')}, got: ${optionalVars.NODE_ENV}`);
    }
    
    // Валидация LOG_LEVEL
    const validLogLevels = ['error', 'warn', 'info', 'debug'];
    if (!validLogLevels.includes(optionalVars.LOG_LEVEL)) {
        throw new Error(`LOG_LEVEL must be one of: ${validLogLevels.join(', ')}, got: ${optionalVars.LOG_LEVEL}`);
    }
    
    return optionalVars;
}

// Выполняем валидацию
let germanyUrl, usaUrl, finlandUrl, credentials, optionalVars;

try {
    console.log('Starting environment variables validation...');
    
    // Проверяем наличие обязательных переменных
    const missingVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
    if (missingVars.length > 0) {
        throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }
    
    // Валидируем URL серверов
    germanyUrl = validateUrl(process.env.GERMANY_API_URL, 'GERMANY_API_URL');
    usaUrl = validateUrl(process.env.USA_API_URL, 'USA_API_URL');
    finlandUrl = validateUrl(process.env.FINLAND_API_URL, 'FINLAND_API_URL');
    
    // Валидируем учетные данные
    credentials = validateCredentials(process.env.USERNAME, process.env.PASSWORD);
    
    // Валидируем опциональные переменные
    optionalVars = validateOptionalVars();
    
    console.log('Environment variables validation completed successfully');
    
} catch (error) {
    console.error('Environment variables validation failed:', error.message);
    process.exit(1);
}

const port = optionalVars.PORT;

// --- СОЗДАНИЕ ДИРЕКТОРИИ ДЛЯ ЛОГОВ ---
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

// --- НАСТРОЙКА ЛОГИРОВАНИЯ ---
const logger = winston.createLogger({
    level: optionalVars.LOG_LEVEL,
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),
    defaultMeta: { service: 'rox-vpn-api' },
    transports: [
        new DailyRotateFile({
            filename: path.join(logsDir, 'error-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            level: 'error',
            maxSize: '10m',
            maxFiles: '5d',
            zippedArchive: true
        }),
        new DailyRotateFile({
            filename: path.join(logsDir, 'combined-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            maxSize: '10m',
            maxFiles: '5d',
            zippedArchive: true
        })
    ]
});

// В development режиме также логируем в консоль
if (optionalVars.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
        )
    }));
}

// --- КОНФИГУРАЦИЯ СЕРВЕРОВ ---
const SERVER_CONFIGS = [
    { 
        name: "Germany", 
        baseUrl: germanyUrl,
        username: credentials.username,
        password: credentials.password,
        pingHost: process.env.PINGHOST1
    },
    { 
        name: "USA", 
        baseUrl: usaUrl,
        username: credentials.username,
        password: credentials.password,
        pingHost: process.env.PINGHOST2
    },
    { 
        name: "Finland", 
        baseUrl: finlandUrl,
        username: credentials.username,
        password: credentials.password,
        pingHost: process.env.PINGHOST3
    }
];

// --- ПУТИ К API ---
const STATUS_PATH = '/server/status';
const INBOUNDS_PATH = '/panel/inbound/list';
const ONLINE_USERS_PATH = '/panel/inbound/onlines';

// --- КЭШИРОВАНИЕ И СОСТОЯНИЕ ---
const cookieCache = {};
let cachedStatuses = [];
let lastFetchTime = 0;
const CACHE_DURATION = 60 * 1000; // 60 секунд
const COOKIE_CACHE_DURATION = 55 * 60 * 1000; // 55 минут

// --- MIDDLEWARE ---
// доверяем первому прокси-хопу (Nginx / Cloudflare и т.д.)
app.set('trust proxy', 1);

// лимитатор только для /api
const limiter = rateLimit({
    trustProxy: true,              // ← обязателен
    validate: {                    // ← подстраховка: гасит ту же проверку
        trustProxy: true
    },
    windowMs: 60 * 1_000,          // 1 минута
    max: 3_000,                    // 3 000 запросов
    message: { error: 'Слишком много запросов, попробуйте позже' },
    standardHeaders: true,
    legacyHeaders: false,
    skip: req => req.path === '/health'
});

app.use('/api/', limiter);

// CORS настройки
const corsOptions = {
    origin: function (origin, callback) {
        logger.debug(`CORS check for origin: ${origin}`);
        // Разрешаем запросы без origin (например, из Postman)
        if (!origin) {
            logger.debug('Allowing request without origin');
            return callback(null, true);
        }
        const allowedOrigins = [
            'https://rx-test.ru',
            'https://www.rx-test.ru',
            'http://localhost:3000',
            'http://127.0.0.1:3000',
            'http://localhost:3001',
            'http://127.0.0.1:3001'
        ];
        logger.debug(`Checking if ${origin} is in allowed origins: ${allowedOrigins.join(', ')}`);
        if (allowedOrigins.indexOf(origin) !== -1) {
            logger.debug(`Origin ${origin} is allowed`);
            callback(null, true);
        } else {
            logger.warn(`Origin ${origin} is not allowed`);
            callback(new Error(`Not allowed by CORS: ${origin}`));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Origin', 'Accept']
};

app.use(cors(corsOptions));
app.use(express.json());

// Middleware для логирования запросов
app.use((req, res, next) => {
    const start = Date.now();
    
    res.on('finish', () => {
        const duration = Date.now() - start;
        logger.info({
            method: req.method,
            url: req.url,
            status: res.statusCode,
            duration: `${duration}ms`,
            ip: req.ip || req.connection.remoteAddress,
            userAgent: req.get('User-Agent')
        });
    });
    
    next();
});

// --- УТИЛИТЫ ---
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

// --- ФУНКЦИИ ДЛЯ РАБОТЫ С API ---

async function pingServer(host) {
    try {
        // Установите таймаут, например, 5 секунд
        const res = await ping.promise.probe(host, { timeout: 5 });
        // Возвращаем время пинга, или -1 если неизвестно/ошибка
        return { time: res.time !== 'unknown' ? res.time : -1, alive: res.alive };
    } catch (error) {
        logger.warn(`Ping failed for ${host}: ${error.message}`);
        return { time: -1, alive: false };
    }
}

async function getCookie(server) {
    const cached = cookieCache[server.baseUrl];
    const now = Date.now();
    
    // Проверяем кэш
    if (cached && cached.expiresAt > now) {
        logger.debug(`Using cached cookie for ${server.name}`);
        return cached.cookie;
    }

    logger.info(`Attempting to log in to ${server.name}`);
    
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 секунд таймаут
        
        const response = await fetch(`${server.baseUrl}/login`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'User-Agent': 'ROX-VPN-Monitor/1.0',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ 
                username: server.username, 
                password: server.password 
            }),
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
        
        // Кэшируем cookie
        cookieCache[server.baseUrl] = { 
            cookie, 
            expiresAt: now + COOKIE_CACHE_DURATION
        };
        
        logger.info(`Successfully logged in to ${server.name}`);
        return cookie;
        
    } catch (error) {
        logger.error(`Failed to get cookie for ${server.name}:`, {
            error: error.message,
            stack: error.stack
        });
        throw error;
    }
}

async function fetchDataWithRetry(url, cookie, method = 'GET', retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 секунд таймаут
            
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Cookie': cookie,
                    'Accept': 'application/json, text/plain, */*',
                    'User-Agent': 'ROX-VPN-Monitor/1.0',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
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
            
            // Проверяем успешность ответа API
            if (data.success === false) {
                throw new Error(`API error: ${data.msg || 'Request not successful'}`);
            }
            
            // Возвращаем данные в зависимости от структуры ответа
            if (typeof data.obj !== 'undefined') return data.obj;
            if (typeof data.data !== 'undefined') return data.data;
            return data;
            
        } catch (error) {
            logger.warn(`Attempt ${i + 1} failed for ${url}:`, {
                error: error.message,
                attempt: i + 1,
                maxRetries: retries
            });
            
            if (i === retries - 1) {
                throw error;
            }
            
            // Exponential backoff
            await sleep(1000 * (i + 1));
        }
    }
}

async function getServerStatus(server) {
    try {
        const cookie = await getCookie(server);

        // Параллельно получаем все данные
        const [systemStatus, inboundList, onlineUsers, pingResult] = await Promise.all([
            fetchDataWithRetry(`${server.baseUrl}${STATUS_PATH}`, cookie, 'POST'),
            fetchDataWithRetry(`${server.baseUrl}${INBOUNDS_PATH}`, cookie, 'POST'),
            fetchDataWithRetry(`${server.baseUrl}${ONLINE_USERS_PATH}`, cookie, 'POST'),
            // Используем pingHost, если указан, иначе парсим хост из baseUrl
            pingServer(server.pingHost || new URL(server.baseUrl).hostname)
        ]);

        // Проверяем, что получили необходимые данные
        if (!systemStatus || !inboundList) {
            throw new Error('Missing required API response data');
        }

        // Подсчитываем использованный трафик
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
        // Рассчитываем загрузку CPU
        if (Array.isArray(systemStatus.loads) && systemStatus.loads.length) {
            // минутный load-avg → %
            cpuLoad = (systemStatus.loads[0] / cpuCores) * 100;
        } else if (typeof systemStatus.cpu === 'number' &&
                   systemStatus.cpu > 0 && systemStatus.cpu <= 100) {
            // API вернул готовый процент
            cpuLoad = systemStatus.cpu;
        }
        cpuLoad = Number(Math.min(cpuLoad, 100).toFixed(2)); // 0-100 %

        return {
            name: server.name,
            status: 'online',
            uptime: formatUptime(systemStatus.uptime),
            users_online: Array.isArray(onlineUsers) ? onlineUsers.length : 0,
            traffic_used: trafficUsed,
            cpu_load: parseFloat(cpuLoad),
            mem_used: systemStatus.mem?.current || 0,
            mem_total: systemStatus.mem?.total || 0,
            ping_ms: pingResult.time // Добавляем время пинга в миллисекундах
        };

    } catch (error) {
        logger.error(`Error fetching status for ${server.name}:`, {
            error: error.message,
            stack: error.stack,
            server: server.name
        });

        return {
            name: server.name,
            status: 'offline',
            uptime: 'N/A',
            users_online: 0,
            traffic_used: 0,
            cpu_load: 0,
            mem_used: 0,
            mem_total: 0,
            ping_ms: -1 // Указываем, что пинг недоступен
        };
    }
}

// --- МАРШРУТЫ ---

// Health check endpoint
app.get('/health', (req, res) => {
    const healthCheck = {
        status: 'OK',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || '1.0.0',
        cache: {
            servers: cachedStatuses.length,
            lastUpdate: lastFetchTime > 0 ? new Date(lastFetchTime).toISOString() : null,
            cacheAge: lastFetchTime > 0 ? Date.now() - lastFetchTime : null
        },
        memory: {
            used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
            total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024)
        }
    };
    
    res.status(200).json(healthCheck);
});

// Основной endpoint для получения статусов серверов
app.get('/api/server-statuses', async (req, res) => {
    const now = Date.now();
    
    // Проверяем кэш
    if (cachedStatuses.length > 0 && (now - lastFetchTime < CACHE_DURATION)) {
        logger.debug('Returning cached server statuses');
        return res.json(cachedStatuses);
    }

    logger.info('Fetching fresh server statuses...');
    
    try {
        // Получаем статусы всех серверов параллельно
        const statusPromises = SERVER_CONFIGS.map(server => getServerStatus(server));
        const statuses = await Promise.all(statusPromises);
        
        // Обновляем кэш
        cachedStatuses = statuses;
        lastFetchTime = now;
        
        logger.info('Successfully fetched server statuses', {
            serversCount: statuses.length,
            onlineServers: statuses.filter(s => s.status === 'online').length
        });
        
        res.json(statuses);
        
    } catch (error) {
        logger.error('Error in /api/server-statuses endpoint:', {
            error: error.message,
            stack: error.stack
        });
        
        // Если есть кэшированные данные, возвращаем их
        if (cachedStatuses.length > 0) {
            logger.warn('Returning stale cached data due to error');
            return res.json(cachedStatuses);
        }
        
        // Иначе возвращаем ошибку
        res.status(500).json({
            error: 'Failed to fetch server statuses',
            message: 'Временная ошибка сервера. Попробуйте позже.'
        });
    }
});

// Endpoint для принудительного обновления кэша
app.post('/api/refresh-cache', async (req, res) => {
    logger.info('Manual cache refresh requested');
    
    try {
        const statusPromises = SERVER_CONFIGS.map(server => getServerStatus(server));
        const statuses = await Promise.all(statusPromises);
        
        cachedStatuses = statuses;
        lastFetchTime = Date.now();
        
        logger.info('Cache refreshed successfully');
        res.json({ 
            success: true, 
            message: 'Cache refreshed successfully',
            data: statuses 
        });
        
    } catch (error) {
        logger.error('Error refreshing cache:', {
            error: error.message,
            stack: error.stack
        });
        
        res.status(500).json({
            success: false,
            error: 'Failed to refresh cache',
            message: error.message
        });
    }
});

// Статические файлы (после API маршрутов)
app.use(express.static(path.join(__dirname, '..', 'frontend'), {
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
        }
    }
}));

// Serve index.html for root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: 'The requested endpoint does not exist'
    });
});

// Global error handler
app.use((error, req, res, next) => {
    logger.error('Unhandled error:', {
        error: error.message,
        stack: error.stack,
        url: req.url,
        method: req.method
    });
    
    res.status(500).json({
        error: 'Internal Server Error',
        message: 'Something went wrong on our end'
    });
});

// --- ЗАПУСК СЕРВЕРА ---
const server = app.listen(port, () => {
    logger.info(`ROX VPN API server started on port ${port}`, {
        port: port,
        environment: process.env.NODE_ENV || 'development',
        serversConfigured: SERVER_CONFIGS.length
    });
});

// --- GRACEFUL SHUTDOWN ---
process.on('SIGTERM', () => {
    logger.info('SIGTERM received, shutting down gracefully');
    server.close(() => {
        logger.info('Process terminated');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    logger.info('SIGINT received, shutting down gracefully');
    server.close(() => {
        logger.info('Process terminated');
        process.exit(0);
    });
});

// Обработка необработанных исключений
process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', {
        error: error.message,
        stack: error.stack
    });
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', {
        promise: promise,
        reason: reason
    });
    process.exit(1);
});

module.exports = app;