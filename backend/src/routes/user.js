import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.js'; // Import the User model
import validator from 'validator'; // Email validation library

const router = express.Router();

// Middleware to authenticate requests using JWT
const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', ''); // Extract token from the header
  if (!token) {
    return res.status(401).json({ error: 'No token provided. Authentication failed.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
    req.user = decoded; // Attach decoded user data to request
    next(); // Proceed to the next middleware or route
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({
      error: error.name === 'TokenExpiredError'
        ? 'Token expired. Please log in again.'
        : 'Invalid or malformed token. Please log in again.'
    });
  }
};

// GET /api/user/settings - Fetch user settings (profile data)
router.get('/settings', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.json({ email: user.email, firstName: user.firstName, lastName: user.lastName });
  } catch (error) {
    console.error('Error fetching user settings:', error);
    res.status(500).json({ error: 'Failed to fetch user settings. Please try again.' });
  }
});


// PUT /api/user/settings - Update user settings (e.g., email, first name, etc.)
router.put('/settings', authenticate, async (req, res) => {
  const { email, firstName, lastName } = req.body;

  // Validate incoming request data
  if (!email || !firstName || !lastName) {
    return res.status(400).json({ error: 'Missing required fields (email, first name, last name).' });
  }

  // Validate email format
  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format.' });
  }

  try {
    // Find the user by ID and update the settings
    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId, // Use the userId from the token
      { email, firstName, lastName },
      { new: true, runValidators: true } // Return the updated user object and validate inputs
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Respond with the updated user settings
    res.json({
      message: 'User settings updated successfully.',
      user: {
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
      },
    });
  } catch (error) {
    console.error('Error updating user settings:', error);
    res.status(500).json({ error: `Failed to update user settings. Please try again. ${error.message}` });
  }
});

export default router;
