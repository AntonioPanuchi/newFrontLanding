const express = require('express');
const cors = require('cors');
// eslint-disable-next-line node/no-unpublished-require
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const {
  router: statusRouter,
  initStatusRouter
} = require('./routes/statusRouter');
const {
  router: healthRouter,
  initHealthRouter
} = require('./routes/healthRouter');
const {
  router: cacheRouter,
  initCacheRouter
} = require('./routes/cacheRouter');
const { router: xuiRouter, initXuiRouter } = require('./routes/xuiRouter');
const { router: authRouter, initAuthRouter } = require('./routes/authRouter');
const { initAuth } = require('./utils/auth');
const { authMiddleware } = require('./middleware/authMiddleware');
const { validateOptionalVars } = require('./config/validation');
const { createLogger } = require('./config/logger');
const { createCorsOptions } = require('./middleware/cors');
const { createApiRateLimiter } = require('./middleware/rateLimit');
const { requestLogger } = require('./middleware/logging');
const { setupGracefulShutdown } = require('./utils/gracefulShutdown');
const { getServerConfigs } = require('./config/serverConfigs');
const { StatusCache, CookieCache } = require('./utils/cache');
const { errorHandler } = require('./middleware/errorHandler');

// --- СОЗДАНИЕ ДИРЕКТОРИИ ДЛЯ ЛОГОВ ---
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// --- НАСТРОЙКА ЛОГИРОВАНИЯ ---
// Для fetch-полифилла logger нужен уже здесь, поэтому создаём с дефолтными значениями
const defaultLogLevel = process.env.LOG_LEVEL || 'info';
const defaultNodeEnv = process.env.NODE_ENV || 'development';
const logger = createLogger(
  logsDir,
  defaultLogLevel,
  defaultNodeEnv,
  'backend'
);

// --- ПОЛИФИЛЛ ДЛЯ FETCH ---
// Проверяем версию Node.js и добавляем полифилл если нужно
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0], 10);

if (majorVersion < 18) {
  // Для Node.js < 18 используем node-fetch как полифилл
  const fetch = require('node-fetch');
  global.fetch = fetch;
  logger.info(
    `Node.js ${nodeVersion} detected, using node-fetch polyfill for fetch API`
  );
} else {
  logger.info(`Node.js ${nodeVersion} detected, using native fetch API`);
}

const app = express();

// --- ВАЛИДАЦИЯ ПЕРЕМЕННЫХ ОКРУЖЕНИЯ ---
// (удалить функции validateUrl, validateCredentials, validateOptionalVars)

// Выполняем валидацию
let optionalVars;
let SERVER_CONFIGS;

try {
  logger.info('Starting environment variables validation...');

  // Валидируем опциональные переменные и конфигурацию серверов
  optionalVars = validateOptionalVars();
  SERVER_CONFIGS = getServerConfigs();

  logger.info('Environment variables validation completed successfully');
} catch (error) {
  logger.error('Environment variables validation failed:', {
    error: error.message
  });
  throw new Error(`Environment variables validation failed: ${error.message}`);
}

initAuth();
initAuthRouter();

const port = optionalVars.PORT;

// --- КОНФИГУРАЦИЯ СЕРВЕРОВ ---
// --- КЭШИРОВАНИЕ И СОСТОЯНИЕ ---
const statusCache = new StatusCache(
  process.env.CACHE_DURATION
    ? parseInt(process.env.CACHE_DURATION, 10)
    : 60 * 1000
);
const cookieCache = new CookieCache(
  process.env.COOKIE_CACHE_DURATION
    ? parseInt(process.env.COOKIE_CACHE_DURATION, 10)
    : 55 * 60 * 1000
);

// --- MIDDLEWARE ---
app.set('trust proxy', 1);
const limiter = createApiRateLimiter();
app.use('/api/', limiter);
const corsOptions = createCorsOptions(logger, optionalVars.NODE_ENV);
app.use(cors(corsOptions));
app.use(express.json());
app.use(requestLogger(logger));

// --- ИНИЦИАЛИЗАЦИЯ РОУТЕРОВ ---
initStatusRouter({
  SERVER_CONFIGS,
  statusCache,
  cookieCache: cookieCache.cache,
  logger
});
initHealthRouter({
  statusCache,
  logger
});
initCacheRouter({
  SERVER_CONFIGS,
  statusCache,
  cookieCache: cookieCache.cache,
  logger
});
initXuiRouter({
  XUI_CONFIG: {
    name: 'Default',
    baseUrl: process.env.XUI_BASE_URL,
    username: process.env.XUI_USERNAME,
    password: process.env.XUI_PASSWORD
  },
  cookieCache: cookieCache.cache,
  logger
});
// --- ПОДКЛЮЧЕНИЕ РОУТЕРОВ ---
app.use('/api', authRouter);
app.use('/api', statusRouter);
app.use('/api', healthRouter);
app.use('/api', cacheRouter);
app.use('/api', authMiddleware(['admin']), xuiRouter);

// --- FRONTEND LOGGING ENDPOINT ---
const frontendLogger = createLogger(
  logsDir,
  optionalVars.LOG_LEVEL,
  optionalVars.NODE_ENV,
  'frontend'
);
app.post('/api/log', express.json({ limit: '100kb' }), (req, res) => {
  const { level = 'info', message, ...meta } = req.body || {};
  if (typeof frontendLogger[level] === 'function') {
    frontendLogger[level](message, meta);
  } else {
    frontendLogger.info(message, meta);
  }
  res.status(204).end();
});

// --- СТАТИКА и SPA fallback ---
app.use(express.static(path.join(__dirname, '..', 'frontend', 'dist')));
app.get('*', (req, res) => {
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    logger.debug(`SPA fallback for path: ${req.path}`);
    res.sendFile(path.join(__dirname, '..', 'frontend', 'dist', 'index.html'));
  } else {
    res.status(404).json({
      error: 'Not Found',
      message: 'The requested endpoint does not exist'
    });
  }
});

// --- ГЛОБАЛЬНЫЙ ОБРАБОТЧИК ОШИБОК ---
app.use(errorHandler(logger));

// --- ЗАПУСК СЕРВЕРА ---
const server = app.listen(port, () => {
  logger.info(`ROX VPN API server started on port ${port}`, {
    port,
    environment: process.env.NODE_ENV || 'development',
    serversConfigured: SERVER_CONFIGS.length
  });
});

// --- GRACEFUL SHUTDOWN ---
setupGracefulShutdown(server, logger);

// Логируем остановку сервера
process.on('exit', code => {
  logger.info('Process exit', { code });
});

module.exports = app;
