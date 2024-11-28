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
    setCurrentExpenses((prevExpenses) => ({
      ...prevExpenses,
      [category]: parseFloat(value) || 0,
    }));
  };

  const handleSave = () => {
    setMonthlyExpenses((prevExpenses) => ({
      ...prevExpenses,
      [selectedMonth]: { ...currentExpenses },
    }));
  };

  // Prepare data for the line chart
  const incomeData = months.map((month) => monthlyExpenses[month].income);
  const rentData = months.map((month) => monthlyExpenses[month].rent);
  const groceriesData = months.map((month) => monthlyExpenses[month].groceries);
  const foodDiningData = months.map((month) => monthlyExpenses[month].foodDining);
  const wifiData = months.map((month) => monthlyExpenses[month].wifi);
  const electricityData = months.map((month) => monthlyExpenses[month].electricity);

  const data = {
    labels: months,
    datasets: [
      {
        label: 'Income ($)',
        data: incomeData,
        borderColor: 'blue',
        backgroundColor: 'rgba(0, 0, 255, 0.2)',
      },
      {
        label: 'Rent ($)',
        data: rentData,
        borderColor: 'red',
        backgroundColor: 'rgba(255, 0, 0, 0.2)',
      },
      {
        label: 'Groceries ($)',
        data: groceriesData,
        borderColor: 'green',
        backgroundColor: 'rgba(0, 128, 0, 0.2)',
      },
      {
        label: 'Food & Dining ($)',
        data: foodDiningData,
        borderColor: 'orange',
        backgroundColor: 'rgba(255, 165, 0, 0.2)',
      },
      {
        label: 'Wi-Fi Bill ($)',
        data: wifiData,
        borderColor: 'purple',
        backgroundColor: 'rgba(128, 0, 128, 0.2)',
      },
      {
        label: 'Electricity Bill ($)',
        data: electricityData,
        borderColor: 'brown',
        backgroundColor: 'rgba(165, 42, 42, 0.2)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Income & Expenses',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Amount ($)',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Month',
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
          type="number"
          value={currentExpenses.income}
          onChange={(e) => handleExpenseChange('income', e.target.value)}
          placeholder="Monthly Income"
        />

        <label>Rent</label>
        <input
          type="number"
          value={currentExpenses.rent}
          onChange={(e) => handleExpenseChange('rent', e.target.value)}
          placeholder="Rent"
        />

        <label>Groceries</label>
        <input
          type="number"
          value={currentExpenses.groceries}
          onChange={(e) => handleExpenseChange('groceries', e.target.value)}
          placeholder="Groceries"
        />

        <label>Food & Dining</label>
        <input
          type="number"
          value={currentExpenses.foodDining}
          onChange={(e) => handleExpenseChange('foodDining', e.target.value)}
          placeholder="Food & Dining"
        />

        <label>Wi-Fi Bill</label>
        <input
          type="number"
          value={currentExpenses.wifi}
          onChange={(e) => handleExpenseChange('wifi', e.target.value)}
          placeholder="Wi-Fi Bill"
        />

        <label>Electricity Bill</label>
        <input
          type="number"
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