const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Import User model
const router = express.Router();

// Signup Route
router.post('/signup', async (req, res) => {
  const { email, password } = req.body; // Destructure email and password

  // Debug: Log the incoming request body
  console.log('Received signup request:', req.body);

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ error: 'Please fill in all the required fields.' });
  }

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists. Please log in.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the new user
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    return res.status(201).json({ message: 'User created successfully!' });
  } catch (error) {
    console.error('Signup error:', error.message);
    return res.status(500).json({ error: 'Signup failed. Please try again.' });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body; // Destructure email and password

  // Debug: Log the incoming request body
  console.log('Received login request:', req.body);

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'User not found. Please sign up.' });
    }

    // Compare the provided password with the hashed password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ error: 'Invalid password. Try again.' });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'defaultSecretKey',
      { expiresIn: '1h' }
    );

    // Respond with the token
    return res.json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Login error:', error.message);
    return res.status(500).json({ error: 'Login failed. Please try again later.' });
  }
});

module.exports = router;
