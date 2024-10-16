const express = require('express');
const jwt = require('jsonwebtoken');
const FinanceRecord = require('../models/FinanceRecord');  // Adjusted import path

const router = express.Router();  // Initialize router

// Middleware to authenticate and extract userId from token
const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access denied, no token provided' });

  try {
    const decoded = jwt.verify(token, 'yourSecretKey');
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// Add a new financial record
router.post('/record', authenticate, async (req, res) => {
  const { title, amount, type } = req.body;
  const userId = req.userId;

  try {
    const record = new FinanceRecord({ userId, title, amount, type });
    await record.save();
    res.status(201).json(record);
  } catch (error) {
    console.error('Error adding record:', error);
    res.status(500).json({ error: 'Failed to add record' });
  }
});

// Get all financial records for a user
router.get('/records', authenticate, async (req, res) => {
  const userId = req.query.userId;

  try {
    const records = await FinanceRecord.find({ userId });
    res.json(records);
  } catch (error) {
    console.error('Error fetching records:', error);
    res.status(500).json({ error: 'Failed to fetch records' });
  }
});

module.exports = router;  // Export the router
