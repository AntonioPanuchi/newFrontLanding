import express from 'express';
import { getServerStatus } from '../vpnService.js';

export const router = express.Router();

let SERVER_CONFIGS, statusCache, cookieCache, logger;

export function initCacheRouter(deps) {
  SERVER_CONFIGS = deps.SERVER_CONFIGS;
  statusCache = deps.statusCache;
  cookieCache = deps.cookieCache;
  logger = deps.logger;
}

router.post('/refresh-cache', async (req, res) => {
  logger?.info?.('Manual cache refresh requested');
  try {
    const statusPromises = SERVER_CONFIGS.map(server =>
      getServerStatus(server, cookieCache, logger)
    );
    const statuses = await Promise.all(statusPromises);
    statusCache.set(statuses);
    logger?.info?.('Cache refreshed successfully');
    res.json({
      success: true,
      message: 'Cache refreshed successfully',
      data: statuses
    });
  } catch (error) {
    logger?.error?.('Error refreshing cache:', {
      error: error.message,
      stack: error.stack
    });
    res.status(500).json({
      success: false,
      error: 'Failed to refresh cache',
      message: error.message
    });
  }
});
