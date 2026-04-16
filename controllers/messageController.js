import Message from '../models/Message.js'

const sendMessage = async (req, res) => {
  try {
    const { conversationId, text } = req.body

    const message = await Message.create({
      conversationId,
      senderId: req.user.id,
      text,
    })

    res.json(message)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.id,
    }).sort({ createdAt: 1 })

    res.json(messages)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export { sendMessage, getMessages }