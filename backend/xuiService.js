const { fetchDataWithRetry, sleep } = require('./vpnService');

async function login(xuiConfig, cookieCache, logger) {
  const cached = cookieCache[xuiConfig.baseUrl];
  const now = Date.now();
  if (cached && cached.expiresAt > now) {
    logger && logger.debug && logger.debug(`Using cached XUI cookie`);
    return cached.cookie;
  }
  logger && logger.info && logger.info('Logging in to 3x-ui');
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);
  const res = await fetch(`${xuiConfig.baseUrl}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: xuiConfig.username, password: xuiConfig.password }),
    signal: controller.signal
  });
  clearTimeout(timeoutId);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`XUI login failed: ${res.status} ${text}`);
  }
  const cookie = res.headers.get('set-cookie');
  if (!cookie) {
    throw new Error('No set-cookie header from XUI');
  }
  cookieCache[xuiConfig.baseUrl] = { cookie, expiresAt: now + 55 * 60 * 1000 };
  return cookie;
}

async function getInbounds(xuiConfig, cookieCache, logger) {
  const cookie = await login(xuiConfig, cookieCache, logger);
  const url = `${xuiConfig.baseUrl}/xui/API/inbounds/`;
  const data = await fetchDataWithRetry(url, cookie, 'GET', 3, logger, 'xui', 'inbounds');
  return Array.isArray(data) ? data : [];
}

module.exports = { getInbounds };
