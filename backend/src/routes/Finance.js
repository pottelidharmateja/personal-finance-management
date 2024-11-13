import express from 'express';
import FinanceRecord from '../models/FinanceRecord.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Middleware to authenticate user
const authenticate = (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user data to the request object
    next();
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed' });
  }
};

// Get finance records for the logged-in user
router.get('/records', authenticate, async (req, res) => {
  try {
    const records = await FinanceRecord.find({ userId: req.user.userId });
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch records' });
  }
});
router.post('/records', authenticate, async (req, res) => {
  try {
    const { title, amount, type } = req.body;
    const newRecord = new FinanceRecord({ title, amount, type, userId: req.user.userId });
    await newRecord.save();
    res.status(201).json(newRecord);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create finance record' });
  }
});

export default router; // Use ES module export syntax