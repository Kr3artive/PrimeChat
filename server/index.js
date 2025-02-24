const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const AuthRoutes = require("./src/routes/Auth");
const UserRoutes = require("./src/routes/User");
const ChatRoutes = require("./src/routes/Chat");
const MessageRoutes = require("./src/routes/Message");


const index = express();
const server = http.createServer(index);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:4000",
    methods: ["GET", "POST"],
  },
});

// Middleware
index.use(cors());
index.use(morgan("dev"));
index.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
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
    io.to(message.chatId).emit("new message", message);
  });

  // Handle typing event
  socket.on("typing", (chatId) => {
    socket.to(chatId).emit("typing", chatId);
  });

  socket.on("stop typing", (chatId) => {
    socket.to(chatId).emit("stop typing", chatId);
  });

  // Handle user disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Make io accessible in routes
index.set("io", io);

// Start server with Socket.io
const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`SERVER IS ACTIVE AT http://localhost:${PORT}`);
});
