import express from 'express'
import {
  createPost,
  getAllPosts,
  toggleLike,
  getFeed,
  getUserPosts,
} from '../controllers/postController.js'
import authMiddleware from '../middlewares/authMiddleware.js'

const router = express.Router()

router.post('/', authMiddleware, createPost)
router.get('/', getAllPosts)
router.put('/:id/like', authMiddleware, toggleLike)
router.get('/feed', authMiddleware, getFeed)
router.get('/user/:id', authMiddleware, getUserPosts)

export default router
