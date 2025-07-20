const { fetchDataWithRetry } = require('./vpnService');

async function login(cfg, cache, logger) {
  const cached = cache[cfg.baseUrl];
  const now = Date.now();
  if (cached && cached.expiresAt > now) {
    logger?.debug?.('XUI cookie from cache');
    return cached.cookie;
  }

  logger?.info?.('XUI login');
  const ctrl = new AbortController();
  const tId = setTimeout(() => ctrl.abort(), 10000);

  const res = await fetch(`${cfg.baseUrl}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: cfg.username, password: cfg.password }),
    signal: ctrl.signal,
  });
  clearTimeout(tId);

  if (!res.ok) throw new Error(`XUI login: ${res.status}`);

  const cookie = res.headers.get('set-cookie');
  if (!cookie) throw new Error('XUI: no set-cookie');

  cache[cfg.baseUrl] = { cookie, expiresAt: now + 55 * 60 * 1000 };
  return cookie;
}

async function getInbounds(cfg, cache, logger) {
  const cookie = await login(cfg, cache, logger);
  const url = `${cfg.baseUrl}/xui/API/inbounds/`;
  const data = await fetchDataWithRetry(url, cookie, 'GET', 3, logger, 'xui', 'inbounds');
  return Array.isArray(data) ? data : [];
}

module.exports = { getInbounds };
