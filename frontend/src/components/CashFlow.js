import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './Cashflow.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Function to initialize all months with default values for each category
const initializeMonthlyExpenses = () => {
  const defaultCategories = { income: 0, rent: 0, groceries: 0, foodDining: 0, wifi: 0, electricity: 0 };
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const expenses = {};
  months.forEach(month => {
    expenses[month] = { ...defaultCategories };
  });
  return expenses;
};

const CashFlow = () => {
  const navigate = useNavigate();

  // Initialize state with default values for each month and category
  const [selectedMonth, setSelectedMonth] = useState('Jan');
  const [monthlyExpenses, setMonthlyExpenses] = useState(initializeMonthlyExpenses());
  const [currentExpenses, setCurrentExpenses] = useState({ ...monthlyExpenses[selectedMonth] });

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const handleMonthChange = (event) => {
    const month = event.target.value;
    setSelectedMonth(month);
    setCurrentExpenses({ ...monthlyExpenses[month] });
  };

  const handleExpenseChange = (category, value) => {
    // Remove leading zeros by converting to an empty string if '0' is entered or preserving non-zero values
    const numericValue = value === '' ? '' : parseFloat(value).toString();
    setCurrentExpenses((prevExpenses) => ({
      ...prevExpenses,
      [category]: numericValue,
    }));
  };

  const handleSave = () => {
    setMonthlyExpenses((prevExpenses) => ({
      ...prevExpenses,
      [selectedMonth]: { ...currentExpenses },
    }));
  };

  // Prepare data for the line chart
  const incomeData = months.map((month) => monthlyExpenses[month].income || 0);
  const rentData = months.map((month) => monthlyExpenses[month].rent || 0);
  const groceriesData = months.map((month) => monthlyExpenses[month].groceries || 0);
  const foodDiningData = months.map((month) => monthlyExpenses[month].foodDining || 0);
  const wifiData = months.map((month) => monthlyExpenses[month].wifi || 0);
  const electricityData = months.map((month) => monthlyExpenses[month].electricity || 0);

  const data = {
    labels: months,
    datasets: [
      {
        label: 'Income ($)',
        data: incomeData,
        borderColor: '#4A90E2',
        backgroundColor: 'rgba(74, 144, 226, 0.2)',
      },
      {
        label: 'Rent ($)',
        data: rentData,
        borderColor: '#E74C3C',
        backgroundColor: 'rgba(231, 76, 60, 0.2)',
      },
      {
        label: 'Groceries ($)',
        data: groceriesData,
        borderColor: '#2ECC71',
        backgroundColor: 'rgba(46, 204, 113, 0.2)',
      },
      {
        label: 'Food & Dining ($)',
        data: foodDiningData,
        borderColor: '#F39C12',
        backgroundColor: 'rgba(243, 156, 18, 0.2)',
      },
      {
        label: 'Wi-Fi Bill ($)',
        data: wifiData,
        borderColor: '#9B59B6',
        backgroundColor: 'rgba(155, 89, 182, 0.2)',
      },
      {
        label: 'Electricity Bill ($)',
        data: electricityData,
        borderColor: '#34495E',
        backgroundColor: 'rgba(52, 73, 94, 0.2)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 14,
          },
          color: '#ffffff',
        },
      },
      title: {
        display: true,
        text: 'Monthly Income & Expenses',
        font: {
          size: 20,
        },
        color: '#f39c12',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Amount ($)',
          font: {
            size: 16,
          },
          color: '#ffffff',
        },
        ticks: {
          color: '#ffffff',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Month',
          font: {
            size: 16,
          },
          color: '#ffffff',
        },
        ticks: {
          color: '#ffffff',
        },
      },
    },
  };

  return (
    <div className="component-container">
      <h2>Enter Your Monthly Income & Expenses</h2>
      
      {/* Month Selector */}
      <div className="month-selector">
        <label>Select Month: </label>
        <select value={selectedMonth} onChange={handleMonthChange}>
          {months.map((month) => (
            <option key={month} value={month}>{month}</option>
          ))}
        </select>
      </div>

      {/* Expense Inputs for the Selected Month */}
      <div className="expense-inputs">
        <label>Monthly Income</label>
        <input
          type="text"
          value={currentExpenses.income}
          onChange={(e) => handleExpenseChange('income', e.target.value)}
          placeholder="Monthly Income"
        />

        <label>Rent</label>
        <input
          type="text"
          value={currentExpenses.rent}
          onChange={(e) => handleExpenseChange('rent', e.target.value)}
          placeholder="Rent"
        />

        <label>Groceries</label>
        <input
          type="text"
          value={currentExpenses.groceries}
          onChange={(e) => handleExpenseChange('groceries', e.target.value)}
          placeholder="Groceries"
        />

        <label>Food & Dining</label>
        <input
          type="text"
          value={currentExpenses.foodDining}
          onChange={(e) => handleExpenseChange('foodDining', e.target.value)}
          placeholder="Food & Dining"
        />

        <label>Wi-Fi Bill</label>
        <input
          type="text"
          value={currentExpenses.wifi}
          onChange={(e) => handleExpenseChange('wifi', e.target.value)}
          placeholder="Wi-Fi Bill"
        />

        <label>Electricity Bill</label>
        <input
          type="text"
          value={currentExpenses.electricity}
          onChange={(e) => handleExpenseChange('electricity', e.target.value)}
          placeholder="Electricity Bill"
        />
      </div>

      {/* Save Button */}
      <div className="save-button-container">
        <button className="save-button" onClick={handleSave}>
          Save
        </button>
      </div>

      {/* Line Chart */}
      <div className="chart-container">
        <Line data={data} options={options} />
      </div>

      {/* Back Button */}
      <div className="back-button-container">
        <button className="back-button" onClick={() => navigate('/dashboard')}>
          Back
        </button>
      </div>
    </div>
  );
};

export default CashFlow;
