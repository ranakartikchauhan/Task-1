const express = require('express');
const router = express.Router();

const { registerUser, loginUser, logout,validateRegistration } = require('../controllers/authController');

// POST /register
router.post('/register',validateRegistration, registerUser);

// POST /login
router.post('/login', loginUser);
router.post('/logout', logout);

module.exports = router;