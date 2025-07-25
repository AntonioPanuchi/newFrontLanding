import express from 'express';

export const router = express.Router();

let statusCache, logger;

export function initHealthRouter(deps) {
  statusCache = deps.statusCache;
  logger = deps.logger;
}

router.get('/health', (req, res) => {
  const healthCheck = {
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    cache: {
      servers: statusCache.get().length,
      lastUpdate: statusCache.getLastUpdate(),
      cacheAge: statusCache.getAge()
    },
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024)
    }
  };
  res.status(200).json(healthCheck);
});
