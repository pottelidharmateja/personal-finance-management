import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
});

const Expense = mongoose.model('Expense', expenseSchema);

export default Expense;  // Ensure this line exports the model as default
