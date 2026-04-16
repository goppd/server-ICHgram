import express from 'express'
import {
  createOrGetConversation,
  getUserConversations,
} from '../controllers/conversationController.js'
import authMiddleware from '../middlewares/authMiddleware.js'

const router = express.Router()

router.post('/', authMiddleware, createOrGetConversation)
router.get('/', authMiddleware, getUserConversations)

export default router
