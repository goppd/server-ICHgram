import Post from '../models/Post.js'
import User from '../models/User.js'
import Comment from '../models/Comment.js'

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
    const populatedPost = await Post.findById(post._id).populate(
      'user',
      'username avatar',
    )

    res.status(201).json(post)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getAllPosts = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 4

    const posts = await Post.find()
      .populate('user', 'username avatar')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)

    const userId = req.user?.id

    const postsWithExtra = await Promise.all(
      posts.map(async (post) => {
        const commentsCount = await Comment.countDocuments({
          post: post._id,
        })

        return {
          ...post._doc,
          isLiked: userId
            ? post.likes.some((id) => id.toString() === userId)
            : false,
          likesCount: post.likes.length,
          commentsCount,
        }
      }),
    )

    res.json(postsWithExtra)
  } catch (error) {
    console.error(error)
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
    console.error(error)
    res.status(500).json({ message: error.message })
  }
}

const getFeed = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 4

    const user = await User.findById(req.user.id)

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const usersForFeed = [user._id, ...user.following]

    const total = await Post.countDocuments({
      user: { $in: usersForFeed },
    })

    const posts = await Post.find({
      user: { $in: usersForFeed },
    })
      .populate('user', 'username avatar')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)

    const userId = req.user?.id

    const postsWithExtra = await Promise.all(
      posts.map(async (post) => {
        const commentsCount = await Comment.countDocuments({
          post: post._id,
        })

        return {
          ...post._doc,
          isLiked: userId
            ? post.likes.some((id) => id.toString() === userId)
            : false,
          likesCount: post.likes.length,
          commentsCount,
        }
      }),
    )

    res.json({
      posts: postsWithExtra,
      hasMore: page * limit < total,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: error.message })
  }
}

const getUserPosts = async (req, res) => {
  try {
    const userIdParam = req.params.id

    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 4

    const posts = await Post.find({ user: userIdParam })
      .populate('user', 'username avatar')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)

    const userId = req.user?.id

    const postsWithExtra = await Promise.all(
      posts.map(async (post) => {
        const commentsCount = await Comment.countDocuments({
          post: post._id,
        })

        return {
          ...post._doc,
          isLiked: userId
            ? post.likes.some((id) => id.toString() === userId)
            : false,
          likesCount: post.likes.length,
          commentsCount,
        }
      }),
    )

    res.json(postsWithExtra)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: error.message })
  }
}

export { createPost, getAllPosts, toggleLike, getFeed, getUserPosts }
