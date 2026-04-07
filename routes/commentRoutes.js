import express from 'express'
import {
  createComment,
  getCommentsByPost,
  toggleLikeComment,
  deleteComment,
  updateComment,
} from '../controllers/commentController.js'
import authMiddleware from '../middlewares/authMiddleware.js'

const router = express.Router()

router.post('/:postId', authMiddleware, createComment)

router.get('/:postId', getCommentsByPost)

router.put('/:id/like', authMiddleware, toggleLikeComment)

router.delete('/:id', authMiddleware, deleteComment)

router.put('/:id', authMiddleware, updateComment)

export default router
