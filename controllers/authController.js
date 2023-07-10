const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

// Register a new user
const registerUser = async (req, res) => {
  try {
    const { username, email, name, password, confirmPassword, gender } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords don't match" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, name, password: hashedPassword, gender });
    await user.save();

    res.json({ message: 'User registered successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user._id }, 'your-secret-key', {
      expiresIn: "2h",
    });

    // Set the token in a cookie named "authToken"
    res.cookie("authToken", token, {
      httpOnly: true,
      expires: new Date(new Date().getTime() + 20 * 60 * 1000),
    });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { registerUser, loginUser };