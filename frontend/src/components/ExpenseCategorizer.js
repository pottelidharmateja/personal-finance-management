import React, { useState } from 'react';
import { categorizeExpense } from '../services/expenseService';

const ExpenseCategorizer = () => {
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');

  const handleCategorize = async () => {
    try {
      const result = await categorizeExpense(description);
      setCategory(result.category);
    } catch (error) {
      alert('Failed to categorize expense.');
    }
  };

  return (
    <div>
      <h1>Expense Categorizer</h1>
      <input
        type="text"
        placeholder="Enter expense description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button onClick={handleCategorize}>Categorize</button>
      {category && <p>Category: {category}</p>}
    </div>
  );
};

export default ExpenseCategorizer;
