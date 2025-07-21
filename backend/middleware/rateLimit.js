import rateLimit from 'express-rate-limit';

export function createApiRateLimiter() {
  return rateLimit({
    windowMs: 60 * 1000,
    max: 3000,
    message: { error: 'Слишком много запросов, попробуйте позже' },
    standardHeaders: true,
    legacyHeaders: false,
    skip: req => req.path === '/health',
  });
}
