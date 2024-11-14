import express from 'express';
import Expense from '../models/Expense.js';

const router = express.Router();

router.post('/addExpense', async (req, res) => {
  const { userId, category, amount, date } = req.body;
  const expense = new Expense({ userId, category, amount, date });
  try {
    await expense.save();
    res.status(200).json({ message: 'Expense added successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add expense' });
  }
});

router.get('/monthlyExpenses/:userId/:month/:year', async (req, res) => {
  const { userId, month, year } = req.params;
  try {
    const expenses = await Expense.find({
      userId,
      date: {
        $gte: new Date(`${year}-${month}-01`),
        $lte: new Date(`${year}-${month}-31`),
      },
    });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
});

export default router;
