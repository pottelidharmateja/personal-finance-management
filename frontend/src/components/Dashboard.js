import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto'; // Import Chart.js
import './Dashboard.css';

const Dashboard = () => {
  const [loginHistory, setLoginHistory] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const expenseChartRef = useRef(null);
  const incomeSavingsChartRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:5500/api/user/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLoginHistory(response.data.loginHistory);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, []);

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

    // Add transaction
    const newTransaction = { rent, groceries, food, wifi, electricity, credit };
    setTransactions((prevTransactions) => [...prevTransactions, newTransaction]);
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
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="logo">FINANCE</div>
        <ul className="nav">
          <li><a href="#" className="active">Dashboard</a></li>
          <li><a href="#">Transactions</a></li>
          <li><a href="#">Cash Flow</a></li>
          <li><a href="#">Investments</a></li>
          <li><a href="#">Categories</a></li>
          <li><a href="#">Settings</a></li>
        </ul>
      </aside>

      <main className="dashboard">
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

        <section className="cards">
          <div className="card">
            <h3>Total Balance</h3>
            <p>${totalBalance.toFixed(2)}</p>
          </div>
          <div className="card">
            <h3>Total Expenses</h3>
            <p>${totalExpenses.toFixed(2)}</p>
          </div>
        </section>

        <section className="charts">
          <div className="pie-chart">
            <h3>Expense Breakdown</h3>
            <canvas ref={expenseChartRef}></canvas>
          </div>
          <div className="pie-chart">
            <h3>Income vs Savings vs Expenses</h3>
            <canvas ref={incomeSavingsChartRef}></canvas>
          </div>
        </section>

        <section className="login-history">
          <h2>Login History</h2>
          {loginHistory.length > 0 ? (
            <ul>
              {loginHistory.map((date, index) => (
                <li key={index}>{new Date(date).toLocaleString()}</li>
              ))}
            </ul>
          ) : (
            <p>No login history available.</p>
          )}
        </section>

        <section className="recent-transactions">
          <h2>Recent Transactions</h2>
          {transactions.length > 0 ? (
            <ul>
              {transactions.map((transaction, index) => (
                <li key={index}>
                  Rent: ${transaction.rent}, Groceries: ${transaction.groceries}, Food: ${transaction.food}, 
                  Wi-Fi: ${transaction.wifi}, Electricity: ${transaction.electricity}, Credit: ${transaction.credit}
                </li>
              ))}
            </ul>
          ) : (
            <p>No transactions available.</p>
          )}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
