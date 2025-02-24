const express = require("express");
const upload = require("../../config/multer");
const { signup, verifyOtp, login } = require("../controllers/Auth");

const router = express.Router();

router.post("/signup", upload.single("profilepic"), signup);
router.post("/verifyotp", verifyOtp);
router.post("/login", login);

module.exports = router;
