// src/routes/ai.js
const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');
const auth = require('./auth'); // Adjusted path based on your structure

// Generate financial insights
router.post('/insights', auth, async (req, res) => {
  try {
    const { query, transactions } = req.body;

    // Validate input
    if (!query || !transactions) {
      return res.status(400).json({ error: 'Query and transactions are required' });
    }

    // Call the service and save the insight to the database
    const savedInsight = await aiService.generateFinancialInsights(req.user.id, transactions, query);
    
    // Return the saved insight record
    res.json(savedInsight);
  } catch (error) {
    console.error('AI Insights Error:', error.message || error);
    res.status(500).json({ error: 'Failed to generate insights' });
  }
});

// Get expense predictions
router.post('/predict-expenses', auth, async (req, res) => {
  try {
    const { historicalData } = req.body;

    // Validate input
    if (!historicalData) {
      return res.status(400).json({ error: 'Historical data is required' });
    }

    // Call the service and save the prediction to the database
    const savedPrediction = await aiService.predictExpenses(req.user.id, historicalData);
    
    // Return the saved prediction record
    res.json(savedPrediction);
  } catch (error) {
    console.error('Prediction Error:', error.message || error);
    res.status(500).json({ error: 'Failed to generate prediction' });
  }
});

// Categorize a transaction
router.post('/categorize', auth, async (req, res) => {
  try {
    const { transaction } = req.body;

    // Validate input
    if (!transaction) {
      return res.status(400).json({ error: 'Transaction is required' });
    }

    // Call the service and save the categorization to the database
    const savedCategory = await aiService.categorizationTransaction(req.user.id, transaction);
    
    // Return the saved categorization record
    res.json(savedCategory);
  } catch (error) {
    console.error('Categorization Error:', error.message || error);
    res.status(500).json({ error: 'Failed to categorize transaction' });
  }
});

module.exports = router;
