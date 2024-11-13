// IncomeSavingsChart.js
import React from 'react';
import { Pie } from 'react-chartjs-2';

const IncomeSavingsChart = ({ totalIncome, totalExpenses, totalSavings }) => {
  const data = {
    labels: ['Income', 'Savings', 'Expenses'],
    datasets: [
      {
        data: [totalIncome, totalSavings, totalExpenses],
        backgroundColor: ['#36A2EB', '#4CAF50', '#FF6384'],
        hoverBackgroundColor: ['#36A2EB', '#4CAF50', '#FF6384'],
      },
    ],
  };

  return (
    <div className="income-savings-chart">
      <h3>Income vs Savings vs Expenses</h3>
      <Pie data={data} />
    </div>
  );
};

export default IncomeSavingsChart;