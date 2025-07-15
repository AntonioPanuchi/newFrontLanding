const express = require('express');
const { getServerStatus } = require('../vpnService');
const router = express.Router();

let SERVER_CONFIGS, statusCache, cookieCache, logger;

function initStatusRouter(deps) {
  SERVER_CONFIGS = deps.SERVER_CONFIGS;
  statusCache = deps.statusCache;
  cookieCache = deps.cookieCache;
  logger = deps.logger;
}

router.get('/server-statuses', async (req, res) => {
  if (statusCache.isFresh()) {
    logger && logger.debug && logger.debug('Returning cached server statuses');
    return res.json({
      servers: statusCache.get(),
      lastUpdate: statusCache.getLastUpdate()
    });
  }
  logger && logger.info && logger.info('Fetching fresh server statuses...');
  try {
    const prevStatuses = {};
    (statusCache.get() || []).forEach(s => { prevStatuses[s.name] = s.status; });
    const statusPromises = SERVER_CONFIGS.map(server =>
      getServerStatus(server, cookieCache, logger, prevStatuses[server.name])
    );
    const statuses = await Promise.all(statusPromises);
    statusCache.set(statuses);
    logger && logger.info && logger.info('Successfully fetched server statuses', {
      serversCount: statuses.length,
      onlineServers: statuses.filter(s => s.status === 'online').length
    });
    res.json({
      servers: statuses,
      lastUpdate: statusCache.getLastUpdate()
    });
  } catch (error) {
    logger && logger.error && logger.error('Error in /api/server-statuses endpoint:', {
      error: error.message,
      stack: error.stack
    });
    if (statusCache.get().length > 0) {
      logger && logger.warn && logger.warn('Returning stale cached data due to error');
      return res.json({
        servers: statusCache.get(),
        lastUpdate: statusCache.getLastUpdate()
      });
    }
    res.status(500).json({
      error: 'Failed to fetch server statuses',
      message: 'Временная ошибка сервера. Попробуйте позже.'
    });
  }
});

module.exports = { router, initStatusRouter }; 