import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

// --- Текущая директория для ESM ---
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, '.env') })
import express from 'express'
import cors from 'cors'
import fs from 'fs'



import { router as statusRouter, initStatusRouter } from './routes/statusRouter.js'
import { router as healthRouter, initHealthRouter } from './routes/healthRouter.js'
import { router, initCacheRouter } from './routes/cacheRouter.js';
const cacheRouter = router;
import { validateOptionalVars } from './config/validation.js'
import { createCorsOptions } from './middleware/cors.js';
import { createApiRateLimiter } from './middleware/rateLimit.js'
import { requestLogger } from './middleware/logging.js'
import { setupGracefulShutdown } from './utils/gracefulShutdown.js'
import { getServerConfigs } from './config/serverConfigs.js'
import { StatusCache, CookieCache } from './utils/cache.js'
import { errorHandler } from './middleware/errorHandler.js'
import { createLogger } from './config/logger.js'
import { WebSocketServer } from 'ws'
import { runMigrations } from './src/db/init.js'
import cookieParser from 'cookie-parser'

const app = express()


app.use(cookieParser())



// --- Директория логов ---
const logsDir = path.join(__dirname, 'logs')
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true })
}

// --- Логгер backend ---
const defaultLogLevel = process.env.LOG_LEVEL || 'info'
const defaultNodeEnv = process.env.NODE_ENV || 'development'
const logger = createLogger(logsDir, defaultLogLevel, defaultNodeEnv, 'backend')

// --- Полифилл fetch ---
const nodeVersion = process.version
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0], 10)

if (majorVersion < 18) {
  const fetch = (await import('node-fetch')).default
  global.fetch = fetch
  logger.info(`Node.js ${nodeVersion} detected, using node-fetch polyfill for fetch API`)
} else {
  logger.info(`Node.js ${nodeVersion} detected, using native fetch API`)
}


app.set('trust proxy', 'loopback') // безопасно для Docker/nginx

// --- Валидация переменных ---
let optionalVars
let SERVER_CONFIGS

try {
  logger.info('Starting environment variables validation...')
  optionalVars = validateOptionalVars()
  SERVER_CONFIGS = getServerConfigs()
  logger.info('Environment variables validation completed successfully')
} catch (error) {
  logger.error('Environment variables validation failed:', { error: error.message })
  throw new Error(`Environment variables validation failed: ${error.message}`)
}

const port = process.env.PORT || 3000

// --- Кэширование ---
const statusCache = new StatusCache(parseInt(process.env.CACHE_DURATION || '60000', 10))
const cookieCache = new CookieCache(parseInt(process.env.COOKIE_CACHE_DURATION || '3300000', 10))

// --- Middleware ---
const limiter = createApiRateLimiter()
app.use('/api/', limiter)
const corsOptions = createCorsOptions(logger, optionalVars.NODE_ENV)
app.use(cors())
app.use(express.json())
app.use(requestLogger(logger))

// --- Инициализация роутеров ---
initStatusRouter({ SERVER_CONFIGS, statusCache, cookieCache: cookieCache.cache, logger })
initHealthRouter({ statusCache, logger })
initCacheRouter({ SERVER_CONFIGS, statusCache, cookieCache: cookieCache.cache, logger })

// --- Роуты ---
app.use('/api', statusRouter)
app.use('/api', healthRouter)
app.use('/api', cacheRouter)
import authRouter from './src/api/auth.js'
app.use('/api/auth', authRouter)
import adminRouter from './src/api/admin.js'
app.use('/api/admin', adminRouter)
import userRouter from './src/api/user.js'
app.use('/api/user', userRouter)

// --- Логирование от frontend ---
const frontendLogger = createLogger(logsDir, optionalVars.LOG_LEVEL, optionalVars.NODE_ENV, 'frontend')
app.post('/api/log', express.json({ limit: '100kb' }), (req, res) => {
  const { level = 'info', message, ...meta } = req.body || {}
  if (typeof frontendLogger[level] === 'function') {
    frontendLogger[level](message, meta)
  } else {
    frontendLogger.info(message, meta)
  }
  res.status(204).end()
})

// --- SPA fallback ---
app.use(express.static(path.join(__dirname, '..', 'frontend', 'dist')))
app.get('*', (req, res) => {
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    logger.debug(`SPA fallback for path: ${req.path}`)
    res.sendFile(path.join(__dirname, '..', 'frontend', 'dist', 'index.html'))
  } else {
    res.status(404).json({
      error: 'Not Found',
      message: 'The requested endpoint does not exist'
    })
  }
})

// --- Обработка ошибок ---
app.use(errorHandler(logger))

// --- Запуск сервера ---
const server = app.listen(port, () => {
  logger.info(`ROX VPN API server started on port ${port}`, {
    port,
    environment: process.env.NODE_ENV || 'development',
    serversConfigured: SERVER_CONFIGS.length
  })
})
runMigrations()
// --- WebSocket логирование ---
const today = new Date().toISOString().slice(0, 10)
const logFiles = [
  `logs/backend-combined-${today}.log`,
  `logs/backend-error-${today}.log`,
  `logs/frontend-combined-${today}.log`,
  `logs/frontend-error-${today}.log`
]
const clientSettings = new Map()

const wss = new WebSocketServer({ server, path: '/ws/insights' })
wss.on('connection', (ws) => {
  const id = Date.now() + Math.random()
  clientSettings.set(id, { filter: {}, tail: 5 })

  ws.send(JSON.stringify({ message: 'WebSocket подключен ✅' }))

  ws.on('message', (data) => {
    try {
      const msg = JSON.parse(data.toString())
      if (msg.filter || msg.tail) {
        clientSettings.set(id, {
          ...clientSettings.get(id),
          ...msg
        })
        ws.send(JSON.stringify({ ok: true, message: 'Фильтр применён' }))
      }
    } catch (err) {
      ws.send(JSON.stringify({ error: 'Неверный формат JSON-команды' }))
    }
  })

  const interval = setInterval(() => {
    const { filter, tail } = clientSettings.get(id)
    const logs = []

    for (const file of logFiles) {
      try {
        const fullPath = path.join(__dirname, '..', file)
        const lines = fs.readFileSync(fullPath, 'utf-8').trim().split('\n').slice(-tail)
        for (const line of lines) {
          try {
            const parsed = JSON.parse(line)
            if (
              (!filter.label || parsed.label === filter.label) &&
              (!filter.level || parsed.level === filter.level)
            ) {
              logs.push(parsed)
            }
          } catch {
            logs.push({ message: line, source: file })
          }
        }
      } catch {
        logs.push({ error: `Файл недоступен: ${file}` })
      }
    }

    ws.send(JSON.stringify({ timestamp: new Date(), logs }))
  }, 3000)

  ws.on('close', () => {
    clearInterval(interval)
    clientSettings.delete(id)
  })
})

// --- Graceful Shutdown ---
setupGracefulShutdown(server, logger)
process.on('exit', (code) => logger.info('Process exit', { code }))

export default app
