import React, { useState, useRef } from 'react';
import Chart from 'chart.js/auto';

const DashboardContent = () => {
  const [totalBalance, setTotalBalance] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const expenseChartRef = useRef(null);
  const incomeSavingsChartRef = useRef(null);

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const income = parseFloat(e.target.income.value);
    const rent = parseFloat(e.target.rent.value);
    const groceries = parseFloat(e.target.groceries.value);
    const food = parseFloat(e.target.food.value);
    const wifi = parseFloat(e.target.wifi.value);
    const electricity = parseFloat(e.target.electricity.value);
    const credit = parseFloat(e.target.credit.value);

    const expenses = rent + groceries + food + wifi + electricity + credit;
    const balance = income - expenses;

    setTotalBalance(balance);
    setTotalExpenses(expenses);

    // Update pie charts
    updateExpenseChart([rent, groceries, food, wifi, electricity, credit]);
    updateIncomeSavingsChart(income, balance, expenses);
  };

  const updateExpenseChart = (data) => {
    if (expenseChartRef.current) {
      new Chart(expenseChartRef.current, {
        type: 'pie',
        data: {
          labels: ['Rent', 'Groceries', 'Food', 'Wi-Fi', 'Electricity', 'Credit'],
          datasets: [
            {
              data,
              backgroundColor: ['#4caf50', '#ff9800', '#e53935', '#3f51b5', '#9c27b0', '#ffc107'],
            },
          ],
        },
        options: { responsive: true },
      });
    }
  };

  const updateIncomeSavingsChart = (income, savings, expenses) => {
    if (incomeSavingsChartRef.current) {
      new Chart(incomeSavingsChartRef.current, {
        type: 'pie',
        data: {
          labels: ['Income', 'Savings', 'Expenses'],
          datasets: [
            {
              data: [income, savings, expenses],
              backgroundColor: ['#3498db', '#2ecc71', '#e74c3c'],
            },
          ],
        },
        options: { responsive: true },
      });
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-content">
        <header className="dashboard-header">
          <h1>Welcome Back!</h1>
          <p>Manage your finances efficiently</p>
        </header>

        <form onSubmit={handleFormSubmit} className="input-form">
          <h2>Enter Your Monthly Income & Expenses</h2>
          <input type="number" name="income" placeholder="Monthly Income" required />
          <input type="number" name="rent" placeholder="Rent" required />
          <input type="number" name="groceries" placeholder="Groceries" required />
          <input type="number" name="food" placeholder="Food & Dining" required />
          <input type="number" name="wifi" placeholder="Wi-Fi Bill" required />
          <input type="number" name="electricity" placeholder="Electricity Bill" required />
          <input type="number" name="credit" placeholder="Credit Card Payments" required />
          <button type="submit">Save</button>
        </form>

        <div className="cards-container">
          <div className="card">
            <h3>Total Balance</h3>
            <p>${totalBalance.toFixed(2)}</p>
          </div>
          <div className="card">
            <h3>Total Expenses</h3>
            <p>${totalExpenses.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="pie-charts">
        <div className="pie-chart">
          <h3>Expense Breakdown</h3>
          <canvas ref={expenseChartRef}></canvas>
        </div>
        <div className="pie-chart">
          <h3>Income vs Savings vs Expenses</h3>
          <canvas ref={incomeSavingsChartRef}></canvas>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
