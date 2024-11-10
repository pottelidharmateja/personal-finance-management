// src/models/AiQuery.js
const mongoose = require('mongoose');

const aiQuerySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  query: {
    type: String,
    required: true
  },
  response: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['insight', 'prediction', 'recommendation', 'categorization'],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('AiQuery', aiQuerySchema);
