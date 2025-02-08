const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    console.log("Request Headers:", req.headers);

    // Check if the Authorization header exists
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(403).json({ message: "TOKEN IS REQUIRED" });
    }

    // Ensure the header starts with "Bearer"
    const tokenParts = authHeader.split(" ");
    if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
      return res.status(403).json({ message: "INVALID TOKEN FORMAT" });
    }

    const token = tokenParts[1]; // Extract the actual token
    console.log(token);
    

    // Verify the token using the secret
    jwt.verify(token, process.env.JWT_KEY, (err,  user) => {

      if (err) {
        console.error("JWT Verification Error:", err.message);
        return res.status(403).json({ message: "INVALID TOKEN" });
      }

      console.log("Decoded Token:", user);

      // Attach the user data to the request object
      req.user = user;

      // Proceed to the next middleware or route handler
      next();
    });
  } catch (error) {
    console.error("Middleware Error:", error.message);
    res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
};
