import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'secret123'

export function authMiddleware(req, res, next) {
  const token = req.cookies?.auth_token

  if (!token) {
    return res.status(401).json({ error: 'Not authenticated' })
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET)
    req.user = payload // передаём дальше
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' })
  }
}
