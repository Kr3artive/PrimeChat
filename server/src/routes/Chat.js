const express = require("express");
const verifyToken = require("../middleware/Auth");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  removeFromGroup,
  addToGroup,
} = require("../controllers/Chat");

const router = express.Router();

router.post("/accesschat", verifyToken, accessChat);
router.get("/getchat", verifyToken, fetchChats);
router.post("/creategroup", verifyToken, createGroupChat);
router.put("/renamegroup", verifyToken, renameGroup);
router.put("/removeuser", verifyToken, removeFromGroup);
router.put("/adduser", verifyToken, addToGroup);
module.exports = router;
