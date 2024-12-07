import express from 'express';
import FinanceRecord from '../models/FinanceRecord.js';

const router = express.Router();

// Save user inputs
router.post('/save-inputs', async (req, res) => {
  const { userId, records } = req.body;

  try {
    // Validate inputs
    if (!userId || !records || !Array.isArray(records)) {
      return res.status(400).json({ error: 'Invalid input data: UserId and records array are required.' });
    }

    // Save each record to the database
    const savedRecords = await Promise.all(
      records.map(async (record) => {
        if (!record.title || !record.amount || !record.type) {
          throw new Error('Each record must have title, amount, and type.');
        }

        const newRecord = new FinanceRecord({
          userId,
          title: record.title,
          amount: record.amount,
          type: record.type,
        });
        return await newRecord.save();
      })
    );

    return res.status(200).json({ message: 'Data saved successfully', savedRecords });
  } catch (error) {
    console.error('Error saving inputs:', error.message);
    return res.status(500).json({ error: `Failed to save inputs: ${error.message}` });
  }
});

// Fetch user inputs
router.get('/get-inputs/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required.' });
    }

    const records = await FinanceRecord.find({ userId });

    if (!records || records.length === 0) {
      return res.status(404).json({ message: 'No records found for this user.' });
    }

    return res.status(200).json(records);
  } catch (error) {
    console.error('Error fetching records:', error.message);
    return res.status(500).json({ error: `Failed to fetch records: ${error.message}` });
  }
});

export default router;
