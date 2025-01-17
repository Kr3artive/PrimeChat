const express = require("express");
const { allusers } = require("../controllers/User");
const verifyToken = require("../middleware/Auth")

const router = express.Router();


router.get('/alluser', verifyToken, allusers)

module.exports = router