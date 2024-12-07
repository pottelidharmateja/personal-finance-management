import React, { useState } from 'react';
import axios from 'axios';

const BudgetForm = () => {
  const [category, setCategory] = useState('');
  const [limit, setLimit] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5500/api/save-budget', {
        userId: 'current-user-id',
        category,
        limit,
      });
      alert('Budget saved successfully!');
    } catch (error) {
      console.error('Error saving budget:', error);
      alert('Failed to save budget.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Category:
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
      </label>
      <label>
        Limit:
        <input
          type="number"
          value={limit}
          onChange={(e) => setLimit(e.target.value)}
        />
      </label>
      <button type="submit">Save Budget</button>
    </form>
  );
};

export default BudgetForm;
