const express = require("express");
const multer = require("multer");
const {
  signup,
  verifyOtp,
  login
} = require("../controllers/Auth");

const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../../images");
  },

  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpg", "image/png"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("invalid file type"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter,
});

router.post("/signup", upload.single("file"), signup);
router.post("/login", login);
router.post("/verify", verifyOtp);

module.exports = router;
