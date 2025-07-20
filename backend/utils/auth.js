const { createHash, createHmac } = require('crypto');
const { read, write } = require('./database');

const SECRET = process.env.TOKEN_SECRET || 'change_this_secret';

function hashPassword(password) {
  return createHash('sha256').update(password).digest('hex');
}

function loadUsers() {
  return read('users', []);
}

function saveUsers(users) {
  write('users', users);
}

function initAuth() {
  const adminUser = process.env.USERNAME || 'admin';
  const adminPass = process.env.PASSWORD || 'admin';
  const users = loadUsers();

  if (!users.find(u => u.username === adminUser)) {
    users.push({
      id: Date.now(),
      username: adminUser,
      password: hashPassword(adminPass),
      role: 'admin',
    });
  }

  // create additional Administrator account for clarity
  const adminAlt = 'Administrator';
  if (!users.find(u => u.username === adminAlt)) {
    users.push({
      id: Date.now(),
      username: adminAlt,
      password: hashPassword(adminPass),
      role: 'admin',
    });
  }

  saveUsers(users);
}

function verifyUser(username, password) {
  const users = loadUsers();
  const user = users.find(u => u.username === username);
  if (!user) return null;
  if (user.password !== hashPassword(password)) return null;
  return user;
}

function registerUser(username, password, role = 'user') {
  const users = loadUsers();
  if (users.find(u => u.username === username)) {
    return null;
  }
  const user = {
    id: Date.now(),
    username,
    password: hashPassword(password),
    role,
  };
  users.push(user);
  saveUsers(users);
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

module.exports = {
  initAuth,
  verifyUser,
  registerUser,
  generateToken,
  verifyToken,
};
