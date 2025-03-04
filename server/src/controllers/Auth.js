const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const User = require("../models/userModel");
const cloudinary = require("cloudinary").v2;

console.log("CLOUDINARY_CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("CLOUDINARY_API_KEY:", process.env.CLOUDINARY_API_KEY);
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("JWT_KEY:", process.env.JWT_KEY);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});


// Temporary storage for unverified users
const tempUsers = new Map();

const signup = async (req, res) => {
  const { fullname, email, password } = req.body;
  const pic = req.file;
  const secret = process.env.JWT_KEY;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "USER ALREADY EXISTS" });
    }

    cloudinary.api
      .ping()
      .then((result) =>
        console.log("Cloudinary configuration is valid:", result)
      )
      .catch((error) =>
        console.error("Cloudinary configuration error:", error)
    );

    let profilepicUrl = "";

    if (req.file) {
      const profilepic = req.file;
      console.log("Received file:", req.file);
      const b64 = Buffer.from(profilepic.buffer).toString("base64")
      const dataURI = `data:${profilepic.mimetype};base64,${b64}`;
      const timestamp = Math.round(new Date().getTime() / 1000);
      const result = await cloudinary.uploader.upload(dataURI, {
        folder: "chats/pics",
        timestamp: timestamp,
      });
      profilepicUrl = result.secure_url;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);

    // Store user temporarily
    tempUsers.set(email, {
      fullname,
      email,
      password: hashedPassword,
      pic: profilepicUrl,
      otp: hashedOtp,
      otpExpires: Date.now() + 5 * 60 * 1000, // OTP valid for 5 mins
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
    console.error("Signup error:", err);
    res
      .status(500)
      .json({ message: "ERROR DURING REGISTRATION", error: err.message });
  }
};


const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const normalizedEmail = email.toLowerCase();

    console.log("Incoming Email:", normalizedEmail);
    console.log("Incoming OTP:", otp);

    const tempUser = tempUsers.get(normalizedEmail); // FIXED: Use .get() for Map
    console.log("Stored Temp User:", tempUser); // Debug

    if (!tempUser) {
      return res.status(400).json({ message: "INVALID OR EXPIRED OTP" });
    }

    // Compare the stored hashed OTP with the incoming OTP
    const isOtpValid = await bcrypt.compare(otp, tempUser.otp);
    if (!isOtpValid) {
      return res.status(400).json({ message: "INVALID OTP" });
    }

    if (Date.now() > tempUser.otpExpires) {
      return res.status(400).json({ message: "OTP HAS EXPIRED" });
    }

    // Save user to the database
    const user = new User({
      fullname: tempUser.fullname, 
      email: tempUser.email,
      password: tempUser.password,
      pic: tempUser.pic,
      isVerified: true,
    });

    await user.save();

    console.log("User Saved to Database:", user); // Debug

    tempUsers.delete(normalizedEmail); // FIXED: Use .delete() for Map

    res.status(200).json({ message: "ACCOUNT VERIFIED SUCCESSFULLY", user });
  } catch (error) {
    console.error("Error during OTP verification:", error.message);
    res.status(500).json({
      message: "ERROR DURING OTP VERIFICATION",
      error: error.message,
    });
  }
};

// Login Function
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "USER NOT FOUND" });
    }

    // Check if user is verified
    if (!user.isVerified) {
      return res.status(403).json({ message: "USER NOT VERIFIED. PLEASE VERIFY ACCOUNT" });
    }

    // Validate password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "INVALID CREDENTIALS" });
    }

    // Generate JWT token
    const token = jwt.sign({ user: email, userId: user._id }, process.env.JWT_KEY, {
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
