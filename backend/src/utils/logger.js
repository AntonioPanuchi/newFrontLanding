const winston = require('winston');
const path = require('path');
const fs = require('fs');

// Создаем директорию для логов если её нет (асинхронно)
const logsDir = path.join(__dirname, '../../logs');
fs.promises.mkdir(logsDir, { recursive: true }).catch(() => {});

// Создаем логгер
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),
    defaultMeta: { 
        service: 'rox-vpn-api',
        version: process.env.npm_package_version || '1.0.0'
    },
    transports: [
        new winston.transports.File({ 
            filename: path.join(logsDir, 'error.log'), 
            level: 'error',
            maxsize: 5242880, // 5MB
            maxFiles: 5
        }),
        new winston.transports.File({ 
            filename: path.join(logsDir, 'combined.log'),
            maxsize: 5242880, // 5MB
            maxFiles: 5
        }),
    ]
});

// В development режиме также логируем в консоль
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
        )
    }));
}

// Middleware для логирования HTTP запросов
const requestLogger = (req, res, next) => {
    const start = Date.now();
    
    logger.debug('Incoming request:', {
        method: req.method,
        url: req.url,
        origin: req.get('Origin'),
        userAgent: req.get('User-Agent'),
        ip: req.ip || req.connection.remoteAddress
    });
    
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
};

module.exports = {
    logger,
    requestLogger
}; 