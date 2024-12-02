import express from 'express';
import Budget from '../models/Budget.js'; // Budget schema

const router = express.Router();

// Save user budget
router.post('/save-budget', async (req, res) => {
  const { userId, category, limit } = req.body;

  try {
    const budget = new Budget({ userId, category, limit });
    await budget.save();
    res.status(200).json({ message: 'Budget saved successfully.' });
  } catch (error) {
    console.error('Error saving budget:', error);
    res.status(500).json({ error: 'Failed to save budget.' });
  }
});

// Get user budget and spending
router.get('/get-budget/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const budgets = await Budget.find({ userId });
    res.status(200).json(budgets);
  } catch (error) {
    console.error('Error fetching budgets:', error);
    res.status(500).json({ error: 'Failed to fetch budgets.' });
  }
});

export default router;
