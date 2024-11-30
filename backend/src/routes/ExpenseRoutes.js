import express from 'express';
import Expense from '../models/Expense.js';
import OpenAI from 'openai';

const router = express.Router();

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure this is loaded from .env
});

console.log('OpenAI initialized successfully');

// Function to call OpenAI API with retry logic
async function callOpenAIApi(prompt) {
  const maxRetries = 3; // Retry up to 3 times
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a financial assistant. Categorize transactions into predefined categories like Groceries, Rent, Entertainment, Food, Utilities, Transportation.' },
          { role: 'user', content: prompt },
        ],
        max_tokens: 20,
      });
      return response.choices[0]?.message?.content?.trim(); // Extract and return category
    } catch (error) {
      console.error(`Attempt ${attempt + 1} failed:`, error.response?.data || error.message);
      if (error.response?.status === 429 && attempt < maxRetries - 1) {
        console.warn(`Rate limit exceeded. Retrying in ${2000 * (attempt + 1)}ms...`);
        await new Promise((resolve) => setTimeout(resolve, 2000 * (attempt + 1))); // Exponential backoff
      } else {
        throw new Error('Failed to fetch response from OpenAI: ' + error.message); // Re-throw error if not retryable
      }
    }
    attempt++;
  }

  throw new Error('Failed to fetch response from OpenAI after multiple retries.');
}

// Route to Add an Expense
router.post('/addExpense', async (req, res) => {
  const { userId, category, amount, date } = req.body;

  if (!userId || !category || !amount || !date) {
    return res.status(400).json({ error: 'All fields (userId, category, amount, date) are required.' });
  }

  const expense = new Expense({ userId, category, amount, date });
  try {
    await expense.save();
    res.status(200).json({ message: 'Expense added successfully' });
  } catch (error) {
    console.error('Error adding expense:', error.message);
    res.status(500).json({ error: 'Failed to add expense. Please try again.' });
  }
});

// Route to Fetch Monthly Expenses
router.get('/monthlyExpenses/:userId/:month/:year', async (req, res) => {
  const { userId, month, year } = req.params;

  if (!userId || !month || !year) {
    return res.status(400).json({ error: 'userId, month, and year are required.' });
  }

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
    console.error('Error fetching monthly expenses:', error.message);
    res.status(500).json({ error: 'Failed to fetch expenses. Please try again later.' });
  }
});

// AI Categorization Endpoint
router.post('/categorize', async (req, res) => {
  const { description } = req.body;

  if (!description || typeof description !== 'string') {
    return res.status(400).json({ error: 'Description is required and must be a string.' });
  }

  try {
    const category = await callOpenAIApi(`Categorize the following transaction: "${description}"`);
    if (category) {
      res.status(200).json({ category });
    } else {
      res.status(500).json({ error: 'Failed to parse category from AI response. Please refine the description.' });
    }
  } catch (error) {
    console.error('Error with AI Categorization:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to categorize transaction. Please try again later.' });
  }
});

export default router;
