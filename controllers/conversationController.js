import Conversation from '../models/Conversation.js'

const createOrGetConversation = async (req, res) => {
  try {
    const { receiverId } = req.body
    const senderId = req.user.id

    let conversation = await Conversation.findOne({
      members: { $all: [senderId, receiverId] },
    })

    if (!conversation) {
      conversation = await Conversation.create({
        members: [senderId, receiverId],
      })
    }

    res.json(conversation)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getUserConversations = async (req, res) => {
  try {
    const userId = req.user.id

    const conversations = await Conversation.find({
      members: { $in: [userId] },
    })

    res.json(conversations)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export { createOrGetConversation, getUserConversations }