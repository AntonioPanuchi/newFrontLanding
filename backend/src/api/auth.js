import { Router } from 'express'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import db from '../db/db.js'

const router = Router()

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const JWT_SECRET = process.env.JWT_SECRET || 'secret123'
const JWT_EXPIRES_IN = '7d'
const MAX_AGE = 7 * 24 * 60 * 60 // 7 дней

router.post('/verify', (req, res) => {
  if (!TELEGRAM_BOT_TOKEN) {
    return res.status(500).json({ error: 'TELEGRAM_BOT_TOKEN not set in server' })
  }

  const data = req.body
  const { hash, ...authData } = data

  // 1. Проверка подписи
  const secret = crypto.createHash('sha256').update(TELEGRAM_BOT_TOKEN).digest()
  const sortedData = Object.keys(authData).sort().map(k => `${k}=${authData[k]}`).join('\n')
  const hmac = crypto.createHmac('sha256', secret).update(sortedData).digest('hex')

  if (hmac !== hash) {
    return res.status(403).json({ error: 'Invalid Telegram data' })
  }

  // 2. Получение данных
  const { id: telegram_id, username, first_name, last_name, photo_url, auth_date } = authData

  // 3. Поиск или создание пользователя
  let user = db.prepare('SELECT * FROM users WHERE telegram_id = ?').get(telegram_id)

  if (!user) {
    const insert = db.prepare(`
      INSERT INTO users (telegram_id, username, first_name, last_name, photo_url, auth_date)
      VALUES (?, ?, ?, ?, ?, ?)
    `)
    const result = insert.run(telegram_id, username, first_name, last_name, photo_url, auth_date)
    user = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid)
  }

  // 4. Генерация JWT
  const token = jwt.sign({ id: user.id, telegram_id, username }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })

  // 5. Установка cookie
  res.setHeader('Set-Cookie', [
    `auth_token=${token}; HttpOnly; Secure; SameSite=Strict; Max-Age=${MAX_AGE}; Path=/`
  ])

  return res.status(200).json({ status: 'ok', user })
})

export default router
