import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';
import { jwtDecode } from 'jwt-decode';

const DashboardContent = () => {
  const [totalBalance, setTotalBalance] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [financeRecords, setFinanceRecords] = useState([]);
  const [loading, setLoading] = useState(true); // Added loading state
  const [errorMessage, setErrorMessage] = useState(''); // Error message state
  const expenseChartRef = useRef(null);
  const incomeSavingsChartRef = useRef(null);

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Get input values
    const income = parseFloat(e.target.income.value);
    const rent = parseFloat(e.target.rent.value);
    const groceries = parseFloat(e.target.groceries.value);
    const food = parseFloat(e.target.food.value);
    const wifi = parseFloat(e.target.wifi.value);
    const electricity = parseFloat(e.target.electricity.value);
    const credit = parseFloat(e.target.credit.value);

    // Calculate total expenses and balance
    const expenses = rent + groceries + food + wifi + electricity + credit;
    const balance = income - expenses;

    // Update state
    setTotalBalance(balance);
    setTotalExpenses(expenses);

    // Data to be saved to backend
    const records = [
      { title: 'Monthly Income', amount: income, type: 'income' },
      { title: 'Rent', amount: rent, type: 'expense' },
      { title: 'Groceries', amount: groceries, type: 'expense' },
      { title: 'Food & Dining', amount: food, type: 'expense' },
      { title: 'Wi-Fi Bill', amount: wifi, type: 'expense' },
      { title: 'Electricity Bill', amount: electricity, type: 'expense' },
      { title: 'Credit Card Payments', amount: credit, type: 'expense' },
    ];

    // Get JWT token from local storage
    const token = localStorage.getItem('token');

    // Check if the token exists
    if (!token) {
      setErrorMessage('User is not authenticated. Please log in.');
      return;
    }

    // Decode token to get user ID
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.userId;

    // Send data to backend
    try {
      const response = await axios.post(
        'http://localhost:5500/api/user-inputs/save-inputs',
        { userId, records },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        alert('Data saved successfully!');
        fetchUserData(); // Refresh data
      } else {
        throw new Error('Failed to save data');
      }
    } catch (error) {
      console.error('Error saving data:', error.message);
      setErrorMessage('Failed to save data. Please try again.');
    }

    // Update charts
    updateExpenseChart([rent, groceries, food, wifi, electricity, credit]);
    updateIncomeSavingsChart(income, balance, expenses);
  };

  // Fetch user data from backend
  const fetchUserData = async () => {
    const token = localStorage.getItem('token');

    // Check if the token exists
    if (!token) {
      setErrorMessage('User is not authenticated. Please log in.');
      setLoading(false);
      return;
    }

    // Decode token to get user ID
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.userId;

    try {
      const response = await axios.get(
        `http://localhost:5500/api/user-inputs/get-inputs/${userId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200 && response.data.length > 0) {
        setFinanceRecords(response.data); // Update finance records from backend
        setErrorMessage(''); // Clear error message
      } else {
        setErrorMessage('No records found.');
      }
    } catch (error) {
      console.error('Error fetching user data:', error.message);
      setErrorMessage('Failed to fetch data. Please try again.');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchUserData();
  }, []);

  // Update expense chart
  const updateExpenseChart = (data) => {
    if (expenseChartRef.current) {
      if (expenseChartRef.current.chartInstance) {
        expenseChartRef.current.chartInstance.destroy(); // Destroy existing chart
      }
      expenseChartRef.current.chartInstance = new Chart(expenseChartRef.current, {
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

  // Update income vs savings vs expenses chart
  const updateIncomeSavingsChart = (income, savings, expenses) => {
    if (incomeSavingsChartRef.current) {
      if (incomeSavingsChartRef.current.chartInstance) {
        incomeSavingsChartRef.current.chartInstance.destroy(); // Destroy existing chart
      }
      incomeSavingsChartRef.current.chartInstance = new Chart(incomeSavingsChartRef.current, {
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

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        {loading ? (
          <p>Loading data...</p>
        ) : (
          <>
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

            <h2>Previously Saved Records</h2>
            <div>
              {financeRecords.length > 0 ? (
                financeRecords.map((record, index) => (
                  <div key={index}>
                    <p>Title: {record.title}</p>
                    <p>Amount: {record.amount}</p>
                    <p>Type: {record.type}</p>
                  </div>
                ))
              ) : (
                <p>No records found.</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardContent;