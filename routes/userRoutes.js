import express from 'express'
import {
  getProfile,
  updateProfile,
  toggleFollow,
  getUserById,
} from '../controllers/userController.js'
import authMiddleware from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/profile', authMiddleware, getProfile)
router.put('/profile', authMiddleware, updateProfile)
router.put('/:id/follow', authMiddleware, toggleFollow)
router.get('/:id', authMiddleware, getUserById)

export default router
