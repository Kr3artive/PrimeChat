const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // Check if the Authorization header exists
  const token = req.headers["Authorization"];

  if (!token) return res.status(403).send("TOKEN IS REQUIRED");

  // Split the "Bearer <token>" and extract the token
  const tokenParts = token.split(" "); // "Bearer" and "<token>"
  if (tokenParts.length !== 2) {
    return res.status(403).send("INVALID TOKEN FORMAT");
  }

  const tokenString = tokenParts[1]; // This is the actual token

  // Verify the token using the JWT secret
  jwt.verify(tokenString, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).send("INVALID TOKEN");

    req.user = user; // Attach the user data to the request object
    next(); // Continue to the next middleware or route handler
  });
};
