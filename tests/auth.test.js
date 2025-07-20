const test = require('node:test');
const assert = require('assert');
const fs = require('fs');
const path = require('path');

const usersFile = path.resolve(__dirname, '../data/users.json');

test('initAuth creates admin user and verifies token', () => {
  if (fs.existsSync(usersFile)) fs.unlinkSync(usersFile);
  process.env.USERNAME = 'admin';
  process.env.PASSWORD = 'secret';
  const auth = require('../backend/utils/auth');
  auth.initAuth();
  const user = auth.verifyUser('admin', 'secret');
  assert.ok(user);
  const token = auth.generateToken({ username: user.username, role: user.role });
  const payload = auth.verifyToken(token);
  assert.strictEqual(payload.username, 'admin');

  const altUser = auth.verifyUser('Administrator', 'secret');
  assert.ok(altUser);
});

test('registerUser adds new user', () => {
  const auth = require('../backend/utils/auth');
  const user = auth.registerUser('newuser', 'pass123');
  assert.ok(user);
  const again = auth.registerUser('newuser', 'pass123');
  assert.strictEqual(again, null);
});
