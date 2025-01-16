const express = require("express");
const multer = require("multer");
const { signup, verifyOtp, login } = require("../controllers/Auth");

const router = express.Router();

const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpg", "image/png", "image/jpeg"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPG, PNG, and JPEG are allowed."));
    }
  },
});

router.post("/signup", upload.single("file"), signup);
router.post("/login", login);
router.post("/verify", verifyOtp);

module.exports = router;
