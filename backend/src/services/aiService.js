// src/services/aiService.js
const OpenAI = require('openai');
const NodeCache = require('node-cache');
const AiQuery = require('../models/AiQuery');

class AiService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    this.cache = new NodeCache({ stdTTL: 3600 }); // Cache for 1 hour
  }

  async generateFinancialInsights(userId, transactions, query) {
    const cacheKey = `insights-${userId}-${query}`;
    const cachedResult = this.cache.get(cacheKey);

    if (cachedResult) {
      return cachedResult;
    }

    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a financial advisor analyzing personal finance data. Provide specific, actionable insights."
          },
          {
            role: "user",
            content: `Based on these transactions: ${JSON.stringify(transactions)}, ${query}`
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      });

      const response = completion.choices[0].message.content;

      // Save to database
      const savedQuery = await AiQuery.create({
        userId,
        query,
        response,
        category: 'insight'
      });

      // Cache the result
      this.cache.set(cacheKey, response);

      return savedQuery; // Return the saved query object with response data
    } catch (error) {
      console.error('AI Service Error:', error);
      throw new Error('Failed to generate financial insights');
    }
  }

  async predictExpenses(userId, historicalData) {
    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a financial prediction system. Analyze historical data and predict future expenses."
          },
          {
            role: "user",
            content: `Based on this historical data: ${JSON.stringify(historicalData)}, predict likely expenses for next month.`
          }
        ],
        temperature: 0.3
      });

      const response = completion.choices[0].message.content;

      // Save to database
      const savedQuery = await AiQuery.create({
        userId,
        query: 'expense_prediction',
        response,
        category: 'prediction'
      });

      return savedQuery; // Return the saved query object with response data
    } catch (error) {
      console.error('Prediction Error:', error);
      throw new Error('Failed to predict expenses');
    }
  }

  async categorizationTransaction(userId, transaction) {
    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a transaction categorization system. Categorize the transaction into one of these categories: Food, Transport, Entertainment, Shopping, Bills, Others."
          },
          {
            role: "user",
            content: `Categorize this transaction: ${JSON.stringify(transaction)}`
          }
        ],
        temperature: 0.1
      });

      const response = completion.choices[0].message.content;

      // Save to database
      const savedQuery = await AiQuery.create({
        userId,
        query: 'transaction_categorization',
        response,
        category: 'categorization'
      });

      return savedQuery; // Return the saved query object with response data
    } catch (error) {
      console.error('Categorization Error:', error);
      throw new Error('Failed to categorize transaction');
    }
  }
}

module.exports = new AiService();
