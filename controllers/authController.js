const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

const User = require('../models/user');

const secretKey = process.env.SECRET_KEY;

const TOKEN_EXPIRATION = '2h';

// Register a new user
const registerUser = async (req, res) => {
  try {
    const { username, email, password, confirmPassword, gender } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      if (existingUser.username === username) {
        return res.status(401).json({ message: 'Username already exists' });
      }
      if (existingUser.email === email) {
        return res.status(401).json({ message: 'Email already exists' });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword, gender });
    await user.save();
    res.json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
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

    const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: TOKEN_EXPIRATION });

    res.cookie('authToken', token, {
      httpOnly: true,
      expires: new Date(Date.now() + 20 * 60 * 1000),
    });

    res.json({ token });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const logout = async (req, res) => {
  res.clearCookie('authToken');
  res.status(200).json({ message: 'Logout successful' });
};

// Validation middleware
const validateRegistration = [
  body('username').notEmpty().withMessage('Username is required'),
  body('email').isEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords don't match");
    }
    return true;
  }),
];

module.exports = { registerUser, loginUser, logout, validateRegistration };
