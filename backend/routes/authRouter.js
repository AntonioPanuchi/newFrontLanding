const express = require('express');
const { verifyUser, generateToken } = require('../utils/auth');
const router = express.Router();

function initAuthRouter() {}

router.post('/login', express.json(), (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: 'Missing credentials' });
  }
  const user = verifyUser(username, password);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const token = generateToken({ username: user.username, role: user.role });
  res.json({ token, role: user.role });
});

module.exports = { router, initAuthRouter };
