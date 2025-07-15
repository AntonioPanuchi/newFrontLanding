const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');
const fs = require('fs');

function createLogger(logsDir, logLevel, nodeEnv = 'development', label = 'backend') {
    // Логи всегда в корневой папке logs
    const rootLogsDir = path.resolve(__dirname, '../../logs');
    if (!fs.existsSync(rootLogsDir)) {
        fs.mkdirSync(rootLogsDir, { recursive: true });
    }
    const logger = winston.createLogger({
        level: logLevel,
        format: winston.format.combine(
            winston.format.label({ label }),
            winston.format.timestamp(),
            winston.format.errors({ stack: true }),
            winston.format.json()
        ),
        defaultMeta: { service: 'rox-vpn-api' },
        transports: [
            new DailyRotateFile({
                filename: path.join(rootLogsDir, `${label}-error-%DATE%.log`),
                datePattern: 'YYYY-MM-DD',
                level: 'error',
                maxSize: '10m',
                maxFiles: '14d',
                zippedArchive: true
            }),
            new DailyRotateFile({
                filename: path.join(rootLogsDir, `${label}-combined-%DATE%.log`),
                datePattern: 'YYYY-MM-DD',
                maxSize: '20m',
                maxFiles: '14d',
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