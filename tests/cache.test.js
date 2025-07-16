const test = require('node:test');
const assert = require('assert');
const { StatusCache, CookieCache } = require('../backend/utils/cache');

test('StatusCache freshness logic', () => {
  const cache = new StatusCache(100);
  assert.strictEqual(cache.isFresh(), false);
  cache.set([{name:'server',status:'online'}]);
  assert.strictEqual(cache.isFresh(), true);
});

test('StatusCache age and last update', async () => {
  const cache = new StatusCache(50);
  cache.set([{name:'s',status:'offline'}]);
  assert.ok(cache.getAge() >= 0);
  assert.ok(cache.getLastUpdate());
  await new Promise(r => setTimeout(r,60));
  assert.strictEqual(cache.isFresh(), false);
});

test('CookieCache get/set', () => {
  const cache = new CookieCache(50);
  cache.set('url','cookie123');
  assert.strictEqual(cache.get('url'), 'cookie123');
  // wait expiry
});
test('CookieCache expires correctly', async () => {
  const cache = new CookieCache(50);
  cache.set('url','cookie123');
  assert.strictEqual(cache.get('url'), 'cookie123');
  await new Promise(r => setTimeout(r,60));
  assert.strictEqual(cache.get('url'), null);
});
