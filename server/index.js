const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const chats = require("./data/data");
const AuthRoutes = require("./src/routes/Auth");
const UserRoutes = require("./src/routes/User");
const ChatRoutes = require("./src/routes/Chat");

const index = express();

// Configure environment variables
dotenv.config();

index.use(cors());
index.use(express.json());

const SERVER = process.env.PORT;
const mongodb = process.env.MongoUrl;

// Connect to MongoDB
mongoose
  .connect(mongodb, {
    // useUnifiedTopology: true
  })
  .then(() => console.log("CONNECTED TO DATABASE"))
  .catch((error) => console.log("CONNECTION ERROR", error));

// Route handlers
index.get("/chats", (req, res) => {
  res.json(chats);
});



index.use("/auth", AuthRoutes);
index.use("/user", UserRoutes);
index.use("/chats", ChatRoutes)

// Start the server
index.listen(SERVER, () => {
  console.log(`SERVER IS ACTIVE AT http://localhost:${SERVER}`);
});
