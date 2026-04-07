import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import authMiddleware from './middlewares/authMiddleware.js'
import userRoutes from './routes/userRoutes.js'
import postRoutes from './routes/postRoutes.js'
import commentRoutes from './routes/commentRoutes.js'

dotenv.config()

const app = express()

connectDB()

app.use(cors())
app.use(express.json())
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/comments', commentRoutes)

app.get('/api/profile', authMiddleware, (req, res) => {
  res.json({
    message: 'Protected data',
    user: req.user,
  })
})

app.get('/', (req, res) => {
  res.send('Welcome to ICHgram API')
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
