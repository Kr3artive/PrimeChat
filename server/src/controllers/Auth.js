const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");
const User = require("../models/userModel");

// Temporary storage for unverified users
const tempUsers = new Map();

// Registration (Step 1: Send OTP but do not save user yet)
const signup = async (req, res) => {
  const { fullname, email, password } = req.body;
  const pic = req.file;
  const secret = process.env.JWT_KEY;

  try {
    // Check if a user with the provided email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "USER ALREADY EXISTS" });
    }

    let imageUrl;
    if (pic) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "uploads",
      });
      imageUrl = result.secure_url;
      fs.unlinkSync(req.file.path);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);

    // Store user data temporarily
    tempUsers.set(email, {
      fullname,
      email,
      password: hashedPassword,
      pic: imageUrl || null,
      otp: hashedOtp,
      otpExpires: Date.now() + 5 * 60 * 1000, // OTP expires in 5 mins
    });

    // Configure email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "VERIFY YOUR PrimeChat ACCOUNT",
      text: `Hello ${fullname},\n\nYour OTP for verification is: ${otp}. This OTP is valid for 5 minutes.`,
    };

    // Send OTP email
    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: "OTP SENT! CHECK YOUR EMAIL TO VERIFY ACCOUNT",
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "ERROR DURING REGISTRATION", error: err.message });
  }
};

// OTP verification (Step 2: Save user after OTP verification)
const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    // Check if user exists in temporary storage
    const tempUser = tempUsers.get(email);
    if (!tempUser) {
      return res.status(404).json({ message: "OTP EXPIRED OR USER NOT FOUND" });
    }

    // Check OTP validity
    const isOtpValid = await bcrypt.compare(otp, tempUser.otp);
    if (!isOtpValid || tempUser.otpExpires < Date.now()) {
      tempUsers.delete(email); // Remove expired OTP
      return res.status(400).json({ message: "INVALID OR EXPIRED OTP" });
    }

    // Save verified user to database
    const user = new User({
      fullname: tempUser.fullname,
      email: tempUser.email,
      password: tempUser.password,
      pic: tempUser.pic,
      isVerified: true,
    });

    await user.save();

    // Generate JWT token
    const secret = process.env.JWT_KEY;
    const token = jwt.sign({ user: email, userId: user._id }, secret, {
      expiresIn: "7d",
    });

    // Remove from temporary storage
    tempUsers.delete(email);

    res.status(201).json({
      message: "ACCOUNT VERIFIED AND CREATED SUCCESSFULLY",
      user,
      token,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "ERROR DURING OTP VERIFICATION", error: err.message });
  }
};

// Login function
const login = async (req, res) => {
  const { email, password } = req.body;
  const secret = process.env.JWT_KEY;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "USER NOT FOUND" });
    }

    // Check if the user is verified
    if (!user.isVerified) {
      return res
        .status(403)
        .json({ message: "USER NOT VERIFIED. PLEASE VERIFY ACCOUNT" });
    }

    // Validate password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "INVALID CREDENTIALS" });
    }

    // Generate a JWT token
    const token = jwt.sign({ user: email, userId: user._id }, secret, {
      expiresIn: "7d",
    });

    res.status(200).json({
      message: "LOGIN SUCCESSFUL",
      user,
      token,
    });
  } catch (err) {
    res.status(500).json({ message: "ERROR DURING LOGIN", error: err.message });
  }
};

module.exports = {
  signup,
  verifyOtp,
  login,
};
