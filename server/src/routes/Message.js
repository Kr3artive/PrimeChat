const express = require("express")
const { allMessages, sendMessage } = require("../controllers/Message")
const verifyToken = require("../middleware/Auth");
const router = express.Router();


router.post("/send", verifyToken, sendMessage)
router.get("/:chatId", verifyToken, allMessages)


module.exports = router