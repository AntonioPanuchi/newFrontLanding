/* c8 ignore start */
const ping = require('ping');

/* -------------------- helpers -------------------- */

function formatUptime(seconds) {
  if (!seconds || seconds <= 0) return 'N/A';
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${d ? `${d}д ` : ''}${h ? `${h}ч ` : ''}${m ? `${m}м` : ''}`.trim() || 'Только что';
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function pingServer(host) {
  try {
    const res = await ping.promise.probe(host, { timeout: 5 });
    return { time: res.time !== 'unknown' ? res.time : -1, alive: res.alive };
  } catch {
    return { time: -1, alive: false };
  }
}

/* -------------------- cookie auth -------------------- */

async function getCookie(server, cache, logger) {
  const cached = cache[server.baseUrl];
  const now = Date.now();
  if (cached && cached.expiresAt > now) {
    logger?.debug?.(`Using cached cookie for ${server.name}`);
    return cached.cookie;
  }

  logger?.info?.(`Login to ${server.name}`);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  const res = await fetch(`${server.baseUrl}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: server.username, password: server.password }),
    signal: controller.signal,
  });
  clearTimeout(timeoutId);

  if (!res.ok) throw new Error(`Login failed: ${res.status}`);

  const cookie = res.headers.get('set-cookie');
  if (!cookie) throw new Error('No set-cookie header');

  cache[server.baseUrl] = { cookie, expiresAt: now + 55 * 60 * 1000 };
  return cookie;
}

/* -------------------- universal fetch with retry -------------------- */

async function fetchDataWithRetry(
  url,
  cookie,
  method = 'GET',
  retries = 3,
  logger,
  serverName,
  apiName
) {
  for (let attempt = 0; attempt < retries; attempt++) {
    const start = Date.now();
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const res = await fetch(url, {
        method,
        headers: {
          Cookie: cookie,
          Accept: 'application/json, text/plain, */*',
          'User-Agent': 'ROX-VPN-Monitor/1.0',
          'X-Requested-With': 'XMLHttpRequest',
        },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const duration = Date.now() - start;
      logger?.info?.(`API: ${serverName} ${apiName} ${duration}ms`);

      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);

      const text = await res.text();
      if (!text) throw new Error('Empty response');

      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        throw new Error(`Invalid JSON: ${e.message}`);
      }

      if (data.success === false) throw new Error(data.msg || 'API error');
      return data.obj ?? data.data ?? data;
    } catch (err) {
      if (attempt === retries - 1) throw err;
      await sleep(1000 * (attempt + 1));
    }
  }
}

/* -------------------- main status collector -------------------- */

async function getServerStatus(server, cache, logger, prev = null) {
  let status = 'offline';

  try {
    const cookie = await getCookie(server, cache, logger);
    const [system, inbounds, online, pingRes] = await Promise.all([
      fetchDataWithRetry(
        `${server.baseUrl}/server/status`,
        cookie,
        'POST',
        3,
        logger,
        server.name,
        'status'
      ),
      fetchDataWithRetry(
        `${server.baseUrl}/panel/inbound/list`,
        cookie,
        'POST',
        3,
        logger,
        server.name,
        'inbounds'
      ),
      fetchDataWithRetry(
        `${server.baseUrl}/panel/inbound/onlines`,
        cookie,
        'POST',
        3,
        logger,
        server.name,
        'online'
      ),
      pingServer(server.pingHost || new URL(server.baseUrl).hostname),
    ]);

    let traffic = 0;
    inbounds.filter(i => i.enable).forEach(i => (traffic += (i.up || 0) + (i.down || 0)));

    const cpuCores = system.cpuCores || 1;
    const cpuLoad = Array.isArray(system.loads)
      ? (system.loads[0] / cpuCores) * 100
      : system.cpu || 0;

    status = 'online';
    if (prev && prev !== status) logger?.info?.(`Status: ${server.name} ${prev} → ${status}`);

    return {
      name: server.name,
      status,
      uptime: formatUptime(system.uptime),
      users_online: online.length || 0,
      traffic_used: traffic,
      cpu_load: Number(Math.min(cpuLoad, 100).toFixed(2)),
      mem_used: system.mem?.current || 0,
      mem_total: system.mem?.total || 0,
      ping_ms: pingRes.time,
    };
  } catch (error) {
    logger?.error?.(`Error ${server.name}: ${error.message}`);
    if (prev && prev !== 'offline') logger?.warn?.(`Status: ${server.name} ${prev} → offline`);
    return {
      name: server.name,
      status: 'offline',
      uptime: 'N/A',
      users_online: 0,
      traffic_used: 0,
      cpu_load: 0,
      mem_used: 0,
      mem_total: 0,
      ping_ms: -1,
    };
  }
}

module.exports = {
  formatUptime,
  sleep,
  pingServer,
  getCookie,
  fetchDataWithRetry,
  getServerStatus,
};
/* c8 ignore stop */
