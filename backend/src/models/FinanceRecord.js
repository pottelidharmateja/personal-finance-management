import mongoose from 'mongoose';

const FinanceRecordSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const FinanceRecord = mongoose.model('FinanceRecord', FinanceRecordSchema);

export default FinanceRecord; // Exporting using ES module syntax
