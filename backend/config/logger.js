/* eslint-disable no-sync */
const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');
const fs = require('fs');

/**
 * Создаёт и возвращает Winston‑логгер с суточной ротацией файлов.
 *
 * @param {string}  [logsDir]  Путь к каталогу логов
 * @param {string}  logLevel   Уровень логирования (info, debug, error…)
 * @param {string}  nodeEnv    NODE_ENV (production / development)
 * @param {string}  label      Метка сервиса (backend / worker и т.п.)
 */
function createLogger(logsDir, logLevel = 'info', nodeEnv = 'development', label = 'backend') {
  const rootLogsDir = logsDir || path.resolve(__dirname, '../../logs');
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
        zippedArchive: true,
      }),
      new DailyRotateFile({
        filename: path.join(rootLogsDir, `${label}-combined-%DATE%.log`),
        datePattern: 'YYYY-MM-DD',
        maxSize: '20m',
        maxFiles: '14d',
        zippedArchive: true,
      }),
    ],
  });

  if (nodeEnv !== 'production') {
    logger.add(
      new winston.transports.Console({
        format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
      })
    );
  }

  return logger;
}

module.exports = { createLogger };
/* eslint-enable no-sync */
