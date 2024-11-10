import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.js'; // Import the User model

const router = express.Router();

// Middleware to authenticate requests using JWT
const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'No token provided. Authentication failed.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
    req.user = decoded; // Attach decoded user data to request
    next(); // Proceed to the next middleware or route
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ error: 'Invalid or expired token. Please log in again.' });
  }
};

// Route to get user profile data (including login history)
router.get('/profile', authenticate, async (req, res) => {
  try {
    // Find the user by the ID from the decoded token, excluding the password
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.json(user); // Send user data including login history
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Failed to fetch user data. Please try again.' });
  }
});

export default router; // Export the router for use in server.js