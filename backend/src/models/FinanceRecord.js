const mongoose = require('mongoose');

const FinanceRecordSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { type: String, required: true }, // 'income' or 'expense'
  date: { type: Date, default: Date.now }
});

// Ensure the model name and collection name are correct
module.exports = mongoose.model('FinanceRecord', FinanceRecordSchema, 'financerecords');
