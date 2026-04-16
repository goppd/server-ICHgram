import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './config/db.js'

import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import postRoutes from './routes/postRoutes.js'
import commentRoutes from './routes/commentRoutes.js'

import conversationRoutes from './routes/conversationRoutes.js'
import messageRoutes from './routes/messageRoutes.js'

import authMiddleware from './middlewares/authMiddleware.js'
import { Server } from 'socket.io'

dotenv.config()

const app = express()

connectDB()

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/comments', commentRoutes)

app.use('/api/conversations', conversationRoutes)
app.use('/api/messages', messageRoutes)

app.get('/api/profile', authMiddleware, (req, res) => {
  res.json({ user: req.user })
})

app.get('/', (req, res) => {
  res.send('API working')
})

const PORT = process.env.PORT || 5000

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

const io = new Server(server, {
  cors: { origin: '*' },
})

io.on('connection', (socket) => {
  console.log('User connected')

  socket.on('sendMessage', (msg) => {
    socket.broadcast.emit('receiveMessage', msg)
  })

  socket.on('disconnect', () => {
    console.log('User disconnected')
  })
})
