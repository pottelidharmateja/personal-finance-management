import express from 'express';
import FinanceRecord from '../models/FinanceRecord.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Middleware to authenticate user
const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Authorization token is missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user data to the request object
    next();
  } catch (error) {
    return res.status(401).json({
      error:
        error.name === 'TokenExpiredError'
          ? 'Token expired. Please log in again.'
          : 'Invalid token. Please log in again.',
    });
  }
};

// Get finance records for the logged-in user
router.get('/records', authenticate, async (req, res) => {
  try {
    const records = await FinanceRecord.find({ userId: req.user.userId });
    if (!records || records.length === 0) {
      return res.status(404).json({ message: 'No finance records found for the user.' });
    }
    res.json(records);
  } catch (error) {
    console.error('Error fetching finance records:', error.message);
    res.status(500).json({ error: `Failed to fetch records: ${error.message}` });
  }
});

// Save new finance record
router.post('/records', authenticate, async (req, res) => {
  const { title, amount, type } = req.body;

  try {
    if (!title || !amount || !type) {
      return res.status(400).json({ error: 'Title, amount, and type are required fields.' });
    }

    const newRecord = new FinanceRecord({
      title,
      amount,
      type,
      userId: req.user.userId,
    });

    await newRecord.save();
    res.status(201).json(newRecord);
  } catch (error) {
    console.error('Error saving finance record:', error.message);
    res.status(500).json({ error: `Failed to save finance record: ${error.message}` });
  }
});

export default router;
