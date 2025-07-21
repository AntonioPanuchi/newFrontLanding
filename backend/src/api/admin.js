import { Router } from 'express'
import { authMiddleware, requireRole } from '../../middleware/authMiddleware.js'

const router = Router()

router.get('/me', authMiddleware, requireRole('admin'), (req, res) => {
  res.json({ user: req.user })
})

export default router
