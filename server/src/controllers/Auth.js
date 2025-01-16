// Import necessary modules
const bcrypt = require("bcrypt"); // For password hashing
const jwt = require("jsonwebtoken"); // For creating JWT tokens
const crypto = require("crypto"); // For generating random OTPs
const nodemailer = require("nodemailer"); // For sending emails
const cloudinary = require("../utils/cloudinary"); // Cloudinary config
const fs = require("fs"); // File system module for cleanup
const User = require("../models/userModel"); // Mongoose model for User

// Registration endpoint
const signup = async (req, res) => {
  const { fullname, email, password, confirmpassword } = req.body;
  const pic = req.file; // Access the uploaded file
  const secret = process.env.JWT_KEY; // JWT secret key from environment variables

  try {
    let imageUrl;
    if (pic) {
      // Upload file to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "uploads",
      });
      imageUrl = result.secure_url; // Get the secure URL
      fs.unlinkSync(req.file.path); // Clean up the file from local storage
    }

    // Check if a user with the provided email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "USER ALREADY EXISTS" });
    }

    // Hash the user's password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a 6-digit OTP for email verification
    const otp = crypto.randomInt(100000, 999999).toString();

    // Create a new user instance
    const user = new User({
      fullname,
      email,
      password: hashedPassword,
      confirmpassword: hashedPassword, // Store hashed password
      isVerified: false, // Account is unverified initially
      otp: await bcrypt.hash(otp, 10), // Store hashed OTP
      otpExpires: Date.now() + 2 * 60 * 1000, // OTP expires in 2 minutes
      profilePic: imageUrl || null, // Store profile picture URL if available
    });

    // Save the user to the database
    await user.save();

    // Generate a JWT token for the user
    const token = jwt.sign({ user: email, userId: user._id }, secret, {
      expiresIn: "1h",
    });

    // Configure the email transporter
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
      text: `Hello ${fullname},\n\nYour OTP for verification is: ${otp}. This OTP is valid for 2 minutes.`,
    };

    // Send OTP email
    await transporter.sendMail(mailOptions);

    // Respond with success
    res.status(201).json({
      message:
        "REGISTRATION SUCCESSFUL! CHECK YOUR EMAIL FOR OTP TO VERIFY ACCOUNT",
      user,
      token,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "ERROR DURING REGISTRATION", error: err.message });
  }
};

// OTP verification endpoint
const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "USER NOT FOUND" });
    }

    // Check OTP validity
    const isOtpValid = await bcrypt.compare(otp, user.otp);
    if (!isOtpValid || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "INVALID OR EXPIRED OTP" });
    }

    // Mark user as verified and clear OTP fields
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({ message: "ACCOUNT VERIFIED SUCCESSFULLY", user });
  } catch (err) {
    res
      .status(500)
      .json({ message: "ERROR DURING OTP VERIFICATION", error: err.message });
  }
};

// Login endpoint
const login = async (req, res) => {
  const { email, password } = req.body;
  const secret = process.env.JWT_KEY; // JWT secret key

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
      expiresIn: "1h",
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
