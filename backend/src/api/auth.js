import { Router } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import db from '../db/db.js'

const router = Router()
const JWT_SECRET = process.env.JWT_SECRET || 'secret123'
const ACCESS_EXPIRES_IN = '15m'
const ACCESS_MAX_AGE = 15 * 60 * 1000 // 15 minutes
const REFRESH_MAX_AGE = 7 * 24 * 60 * 60 * 1000 // 7 days

function generateAccessToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: ACCESS_EXPIRES_IN }
  )
}

function generateRefreshToken() {
  return crypto.randomBytes(40).toString('hex')
}

function issueTokens(user, res) {
  const accessToken = generateAccessToken(user)
  const refreshToken = generateRefreshToken()
  const expires = Math.floor(Date.now() / 1000) + REFRESH_MAX_AGE / 1000
  db.prepare(
    'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)'
  ).run(user.id, refreshToken, expires)
  res.cookie('access_token', accessToken, {
    httpOnly: true,
    sameSite: 'strict',
    maxAge: ACCESS_MAX_AGE
  })
  res.cookie('refresh_token', refreshToken, {
    httpOnly: true,
    sameSite: 'strict',
    maxAge: REFRESH_MAX_AGE
  })
}

router.post('/register', (req, res) => {
  const { username, password, role = 'user' } = req.body || {}
  if (!username || !password) return res.status(400).json({ error: 'Missing fields' })
  const exists = db.prepare('SELECT id FROM users WHERE username = ?').get(username)
  if (exists) return res.status(409).json({ error: 'User exists' })
  const hash = bcrypt.hashSync(password, 10)
  const stmt = db.prepare('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)')
  const info = stmt.run(username, hash, role)
  const user = { id: info.lastInsertRowid, username, role }
  issueTokens(user, res)
  res.json({ user })
})

router.post('/login', (req, res) => {
  const { username, password } = req.body || {}
  if (!username || !password) return res.status(400).json({ error: 'Missing credentials' })
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username)
  if (!user) return res.status(401).json({ error: 'Invalid credentials' })
  if (!bcrypt.compareSync(password, user.password_hash)) return res.status(401).json({ error: 'Invalid credentials' })
  db.prepare('DELETE FROM refresh_tokens WHERE user_id = ?').run(user.id)
  issueTokens(user, res)
  res.json({ ok: true })
})

router.post('/refresh', (req, res) => {
  const token = req.cookies?.refresh_token
  if (!token) return res.status(401).json({ error: 'Missing refresh token' })
  const row = db
    .prepare('SELECT * FROM refresh_tokens WHERE token = ?')
    .get(token)
  if (!row || row.expires_at < Math.floor(Date.now() / 1000)) {
    return res.status(401).json({ error: 'Invalid refresh token' })
  }
  const user = db
    .prepare('SELECT id, username, role FROM users WHERE id = ?')
    .get(row.user_id)
  if (!user) return res.status(401).json({ error: 'Invalid refresh token' })
  db.prepare('DELETE FROM refresh_tokens WHERE id = ?').run(row.id)
  issueTokens(user, res)
  res.json({ ok: true })
})

router.get('/logout', (req, res) => {
  const token = req.cookies?.refresh_token
  if (token) {
    db.prepare('DELETE FROM refresh_tokens WHERE token = ?').run(token)
  }
  res.clearCookie('access_token')
  res.clearCookie('refresh_token')
  res.json({ ok: true })
})

export default router
