const { verifyToken } = require('../utils/auth');

function authMiddleware(roles = []) {
  return (req, res, next) => {
    const auth = req.get('Authorization') || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    const payload = verifyToken(token);
    if (!payload) return res.status(401).json({ error: 'Unauthorized' });
    if (roles.length && !roles.includes(payload.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    req.user = payload;
    next();
  };
}

module.exports = { authMiddleware };
