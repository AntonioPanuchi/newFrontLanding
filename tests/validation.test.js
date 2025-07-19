const test = require('node:test');
const assert = require('assert');
const { validateUrl, validateCredentials, validateOptionalVars } = require('../backend/config/validation');

test('validateUrl accepts valid http/https urls', () => {
  assert.strictEqual(validateUrl('https://example.com','SERVER_URL'),'https://example.com');
  assert.throws(() => validateUrl('ftp://example.com','SERVER_URL'));
  assert.throws(() => validateUrl('','SERVER_URL'));
});

test('validateCredentials checks username and password', () => {
  const creds = validateCredentials('user123','password123');
  assert.deepStrictEqual(creds,{username:'user123',password:'password123'});
  assert.throws(() => validateCredentials('u','pass'));
});

test('validateOptionalVars defaults and validation', () => {
  const env = { PORT: '3000', NODE_ENV: 'development', LOG_LEVEL: 'info' };
  const result = validateOptionalVars(env);
  assert.strictEqual(result.PORT, '3000');
  assert.strictEqual(result.NODE_ENV, 'development');
  assert.strictEqual(result.LOG_LEVEL, 'info');
  assert.throws(() => validateOptionalVars({PORT:'0',NODE_ENV:'prod',LOG_LEVEL:'x'}));
});
