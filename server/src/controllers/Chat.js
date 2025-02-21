const Chat = require("../models/chatModel");
const User = require("../models/userModel");

// accesschat
const accessChat = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.log("UserId PARAM NOT SENT WITH REQUEST");
    return res.sendStatus(400);
  }

  try {
    // Check if the chat already exists
    let isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage");

    isChat = await User.populate(isChat, {
      path: "latestMessage.sender",
      select: "name pic email",
    });

    // If chat exists, send it
    if (isChat.length > 0) {
      res.send(isChat[0]);
    } else {
      // Create a new chat if none exists
      const chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [req.user._id, userId],
      };
      console.log("Creating chat with users:", req.user._id, userId);


      const createdChat = await Chat.create(chatData);
      const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).json({
        fullChat,
      });
    }
  } catch (error) {
    console.error("ERROR ACCESSING CHAT:", error.message);
    res.status(500).json({
      message: "FAILED TO ACCESS CHAT OR CREATE CHAT",
      error: error.message,
    });
  }
};

// getchats for a particular user
const fetchChats = async (req, res) => {
  try {
    const chats = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    const populatedChats = await User.populate(chats, {
      path: "latestMessage.sender",
      select: "name pic email",
    });

    res.status(200).json(populatedChats);
  } catch (error) {
    console.error("Error fetching chats:", error.message);
    res
      .status(500)
      .json({ message: "Failed to fetch chats", error: error.message });
  }
};

// create group chat
const createGroupChat = async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "PLEASE FILL THIS FIELDS" });
  }

  let users = JSON.parse(req.body.users);

  if (users.length < 2) {
    return res
      .status(400)
      .send("MORE THAN 2 USERS IS REQUIRED TO FORM A GROUP CHAT");
  }

  users.push(req.user._id);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user._id,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
    console.log(fullGroupChat)
  } catch (error) {
    console.error("ERROR CREATING GROUP CHAT:", error.message);
    res
      .status(500)
      .json({ message: "FAILED TO CREATE GROUP CHAT", error: error.message });
  }
};

// renamegroup chat
const renameGroup = async (req, res) => {
  const { chatId, chatName } = req.body;

  try {
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { chatName: chatName },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!updatedChat) {
      return res.status(404).json({ message: "CHAT NOT FOUND" });
    }

    res.json(updatedChat);
  } catch (error) {
    console.error("ERROR RENAMING GROUP:", error.message);
    res
      .status(500)
      .json({ message: "FAILED TO RENAME GROUP:", error: error.message });
  }
};

// remove group chat
const removeFromGroup = async (req, res) => {
  const { chatId, userId } = req.body;

  try {
    const removed = await Chat.findByIdAndUpdate(
      chatId,
      { $pull: { users: userId } },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!removed) {
      return res.status(404).json({ message: "CHAT NOT FOUND" });
    }

    res.json(removed);
  } catch (error) {
    console.error("ERROR REMOVING USER FROM GROUP:", error.message);
    res.status(500).json({
      message: "FAILED TO REMOVE USER",
      error: error.message,
    });
  }
};

// add user to group chat
const addToGroup = async (req, res) => {
  const { chatId, userId } = req.body;

  try {
    const added = await Chat.findByIdAndUpdate(
      chatId,
      { $push: { users: userId } },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!added) {
      return res.status(404).json({ message: "CHAT NOT FOUND" });
    }

    res.json(added);
  } catch (error) {
    console.error("ERROR ADDING USER TO GROUP:", error.message);
    res
      .status(500)
      .json({
        message: "FAILED TO ADD USER TO GROUP CHAT:",
        error: error.message,
      });
  }
};

module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
};
