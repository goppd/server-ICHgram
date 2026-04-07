import Post from '../models/Post.js'
import User from '../models/User.js'

const createPost = async (req, res) => {
  try {
    const { image, caption } = req.body

    if (!image) {
      return res.status(400).json({ message: 'Image is required' })
    }

    const post = await Post.create({
      user: req.user.id,
      image,
      caption,
    })

    res.status(201).json(post)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('user', 'username')
      .sort({ createdAt: -1 })

    res.json(posts)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const toggleLike = async (req, res) => {
  try {
    const postId = req.params.id
    const userId = req.user.id

    const post = await Post.findById(postId)

    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }
    const isLiked = post.likes.some((id) => id.toString() === userId)

    if (isLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== userId)
    } else {
      post.likes.push(userId)
    }

    await post.save()

    res.json({
      message: isLiked ? 'Post unliked' : 'Post liked',
      likesCount: post.likes.length,
      isLiked: !isLiked,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getFeed = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const usersForFeed = [user._id, ...user.following]

    const posts = await Post.find({
      user: { $in: usersForFeed },
    })
      .populate('user', 'username avatar')
      .sort({ createdAt: -1 })
    const postWithLikeInfo = posts.map((post) => ({
      ...post._doc,
      isLiked: post.likes.some((id) => id.toString() === req.user.id),
      likesCount: post.likes.length,
    }))

    res.json(postWithLikeInfo)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getUserPosts = async (req, res) => {
  try {
    const userId = req.params.id
    const posts = await Post.find({ user: userId })
      .populate('user', 'username avatar')
      .sort({ createdAt: -1 })

    const postWithLikeInfo = posts.map((post) => ({
      ...post._doc,
      isLiked: post.likes.some((id) => id.toString() === req.user.id),
      likesCount: post.likes.length,
    }))

    res.json(postWithLikeInfo)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export { createPost, getAllPosts, toggleLike, getFeed, getUserPosts }
