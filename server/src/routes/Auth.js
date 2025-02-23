const express = require("express");
const upload = require("../../config/multer");
const { signup, verifyOtp, login } = require("../controllers/Auth");

const router = express.Router();

router.post("/signup", upload.single("pic"), signup);
router.post("/verify", verifyOtp);
router.post("/login", login);

module.exports = router;
