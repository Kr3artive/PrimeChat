// Import necessary modules
const bcrypt = require("bcrypt"); // For password hashing
const jwt = require("jsonwebtoken"); // For creating JWT tokens
const crypto = require("crypto"); // For generating random OTPs
const nodemailer = require("nodemailer"); // For sending emails
const User = require("../models/userModel"); // Mongoose model for User

// Registration endpoint
const signup = async (req, res) => {
  const { fullname, email, password, confirmpassword } = req.body;
  const pic = req.file; // Access the uploaded file
  const secret = process.env.JWT_KEY; // JWT secret key from environment variables

  if (pic) {
    console.log(pic); // Log file info
  } else {
    console.log("No file uploaded");
  }

  try {
    // Check if a user with the provided email already exists
    const findUser = await User.findOne({ email });
    if (findUser) {
      return res.status(409).json({
        message: "USER ALREADY EXISTS",
      });
    } else {
      // Hash the user's password for secure storage
      const hashedPassword = await bcrypt.hash(password, 10);

      // Generate a 6-digit OTP for email verification
      const otp = crypto.randomInt(100000, 999999).toString();

      // Create a new user instance
      const user = new User({
        fullname,
        email,
        password: hashedPassword,
        confirmpassword: hashedPassword, // Store hashed password
        isVerified: false, // By default verification status is false until OTP is verified
        otp, // Store OTP for verification
        otpExpires: Date.now() + 2 * 60 * 1000, // OTP expires in 2 minutes
      });

      // Save the user to the database first before sending OTP
      await user.save();

      // Generate a JWT token for the user
      const token = await jwt.sign({ user: email, userId: user._id }, secret, {
        expiresIn: "1h", // Token expires in 1 hour
      });

      // Configure the email transporter for sending the OTP
      const transporter = nodemailer.createTransport({
        service: "gmail", // Use Gmail service
        auth: {
          user: process.env.EMAIL_USER, // Email address from environment variables
          pass: process.env.EMAIL_PASS, // Email password or app password
        },
      });

      // Email options for sending the OTP
      const mailOptions = {
        from: process.env.EMAIL_USER, // Sender's email address
        to: email, // Recipient's email address
        subject: "VERIFY YOUR PrimeChat ACCOUNT", // Email subject
        text: `Hello ${fullname},\n\nYour OTP for verification is: ${otp}`, // Email body
      };

      // Attempt to send the OTP via email
      try {
        const info = await transporter.sendMail(mailOptions);
        console.log("OTP SENT TO", email, info.messageId); // Log success with messageId
      } catch (error) {
        console.error("ERROR SENDING OTP:", error); // Log failure
        return res.status(500).json({
          message: "ERROR SENDING OTP",
          error: error.message,
        });
      }

      // Send success response to the client
      res.status(201).json({
        message:
          "REGISTRATION SUCCESSFUL! CHECK YOUR EMAIL FOR OTP TO VERIFY ACCOUNT",
        user,
        token,
      });
    }
  } catch (err) {
    // Handle unexpected errors during registration
    res.status(500).json({
      message: "ERROR DURING REGISTRATION",
      error: err.message,
    });
  }
};

// OTP verification endpoint
const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    // Find the user by email and OTP, ensuring the OTP is not expired
    const user = await User.findOne({
      email,
      otp,
      otpExpires: { $gt: Date.now() }, // Check OTP expiration
    });

    if (!user) {
      return res.status(400).json({ message: "INVALID OR EXPIRED OTP" }); // Bad request: OTP is invalid or expired
    }

    // Mark the user as verified and clear OTP-related fields
    user.isVerified = true;
    user.otp = undefined; // Clear OTP
    user.otpExpires = undefined; // Clear OTP expiration
    await user.save();

    res.status(200).json({ message: "ACCOUNT VERIFIED SUCCESSFULLY", user });
  } catch (err) {
    // Handle unexpected errors during OTP verification
    res.status(500).json({
      message: "ERROR DURING OTP VERIFICATION",
      error: err.message,
    });
  }
};

// Login endpoint
const login = async (req, res) => {
  const { email, password } = req.body;
  const secret = process.env.JWT_KEY; // JWT secret key from environment variables

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "USER NOT FOUND", // Not found: User does not exist
      });
    }

    // Check if the user is verified
    if (!user.isVerified) {
      return res.status(403).json({
        message: "USER NOT VERIFIED. PLEASE VERIFY ACCOUNT", // Forbidden: User not verified
      });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "AUTH FAILED", // Unauthorized: Invalid credentials
      });
    }

    // Generate a JWT token for the user
    const token = jwt.sign({ user: email, userId: user._id }, secret, {
      expiresIn: "1h", // Token expires in 1 hour
    });

    // Send success response to the client
    res.status(200).json({
      message: "AUTH SUCCESSFUL",
      user,
      token,
    });
  } catch (err) {
    // Handle unexpected errors during login
    res.status(500).json({
      message: "ERROR DURING LOGIN",
      error: err.message,
    });
  }
};

// Export all controller functions
module.exports = {
  signup,
  verifyOtp,
  login,
};
