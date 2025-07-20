const express = require('express');
const { getServerStatus } = require('../vpnService');
const router = express.Router();

let SERVER_CONFIGS, statusCache, cookieCache, logger;

function initCacheRouter(deps) {
  SERVER_CONFIGS = deps.SERVER_CONFIGS;
  statusCache = deps.statusCache;
  cookieCache = deps.cookieCache;
  logger = deps.logger;
}

router.post('/refresh-cache', async (req, res) => {
  logger && logger.info && logger.info('Manual cache refresh requested');
  try {
    const statusPromises = SERVER_CONFIGS.map(server =>
      getServerStatus(server, cookieCache, logger)
    );
    const statuses = await Promise.all(statusPromises);
    statusCache.set(statuses);
    logger && logger.info && logger.info('Cache refreshed successfully');
    res.json({
      success: true,
      message: 'Cache refreshed successfully',
      data: statuses,
    });
  } catch (error) {
    logger &&
      logger.error &&
      logger.error('Error refreshing cache:', {
        error: error.message,
        stack: error.stack,
      });
    res.status(500).json({
      success: false,
      error: 'Failed to refresh cache',
      message: error.message,
    });
  }
});

module.exports = { router, initCacheRouter };
