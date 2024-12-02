import express from 'express';
import { trainSpendingModel, predictSpending } from '../models/spendingPrediction.js';
import FinanceRecord from '../models/FinanceRecord.js';

const router = express.Router();

router.get('/predict-spending/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const userTransactions = await FinanceRecord.find({ userId }).sort({ date: 1 });

    if (!userTransactions || userTransactions.length === 0) {
      console.error(`No transactions found for user: ${userId}`);
      return res.status(404).json({ error: 'No user data found for predictions.' });
    }

    const data = userTransactions.map((transaction) => {
      if (!transaction.date || typeof transaction.amount !== 'number') return null;
      return {
        month: new Date(transaction.date).getMonth() + 1,
        day: new Date(transaction.date).getDate(),
        amount: transaction.amount,
      };
    }).filter(Boolean);

    if (data.length === 0) {
      console.error(`No valid transactions found for user: ${userId}`);
      return res.status(400).json({ error: 'Valid transactions not found for predictions.' });
    }

    const { model, featureMax, labelMax } = await trainSpendingModel(data);

    const lastTransactionDate = new Date(userTransactions[userTransactions.length - 1].date);
    const futureInputs = [];
    for (let i = 1; i <= 3; i++) {
      const futureDate = new Date(lastTransactionDate);
      futureDate.setMonth(futureDate.getMonth() + i);

      if (futureDate.getMonth() === 0) {
        futureDate.setFullYear(futureDate.getFullYear() + 1);
      }

      futureInputs.push([futureDate.getMonth() + 1, futureDate.getDate()]);
    }

    const predictions = await predictSpending({ model, featureMax, labelMax }, futureInputs);

    if (!predictions || predictions.length !== futureInputs.length) {
      console.error('Prediction mismatch: predictions length does not match future inputs length.');
      return res.status(500).json({ error: 'Failed to generate valid predictions.' });
    }

    // Debug logs
    console.log('Backend Response:', { predictions, futureInputs });

    return res.status(200).json({ predictions, futureInputs });
  } catch (error) {
    console.error('Error predicting spending:', error.message || error);
    return res.status(500).json({ error: 'Failed to predict spending. Please try again later.' });
  }
});

export default router;
