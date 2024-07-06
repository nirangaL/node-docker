const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

exports.signUp = async (req, res, next) => {
  const { username, password } = req.body;
  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(password, salt);
  try {
    const newUser = await User.create({ username, password: hash });
    // delete newUser.password;
    res.status(201).json({
      message: "User created successfully",
      data: { user: newUser },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username }).lean();
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }
    // Store user information in the session
    req.session.user = {
      id: user._id,
      username: user.username,
    };
    delete user.password;
    res.status(200).json({
      message: "User logged in successfully",
      data: { user },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
