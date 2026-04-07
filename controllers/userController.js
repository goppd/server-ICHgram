import User from '../models/User.js'

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate('followers', 'username avatar')
      .populate('following', 'username avatar')

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json(user)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const updateProfile = async (req, res) => {
  try {
    const { username, bio, avatar } = req.body

    const user = await User.findById(req.user.id)

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    if (username) user.username = username
    if (bio) user.bio = bio
    if (avatar) user.avatar = avatar

    const updatedUser = await user.save()

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      bio: updatedUser.bio,
      avatar: updatedUser.avatar,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const toggleFollow = async (req, res) => {
  try {
    const targetUserId = req.params.id
    const currentUserId = req.user.id

    if (targetUserId === currentUserId) {
      return res.status(400).json({ message: 'You cannot follow yourself' })
    }

    const targetUser = await User.findById(targetUserId)
    const currentUser = await User.findById(currentUserId)

    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' })
    }

    const isFollowing = currentUser.following.some(
      (id) => id.toString() === targetUserId,
    )
    if (isFollowing) {
      currentUser.following = currentUser.following.filter(
        (id) => id.toString() !== targetUserId,
      )
      targetUser.followers = targetUser.followers.filter(
        (id) => id.toString() !== currentUserId,
      )
    } else {
      currentUser.following.push(targetUserId)
      targetUser.followers.push(currentUserId)
    }

    await currentUser.save()
    await targetUser.save()

    res.json({
      message: isFollowing ? 'Unfollowed' : 'Followed',
      isFollowing: !isFollowing,
      followersCount: targetUser.followers.length,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('followers', 'username avatar')
      .populate('following', 'username avatar')

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json(user)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export { getProfile, updateProfile, toggleFollow, getUserById }
