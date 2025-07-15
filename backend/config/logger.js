const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');
const fs = require('fs');

function createLogger(logsDir, logLevel, nodeEnv = 'development') {
    if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir, { recursive: true });
    }
    const logger = winston.createLogger({
        level: logLevel,
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
    if (nodeEnv !== 'production') {
        logger.add(new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        }));
    }
    return logger;
}

module.exports = { createLogger }; 