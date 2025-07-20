const express = require('express');
const { getInbounds } = require('../xuiService');
const router = express.Router();

let XUI_CONFIG, cookieCache, logger;

function initXuiRouter(deps) {
  XUI_CONFIG = deps.XUI_CONFIG;
  cookieCache = deps.cookieCache;
  logger = deps.logger;
}

router.get('/xui/inbounds', async (req, res) => {
  try {
    const inbounds = await getInbounds(XUI_CONFIG, cookieCache, logger);
    res.json({ inbounds });
  } catch (error) {
    logger && logger.error && logger.error('Failed to get xui inbounds', { error: error.message });
    res.status(500).json({ error: 'Failed to fetch xui inbounds' });
  }
});

module.exports = { router, initXuiRouter };
