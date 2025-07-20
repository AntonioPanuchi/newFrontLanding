/* eslint-disable no-sync */
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const fs = require('fs');
const path = require('path');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const { createLogger } = require('./config/logger');
const { router: healthRouter, initHealthRouter } = require('./routes/healthRouter');
const { router: statusRouter, initStatusRouter } = require('./routes/statusRouter');
const { router: cacheRouter, initCacheRouter } = require('./routes/cacheRouter');
const { router: authRouter, initAuthRouter } = require('./routes/authRouter');
const { router: xuiRouter, initXuiRouter } = require('./routes/xuiRouter');

const { errorHandler } = require('./middleware/errorHandler');
const { setupGracefulShutdown } = require('./utils/gracefulShutdown');
const { StatusCache, CookieCache } = require('./utils/cache');
const { getServerConfigs } = require('./config/serverConfigs');
const { initAuth } = require('./utils/auth');

const LOG_DIR = path.resolve(__dirname, '../logs');
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

const logger = createLogger(LOG_DIR, process.env.LOG_LEVEL || 'info', process.env.NODE_ENV);

const app = express();

const statusCache = new StatusCache(Number(process.env.CACHE_DURATION) || 60_000);
const cookieCache = new CookieCache(Number(process.env.COOKIE_CACHE_DURATION) || 55 * 60_000);
const SERVER_CONFIGS = getServerConfigs();

initAuth();

/* ------------------ middleware ------------------ */

app.use(helmet());
app.use(express.json({ limit: '1mb' }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  })
);

app.use(
  rateLimit({
    windowMs: Number(process.env.RATE_LIMIT_WINDOW || 60_000),
    max: Number(process.env.RATE_LIMIT_MAX || 3000),
    standardHeaders: true,
    legacyHeaders: false,
  })
);

/* ------------------ routes ------------------ */

// initialize routers with dependencies
initHealthRouter({ statusCache });
initStatusRouter({ SERVER_CONFIGS, statusCache, cookieCache, logger });
initCacheRouter({ SERVER_CONFIGS, statusCache, cookieCache, logger });
initAuthRouter({ logger });
initXuiRouter({ XUI_CONFIG: SERVER_CONFIGS[0], cookieCache, logger });

app.use('/api', healthRouter);
app.use('/api', statusRouter);
app.use('/api', cacheRouter);
app.use('/api', authRouter);
app.use('/api', xuiRouter);

/* ------------------ error handling ------------------ */

app.use(errorHandler(logger));

/* ------------------ start server ------------------ */

const PORT = Number(process.env.PORT || 3000);
const server = app.listen(PORT, () => logger.info(`API listening on :${PORT}`));

/* ------------------ graceful shutdown ------------------ */

setupGracefulShutdown(server, logger);
/* eslint-enable no-sync */
