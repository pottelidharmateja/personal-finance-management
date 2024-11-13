// ExpenseChart.js
import React from 'react';
import { Line } from 'react-chartjs-2';

const ExpenseChart = ({ history }) => {
  const categories = [...new Set(history.filter(record => record.type === 'expense').map(record => record.title))];
  const dataPoints = categories.map(category => {
    return history
      .filter(record => record.title === category && record.type === 'expense')
      .reduce((sum, record) => sum + record.amount, 0);
  });

  const data = {
    labels: categories,
    datasets: [
      {
        label: 'Monthly Expenses',
        data: dataPoints,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        fill: false,
      },
    ],
  };

  return (
    <div className="expense-chart">
      <h3>Monthly Expense Breakdown</h3>
      <Line data={data} />
    </div>
  );
};

export default ExpenseChart;