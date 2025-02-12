const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

module.exports = async (req, res, next) => {
  try {
    console.log("Request Headers:", req.headers);

    // Check if Authorization header exists
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "TOKEN IS REQUIRED OR INVALID" });
    }

    // Extract the token
    const token = authHeader.split(" ")[1];
    console.log("Extracted Token:", token);

    // Verify the token
    jwt.verify(token, process.env.JWT_KEY, async (err, decoded) => {
      if (err) {
        console.error("JWT Verification Error:", err.message);
        return res.status(401).json({ message: "INVALID OR EXPIRED TOKEN" });
      }

      console.log("Decoded Token:", decoded);

      // Fetch the user from the database to attach full user details (excluding password)
      const user = await User.findById(decoded.userId).select("-password");
      if (!user) {
        return res.status(401).json({ message: "USER NOT FOUND" });
      }

      // Attach user to request
      req.user = user;
      console.log("Authenticated User:", req.user);

      // Proceed to the next middleware/controller
      next();
    });
  } catch (error) {
    console.error("Middleware Error:", error.message);
    res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
};
