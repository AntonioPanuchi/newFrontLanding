const test = require('node:test');
const assert = require('assert');

test('formatUptime handles edge cases', () => {
  const { formatUptime } = require('../backend/vpnService');
  assert.strictEqual(formatUptime(0), 'N/A');
  assert.strictEqual(formatUptime(-5), 'N/A');
  assert.strictEqual(formatUptime(50), 'Только что');
});

test('formatUptime formats time correctly', () => {
  const { formatUptime } = require('../backend/vpnService');
  assert.strictEqual(formatUptime(65), '1м');
  assert.strictEqual(formatUptime(3600), '1ч');
  assert.strictEqual(formatUptime(3665), '1ч 1м');
  assert.strictEqual(formatUptime(90061), '1д 1ч 1м');
});

test('sleep waits at least the specified time', async () => {
  const { sleep } = require('../backend/vpnService');
  const start = Date.now();
  await sleep(50);
  const duration = Date.now() - start;
  assert.ok(duration >= 45); // allow small deviation
});

test('fetchDataWithRetry and getCookie', async () => {
  const ping = require('../backend/node_modules/ping');
  ping.promise.probe = async () => ({ alive: true, time: 10 });
  delete require.cache[require.resolve('../backend/vpnService')];

  global.fetch = async (url, opts) => {
    if (url.endsWith('/login')) {
      return {
        ok: true,
        headers: { get: () => 'session=abc' },
        text: async () => JSON.stringify({ success: true }),
      };
    }
    if (url.includes('/server/status')) {
      return {
        ok: true,
        text: async () => JSON.stringify({ uptime: 1000, cpu: 20, mem: { current: 1, total: 2 }, loads: [1] }),
      };
    }
    if (url.includes('/inbound/list')) {
      return {
        ok: true,
        text: async () => JSON.stringify([{ enable: true, up: 1, down: 1 }]),
      };
    }
    if (url.includes('/onlines')) {
      return {
        ok: true,
        text: async () => JSON.stringify([]),
      };
    }
    return { ok: true, text: async () => JSON.stringify({}) };
  };

  const { getCookie, fetchDataWithRetry, getServerStatus } = require('../backend/vpnService');

  const cookieCache = {};
  const server = { baseUrl: 'https://example.com', username: 'u', password: 'p' };
  const cookie = await getCookie(server, cookieCache, null);
  assert.strictEqual(cookie, 'session=abc');

  const data = await fetchDataWithRetry('https://example.com/test', 'session=abc', 'GET', 1, null, 's', 'api');
  assert.deepStrictEqual(data, {});

  const status = await getServerStatus(server, cookieCache, null);
  assert.strictEqual(status.status, 'online');
  assert.strictEqual(status.ping_ms, 10);
});

test('pingServer returns result', async () => {
  const ping = require('../backend/node_modules/ping');
  ping.promise.probe = async () => ({ alive: true, time: 5 });
  delete require.cache[require.resolve('../backend/vpnService')];
  const { pingServer } = require('../backend/vpnService');
  const res = await pingServer('127.0.0.1');
  assert.deepStrictEqual(res, { alive: true, time: 5 });
});

test('fetchDataWithRetry handles http error', async () => {
  const ping = require('../backend/node_modules/ping');
  ping.promise.probe = async () => ({ alive: false, time: -1 });
  delete require.cache[require.resolve('../backend/vpnService')];
  global.fetch = async () => ({ ok: false, status: 500, statusText: 'Server error', text: async () => 'err' });
  const { fetchDataWithRetry } = require('../backend/vpnService');
  await assert.rejects(() => fetchDataWithRetry('url', 'c', 'GET', 1, null, '', ''), /HTTP 500/);
});

test('getServerStatus handles failure', async () => {
  const ping = require('../backend/node_modules/ping');
  ping.promise.probe = async () => { throw new Error('fail'); };
  delete require.cache[require.resolve('../backend/vpnService')];
  global.fetch = async () => { throw new Error('network'); };
  const { getServerStatus } = require('../backend/vpnService');
  const status = await getServerStatus({ baseUrl: 'https://x', username: 'u', password: 'p' }, {}, null);
  assert.strictEqual(status.status, 'offline');
});
