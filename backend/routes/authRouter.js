const express = require('express');
const { verifyUser, registerUser, generateToken } = require('../utils/auth');
const { authMiddleware } = require('../middleware/authMiddleware');
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

router.post('/register', express.json(), (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: 'Missing credentials' });
  }
  const user = registerUser(username, password);
  if (!user) {
    return res.status(409).json({ error: 'User already exists' });
  }
  logger && logger.info && logger.info('User registered', { username });
  const token = generateToken({ username: user.username, role: user.role });
  res.status(201).json({ token, role: user.role });
});

router.get('/me', authMiddleware(), (req, res) => {
  res.json({ username: req.user.username, role: req.user.role });
});

module.exports = { router, initAuthRouter };
