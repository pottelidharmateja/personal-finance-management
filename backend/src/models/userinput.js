const mongoose = require('mongoose');

const UserInputSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  income: { type: Number, required: true },
  rent: { type: Number, required: true },
  groceries: { type: Number, required: true },
  food: { type: Number, required: true },
  wifi: { type: Number, required: true },
  electricity: { type: Number, required: true },
  credit: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('UserInput', UserInputSchema);
