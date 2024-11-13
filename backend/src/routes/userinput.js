import express from 'express';
import FinanceRecord from '../models/FinanceRecord.js'; // Ensure this import matches your setup

const router = express.Router();

// Define routes for user inputs

// Save user inputs
router.post('/save-inputs', async (req, res) => {
  const { userId, records } = req.body;

  try {
    // Validate inputs
    if (!userId || !records || !Array.isArray(records)) {
      return res.status(400).json({ error: 'Invalid input data' });
    }

    // Save each record to the database
    const savedRecords = await Promise.all(
      records.map(async (record) => {
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
    console.error('Error saving inputs:', error);
    return res.status(500).json({ error: 'Failed to save inputs' });
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
      return res.status(404).json({ message: 'No records found.' });
    }

    return res.status(200).json(records);
  } catch (error) {
    console.error('Error fetching records:', error.message);
    return res.status(500).json({ error: 'Failed to fetch records.' });
  }
});

// Export router as default
export default router;