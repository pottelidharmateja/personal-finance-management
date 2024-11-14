import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';
import {jwtDecode} from 'jwt-decode';

const DashboardContent = () => {
  const [totalBalance, setTotalBalance] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const expenseChartRef = useRef(null);
  const incomeSavingsChartRef = useRef(null);
  const lineChartRef = useRef(null);

  const monthNames = useMemo(() => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], []);

  // Calculate totals based on the selected month
  const calculateTotals = useCallback((records) => {
    const filteredRecords = records.filter(record => new Date(record.date).getMonth() === selectedMonth);
    const totalIncome = filteredRecords.filter(r => r.type === 'income').reduce((sum, r) => sum + r.amount, 0);
    const totalExpenses = filteredRecords.filter(r => r.type === 'expense').reduce((sum, r) => sum + r.amount, 0);
    setTotalBalance(totalIncome - totalExpenses);
    setTotalExpenses(totalExpenses);
  }, [selectedMonth]);

  // Update the monthly spending line chart
  const updateLineChart = useCallback((records) => {
    // Initialize monthly data array with 12 zeroes, one for each month
    const monthlyData = Array(12).fill(0);
  
    // Loop through all records to aggregate expenses by month
    records.forEach(record => {
      const month = new Date(record.date).getMonth(); // Extract the month from the record
      if (record.type === 'expense') {
        monthlyData[month] += record.amount; // Add the expense to the corresponding month
      }
    });
  
    // Create or update the line chart with aggregated monthly data
    if (lineChartRef.current) {
      if (lineChartRef.current.chartInstance) {
        lineChartRef.current.chartInstance.destroy(); // Destroy the old instance if it exists
      }
      lineChartRef.current.chartInstance = new Chart(lineChartRef.current, {
        type: 'line',
        data: {
          labels: monthNames, // Label for each month
          datasets: [
            {
              label: 'Monthly Spending',
              data: monthlyData, // Use the monthly data array for line chart values
              borderColor: '#4caf50',
              backgroundColor: 'rgba(76, 175, 80, 0.2)',
              tension: 0.3,
              pointBackgroundColor: '#4caf50',
              pointBorderColor: '#4caf50',
              pointRadius: 5,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            x: {
              title: {
                display: true,
                text: 'Month',
                color: '#ffffff',
              },
              grid: {
                display: false,
              },
              ticks: {
                color: '#ffffff',
              },
            },
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Spending ($)',
                color: '#ffffff',
              },
              grid: {
                color: 'rgba(255, 255, 255, 0.1)',
              },
              ticks: {
                color: '#ffffff',
              },
            },
          },
          plugins: {
            legend: {
              display: false,
            },
          },
        },
      });
    }
  }, [monthNames]);
  

  // Update the expense breakdown pie chart
  const updateExpenseChart = (data) => {
    if (expenseChartRef.current) {
      if (expenseChartRef.current.chartInstance) {
        expenseChartRef.current.chartInstance.destroy();
      }
      expenseChartRef.current.chartInstance = new Chart(expenseChartRef.current, {
        type: 'pie',
        data: {
          labels: ['Rent', 'Groceries', 'Food & Dining', 'Wi-Fi', 'Electricity', 'Credit Card'],
          datasets: [{ data, backgroundColor: ['#4caf50', '#ff9800', '#e53935', '#3f51b5', '#9c27b0', '#ffc107'] }],
        },
        options: { responsive: true },
      });
    }
  };

  // Update the income vs savings vs expenses pie chart
  const updateIncomeSavingsChart = (income, balance, expenses) => {
    if (incomeSavingsChartRef.current) {
      if (incomeSavingsChartRef.current.chartInstance) {
        incomeSavingsChartRef.current.chartInstance.destroy();
      }
      incomeSavingsChartRef.current.chartInstance = new Chart(incomeSavingsChartRef.current, {
        type: 'pie',
        data: {
          labels: ['Income', 'Savings', 'Expenses'],
          datasets: [{ data: [income, balance, expenses], backgroundColor: ['#3498db', '#2ecc71', '#e74c3c'] }],
        },
        options: { responsive: true },
      });
    }
  };

  // Fetch data and update charts
const fetchUserData = useCallback(async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    setErrorMessage('User is not authenticated. Please log in.');
    setLoading(false);
    return;
  }

  const userId = jwtDecode(token).userId;

  try {
    const response = await axios.get(`http://localhost:5500/api/user-inputs/get-inputs/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.status === 200 && response.data.length > 0) {
      const records = response.data;
      calculateTotals(records); // Calculate totals with fetched data
      updateLineChart(records); // Update line chart with fetched data
    } else {
      setErrorMessage('No records found.');
    }
  } catch (error) {
    console.error('Error fetching user data:', error.message);
    setErrorMessage('Failed to fetch data. Please try again.');
  } finally {
    setLoading(false);
  }
}, [calculateTotals, updateLineChart]);

// Trigger chart updates when records change
useEffect(() => {
  fetchUserData();
}, [fetchUserData, selectedMonth]); 

  const handleFormSubmit = async (e) => {
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

    const records = [
      { title: 'Monthly Income', amount: income, type: 'income', date: new Date(new Date().setMonth(selectedMonth)) },
      { title: 'Rent', amount: rent, type: 'expense', date: new Date(new Date().setMonth(selectedMonth)) },
      { title: 'Groceries', amount: groceries, type: 'expense', date: new Date(new Date().setMonth(selectedMonth)) },
      { title: 'Food & Dining', amount: food, type: 'expense', date: new Date(new Date().setMonth(selectedMonth)) },
      { title: 'Wi-Fi Bill', amount: wifi, type: 'expense', date: new Date(new Date().setMonth(selectedMonth)) },
      { title: 'Electricity Bill', amount: electricity, type: 'expense', date: new Date(new Date().setMonth(selectedMonth)) },
      { title: 'Credit Card Payments', amount: credit, type: 'expense', date: new Date(new Date().setMonth(selectedMonth)) },
    ];

    const token = localStorage.getItem('token');

    if (!token) {
      setErrorMessage('User is not authenticated. Please log in.');
      return;
    }

    const userId = jwtDecode(token).userId;

    try {
      const response = await axios.post(
        'http://localhost:5500/api/user-inputs/save-inputs',
        { userId, records },
        { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }},
      );

      if (response.status === 200) {
        alert('Data saved successfully!');
        await fetchUserData(); // Refresh data
        updateExpenseChart([rent, groceries, food, wifi, electricity, credit]);
        updateIncomeSavingsChart(income, balance, expenses);
      } else {
        throw new Error('Failed to save data');
      }
    } catch (error) {
      console.error('Error saving data:', error.message);
      setErrorMessage('Failed to save data. Please try again.');
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
              <select value={selectedMonth} onChange={(e) => setSelectedMonth(parseInt(e.target.value))}>
                {monthNames.map((month, index) => (
                  <option value={index} key={index}>{month}</option>
                ))}
              </select>
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
              <div className="line-chart">
                <h3>Monthly Spending</h3>
                <canvas ref={lineChartRef}></canvas>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardContent;
