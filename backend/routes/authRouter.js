const express = require('express');
const { verifyUser, generateToken } = require('../utils/auth');
const router = express.Router();

let logger;

function initAuthRouter(deps = {}) {
  logger = deps.logger;
}

router.post('/login', express.json(), (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: 'Missing credentials' });
  }
  const user = verifyUser(username, password);
  if (!user) {
    logger && logger.warn && logger.warn('Invalid login attempt', { username });
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = generateToken({ username: user.username, role: user.role });
  logger && logger.info && logger.info('User logged in', { username: user.username });
  res.json({ token, role: user.role });
});

module.exports = { router, initAuthRouter };
