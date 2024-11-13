import React from 'react';

const TransactionsReview = ({ expenses }) => {
  return (
    <div className="transactions-review">
      <h3>Transactions to Review</h3>
      <ul>
        {expenses.map((expense, index) => (
          <li key={index}>
            <span>{expense.category} - ${expense.amount.toFixed(2)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionsReview;
