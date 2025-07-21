import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'secret123'

export function authRequired(req, res, next) {
  const authHeader = req.headers.authorization || ''
  const token = authHeader.replace('Bearer ', '').trim()

  try {
    const payload = jwt.verify(token, JWT_SECRET)
    req.user = payload  // Добавим в req.user
    next()
  } catch {
    return res.status(401).json({ error: 'Unauthorized' })
  }
}
