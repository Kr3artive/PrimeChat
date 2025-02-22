const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const chats = require("./data/data");
const AuthRoutes = require("./src/routes/Auth");
const UserRoutes = require("./src/routes/User");
const ChatRoutes = require("./src/routes/Chat");
const MessageRoutes = require("./src/routes/Message");

dotenv.config();

const index = express();
const server = http.createServer(index);
const io = new Server(server, {
  cors: {
    origin: "https://your-frontend-url.com", // Replace with your frontend URL
    methods: ["GET", "POST"],
  },
});

// Middleware
index.use(cors());
index.use(express.json());

// Connect to MongoDB
const mongodb = process.env.MongoUrl;
mongoose
  .connect(mongodb)
  .then(() => console.log("CONNECTED TO DATABASE"))
  .catch((error) => console.log("CONNECTION ERROR", error));

// Routes
index.get("/", (req, res) => {
  res.send("PrimeChat SERVER IS ACTIVE...");
});

index.use("/auth", AuthRoutes);
index.use("/user", UserRoutes);
index.use("/chats", ChatRoutes);
index.use("/message", MessageRoutes);

// Store active users
const activeUsers = new Map();

// Socket.io Connection
io.on("connection", (socket) => {
  console.log("CONNECTED TO SOCKET IO", socket.id);

  // Listen for user joining a chat
  socket.on("join chat", (chatId) => {
    socket.join(chatId);
    console.log(`User joined chat: ${chatId}`);
  });

  // Handle sending a message
  socket.on("send message", (message) => {
    console.log("New message:", message);

    // Emit the message to all users in the chat room
    io.to(message.chatId).emit("new message", message);
  });

  // Handle user disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Make io accessible in routes
index.set("io", io);

// Start server with Socket.io
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`SERVER IS ACTIVE AT http://localhost:${PORT}`);
});
