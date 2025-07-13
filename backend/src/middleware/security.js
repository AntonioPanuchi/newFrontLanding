const rateLimit = require('express-rate-limit');
const { logger } = require('../utils/logger');

// Rate limiting для API
const apiLimiter = rateLimit({
    trustProxy: true,
    validate: {
        trustProxy: true
    },
    windowMs: 60 * 1000, // 1 минута
    max: 3000, // 3000 запросов
    message: { 
        error: 'Слишком много запросов, попробуйте позже',
        retryAfter: '60'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
        // Пропускаем health check
        return req.path === '/health' || req.path === '/api/health';
    },
    handler: (req, _res) => {
        logger.warn('Rate limit exceeded', {
            ip: req.ip,
            path: req.path,
            userAgent: req.get('User-Agent')
        });
        _res.status(429).json({
            error: 'Слишком много запросов, попробуйте позже',
            retryAfter: '60'
        });
    }
});

// CORS настройки
const corsOptions = {
    origin(origin, callback) {
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

// Middleware для проверки API ключа (опционально)
const apiKeyAuth = (req, _res, next) => {
    const apiKey = req.headers['x-api-key'];
    
    if (!apiKey) {
        return next(); // Пропускаем если ключ не требуется
    }
    
    const validApiKey = process.env.API_KEY;
    
    if (!validApiKey || apiKey !== validApiKey) {
        logger.warn('Invalid API key provided', {
            ip: req.ip,
            path: req.path
        });
        return _res.status(401).json({
            error: 'Invalid API key'
        });
    }
    
    next();
};

// Middleware для логирования ошибок
const errorLogger = (err, req, res, _next) => {
    logger.error('Unhandled error:', {
        error: err.message,
        stack: err.stack,
        method: req.method,
        url: req.url,
        ip: req.ip,
        userAgent: req.get('User-Agent')
    });
    // Передаем ошибку дальше в следующий middleware
    _next(err);
};

// Middleware для обработки ошибок
const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    
    res.status(statusCode).json({
        error: message,
        timestamp: new Date().toISOString(),
        path: req.path
    });
};

module.exports = {
    apiLimiter,
    corsOptions,
    apiKeyAuth,
    errorLogger,
    errorHandler
}; 