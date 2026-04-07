import Comment from '../models/Comment.js'

const createComment = async (req, res) => {
  try {
    const { text } = req.body
    const postId = req.params.postId

    if (!text) {
      return res.status(400).json({ message: 'Comment text is required' })
    }

    const comment = await Comment.create({
      post: postId,
      user: req.user.id,
      text,
    })

    res.status(201).json(comment)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getCommentsByPost = async (req, res) => {
  try {
    const postId = req.params.postId

    const comments = await Comment.find({ post: postId })
      .populate('user', 'username')
      .sort({ createdAt: -1 })

    res.json(comments)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const toggleLikeComment = async (req, res) => {
  try {
    const commentId = req.params.id
    const userId = req.user.id

    const comment = await Comment.findById(commentId)

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' })
    }

    const isLiked = comment.likes.includes(userId)

    if (isLiked) {
      comment.likes = comment.likes.filter((id) => id.toString() !== userId)
    } else {
      comment.likes.push(userId)
    }

    await comment.save()

    res.json({
      message: isLiked ? 'Comment unliked' : 'Comment liked',
      likesCount: comment.likes.length,
      isLiked: !isLiked,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const deleteComment = async (req, res) => {
  try {
    const commentId = req.params.id
    const userId = req.user.id

    const comment = await Comment.findById(commentId)

    if (!comment) {
      return res
        .status(404)
        .json({ message: 'Comment not found or not authorized' })
    }

    if (comment.user.toString() !== userId) {
      return res
        .status(403)
        .json({ message: 'Not authorized to delete this comment' })
    }

    await comment.deleteOne()

    res.json({ message: 'Comment deleted' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const updateComment = async (req, res) => {
  try {
    const commentId = req.params.id
    const userId = req.user.id
    const { text } = req.body

    const comment = await Comment.findById(commentId)

    if (!comment) {
      return res
        .status(404)
        .json({ message: 'Comment not found or not authorized' })
    }

    if (comment.user.toString() !== userId) {
      return res
        .status(403)
        .json({ message: 'Not authorized to update this comment' })
    }

    comment.text = text || comment.text

    await comment.save()

    res.json(comment)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export {
  createComment,
  getCommentsByPost,
  toggleLikeComment,
  deleteComment,
  updateComment,
}
