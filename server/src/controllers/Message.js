const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");


const allMessages = async (req, res) => {
  try {
    // Fetch all messages for the given chat ID
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "fullname pic email")
      .populate("chat");

    // If no messages are found, return a 404 response
    if (!messages || messages.length === 0) {
      return res
        .status(404)
        .json({ message: "NO MESSAGE FOUND IN THIS CHAT" });
    }

    // Respond with the messages
    res.status(200).json(messages);
  } catch (error) {
    // Log and respond with the error
    console.error("ERROR FETCHING MESSAGES:", error.message);
    res
      .status(500)
      .json({
        message: "FAILED TO FETCH MESSAGES",
        error: error.message,
      });
  }
};

// API Endpoint to send a message
const sendMessage = async (req, res) => {
  const { content, chatId } = req.body;

  // Validate the input data
  if (!content || !chatId) {
    console.log("INVALID DATA PASSED INTO REQUEST");
    return res
      .status(400)
      .json({ message: "INVALID DATA PASSED INTO REQUEST" });
  }

  const newMessage = {
    sender: req.user._id, // Sender's ID from the authenticated request
    content,
    chat: chatId,
  };

  try {
    // Create a new message in the database
    let message = await Message.create(newMessage);

    // Populate sender and chat details for the created message
    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    // Update the latest message field in the corresponding chat
    await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

    // Respond with the created message
    res.status(201).json(message);
  } catch (error) {
    // Log and respond with the error
    console.error("ERROR CREATING MESSAGE:", error.message);
    res
      .status(500)
      .json({ message: "FAILED TO CREATE MESSAGE", error: error.message });
  }
};

module.exports = { allMessages, sendMessage };