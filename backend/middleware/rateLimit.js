const rateLimit = require('express-rate-limit');

function createApiRateLimiter() {
  return rateLimit({
    trustProxy: true,
    validate: { trustProxy: true },
    windowMs: 60 * 1_000,
    max: 3_000,
    message: { error: 'Слишком много запросов, попробуйте позже' },
    standardHeaders: true,
    legacyHeaders: false,
    skip: req => req.path === '/health',
  });
}

module.exports = { createApiRateLimiter };
