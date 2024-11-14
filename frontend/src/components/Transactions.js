import React from 'react';
import { useNavigate } from 'react-router-dom';
import TransactionsReview from './TransactionsReview';

const Transactions = () => {
  const navigate = useNavigate();

  // Sample expenses data (replace with actual data source)
  const expenses = [
    { category: 'Groceries', amount: 45.67 },
    { category: 'Transportation', amount: 15.34 },
    { category: 'Entertainment', amount: 23.89 },
  ];

  return (
    <div className="component-container">
      <h2>Transactions</h2>
      <p>This section will display all transaction details.</p>
      
      {/* TransactionsReview component */}
      <TransactionsReview expenses={expenses} />

      {/* Back button moved to the bottom */}
      <div className="back-button-container">
        <button className="back-button" onClick={() => navigate('/dashboard')}>
          Back
        </button>
      </div>
    </div>
  );
};

export default Transactions;
