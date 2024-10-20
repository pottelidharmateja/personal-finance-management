const express = require('express');
const router = express.Router();
const FinanceRecord = require('../models/FinanceRecord'); // Correct import
const jwt = require('jsonwebtoken');

// Middleware to authenticate the user
const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'No token provided. Authentication failed.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user data to the request
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token. Please log in again.' });
  }
};

// POST route to create a new finance record
router.post('/records', authenticate, async (req, res) => {
  const { title, amount, type } = req.body;

  if (!title || !amount || !type) {
    return res.status(400).json({ error: 'Please provide title, amount, and type.' });
  }

  try {
    const newRecord = new FinanceRecord({
      title,
      amount,
      type,
      userId: req.user.userId // Attach user ID from token
    });

    await newRecord.save();
    res.status(201).json(newRecord); // Return the created record
  } catch (error) {
    console.error('Error creating finance record:', error);
    res.status(500).json({ error: 'Failed to create finance record.' });
  }
});

module.exports = router;
