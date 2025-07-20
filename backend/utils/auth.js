const { createHash, createHmac } = require('crypto');
const { init, query, run } = require('./database');

const SECRET = process.env.TOKEN_SECRET || 'change_this_secret';

function hashPassword(password) {
  return createHash('sha256').update(password).digest('hex');
}

function initAuth() {
  init();
  const adminUser = process.env.USERNAME || 'admin';
  const adminPass = process.env.PASSWORD || 'admin';
  const rows = query(`SELECT id FROM users WHERE username='${adminUser}'`);
  if (rows.length === 0) {
    run(
      `INSERT INTO users (username, password, role) VALUES ('${adminUser}','${hashPassword(adminPass)}','admin')`
    );
  }
}

function verifyUser(username, password) {
  const rows = query(`SELECT id, username, password, role FROM users WHERE username='${username}'`);
  if (rows.length === 0) return null;
  const user = rows[0];
  if (user.password !== hashPassword(password)) return null;
  return user;
}

function generateToken(payload) {
  const data = { ...payload, exp: Date.now() + 24 * 60 * 60 * 1000 };
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify(data)).toString('base64url');
  const signature = createHmac('sha256', SECRET).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${signature}`;
}

function verifyToken(token) {
  if (!token) return null;
  const [header, body, signature] = token.split('.');
  if (!signature) return null;
  const expected = createHmac('sha256', SECRET).update(`${header}.${body}`).digest('base64url');
  if (signature !== expected) return null;
  const data = JSON.parse(Buffer.from(body, 'base64url').toString());
  if (data.exp < Date.now()) return null;
  return data;
}

module.exports = { initAuth, verifyUser, generateToken, verifyToken };
