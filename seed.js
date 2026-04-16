import mongoose from 'mongoose'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import User from './models/User.js'
import Post from './models/Post.js'
import Comment from './models/Comment.js'
import Conversation from './models/Conversation.js'
import Message from './models/Message.js'

dotenv.config()

const names = [
  'Alex',
  'Dima',
  'Max',
  'Anna',
  'Lena',
  'Ivan',
  'Kate',
  'John',
  'Mike',
  'Sara',
  'Tom',
  'Nina',
  'Leo',
  'Chris',
  'Emma',
  'Olga',
  'Pavel',
  'Nikita',
  'Sasha',
  'Victor',
  'Alina',
  'Igor',
  'Roman',
  'Den',
  'Oleg',
  'Tim',
  'Mark',
  'Julia',
  'Vika',
  'Anton',
]

const captions = [
  'Nice day ☀️',
  'My new photo 📸',
  'Hello world 👋',
  'Vacation 🌴',
  'Coding life 💻',
  'Love this ❤️',
  'Chill vibes 😎',
]

const longTexts = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit 😊 Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat 🔥',
  'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur 😎',
  'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum ❤️',
]

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('MongoDB connected')

    await User.deleteMany()
    await Post.deleteMany()
    await Comment.deleteMany()
    await Conversation.deleteMany()
    await Message.deleteMany()

    const users = []

    for (let i = 0; i < 30; i++) {
      const password = await bcrypt.hash('123456', 10)

      const user = await User.create({
        username: names[i],
        email: `${names[i]}@test.com`,
        password,
        avatar: `https://i.pravatar.cc/150?img=${i + 1}`,
        bio: `Hello, I'm ${names[i]}`,
      })

      users.push(user)
    }

    console.log('Users created')

    for (let user of users) {
      const randomUsers = users
        .filter((u) => u._id.toString() !== user._id.toString())
        .sort(() => 0.5 - Math.random())
        .slice(0, 10)

      for (let target of randomUsers) {
        user.following.push(target._id)
        target.followers.push(user._id)
        await target.save()
      }

      await user.save()
    }

    console.log('Follows created')

    const posts = []

    for (let user of users) {
      const count = Math.floor(Math.random() * 3) + 10

      for (let i = 0; i < count; i++) {
        const post = await Post.create({
          user: user._id,
          image: `https://picsum.photos/500/500?random=${Math.random()}`,
          caption: captions[Math.floor(Math.random() * captions.length)],
          likes: [],
        })

        posts.push(post)
      }
    }

    console.log('Posts created')

    for (let post of posts) {
      const randomUsers = users
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * 20))

      post.likes = randomUsers.map((u) => u._id)
      await post.save()
    }

    console.log('Likes added')

    for (let post of posts) {
      for (let user of users) {
        if (Math.random() > 0.4) {
          await Comment.create({
            post: post._id,
            user: user._id,
            text: longTexts[Math.floor(Math.random() * longTexts.length)],
            likes: [],
          })
        }
      }
    }

    console.log('Comments created')

    for (let i = 0; i < users.length; i++) {
      for (let j = i + 1; j < users.length; j++) {
        if (Math.random() > 0.7) continue

        const conversation = await Conversation.create({
          members: [users[i]._id, users[j]._id],
        })

        const messagesCount = Math.floor(Math.random() * 10) + 3

        for (let k = 0; k < messagesCount; k++) {
          const sender = Math.random() > 0.5 ? users[i]._id : users[j]._id

          await Message.create({
            conversationId: conversation._id,
            senderId: sender,
            text: longTexts[Math.floor(Math.random() * longTexts.length)],
          })
        }
      }
    }

    console.log('Messages created')

    console.log('✅ SEED DONE')
    process.exit()
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}

seed()
