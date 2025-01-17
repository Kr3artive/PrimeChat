const User = require("../models/userModel"); // Mongoose model for User

const allusers = async (req, res) => {
    const keyword = req.query.search
      ? {
          $or: [
            { fullname: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};
    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
    res.send(users);
};

module.exports = { allusers };
