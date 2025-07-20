const express = require('express');
const { getInbounds } = require('../xuiService');
const router = express.Router();

let cookieCache, logger;
let servers = [];

function initXuiRouter(deps) {
  const cfg = deps.XUI_CONFIG;
  cookieCache = deps.cookieCache;
  logger = deps.logger;
  servers = [
    {
      id: Date.now(),
      name: cfg.name || 'Default',
      baseUrl: cfg.baseUrl,
      username: cfg.username,
      password: cfg.password
    }
  ];
}

router.get('/xui/servers', (req, res) => {
  res.json({ servers });
});

router.post('/xui/servers', (req, res) => {
  const { name, baseUrl, username, password } = req.body || {};
  if (!name || !baseUrl || !username || !password) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  const id = Date.now();
  servers.push({ id, name, baseUrl, username, password });
  res.status(201).json({ id });
});

router.delete('/xui/servers/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const idx = servers.findIndex(s => s.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Not found' });
  }
  servers.splice(idx, 1);
  res.status(204).end();
});

router.get('/xui/inbounds/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const server = servers.find(s => s.id === id);
  if (!server) {
    return res.status(404).json({ error: 'Server not found' });
  }
  try {
    const inbounds = await getInbounds(server, cookieCache, logger);
    res.json({ inbounds });
  } catch (error) {
    logger &&
      logger.error &&
      logger.error('Failed to get xui inbounds', { error: error.message });
    res.status(500).json({ error: 'Failed to fetch xui inbounds' });
  }
});

module.exports = { router, initXuiRouter };
