import { Router } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import db from '../db/db.js'

const router = Router()
const JWT_SECRET = process.env.JWT_SECRET || 'secret123'
const JWT_EXPIRES_IN = '7d'
const MAX_AGE = 7 * 24 * 60 * 60

router.post('/register', (req, res) => {
  const { username, password, role = 'user' } = req.body || {}
  if (!username || !password) return res.status(400).json({ error: 'Missing fields' })
  const exists = db.prepare('SELECT id FROM users WHERE username = ?').get(username)
  if (exists) return res.status(409).json({ error: 'User exists' })
  const hash = bcrypt.hashSync(password, 10)
  const stmt = db.prepare('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)')
  const info = stmt.run(username, hash, role)
  const token = jwt.sign({ id: info.lastInsertRowid, username, role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
  res.cookie('auth_token', token, { httpOnly: true, sameSite: 'strict', maxAge: MAX_AGE })
  res.json({ user: { id: info.lastInsertRowid, username, role } })
})

router.post('/login', (req, res) => {
  const { username, password } = req.body || {}
  if (!username || !password) return res.status(400).json({ error: 'Missing credentials' })
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username)
  if (!user) return res.status(401).json({ error: 'Invalid credentials' })
  if (!bcrypt.compareSync(password, user.password_hash)) return res.status(401).json({ error: 'Invalid credentials' })
  const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
  res.cookie('auth_token', token, { httpOnly: true, sameSite: 'strict', maxAge: MAX_AGE })
  res.json({ ok: true })
})

export default router
