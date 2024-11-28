import React, { useState } from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import { useNavigate } from 'react-router-dom';
import './Categories.css'; 

const CategoriesPieChart = () => {
  const navigate = useNavigate();
  const [groceries, setGroceries] = useState(100);
  const [foodDrink, setFoodDrink] = useState(200);
  const [shopping, setShopping] = useState(150);
  const [entertainment, setEntertainment] = useState(300);
  const [rent, setRent] = useState(800);
  const [electricityBill, setElectricityBill] = useState(100);
  const [wifiBill, setWifiBill] = useState(50);

  const data = [
    { name: '🛒 Groceries', value: groceries },
    { name: '🍽️ Food & Drink', value: foodDrink },
    { name: '🏠 Rent', value: rent },
    { name: '⚡ Electricity Bill', value: electricityBill },
    { name: '📶 Wi-Fi Bill', value: wifiBill },
    { name: '🛍️ Shopping', value: shopping },
    { name: '🎨 Entertainment', value: entertainment },
  ];

  const COLORS = ['#2196F3', '#4CAF50', '#9B59B6', '#F1C40F', '#7F8C8D', '#E53935', '#FF9800'];

  return (
    <div className="chart-container">
      <div className="input-container">
        <div className="input-column">
          <label>
            🛒 Groceries:
            <input
              type="number"
              value={groceries}
              onChange={(e) => setGroceries(Number(e.target.value))}
            />
          </label>
          <label>
            🍽️ Food & Drink:
            <input
              type="number"
              value={foodDrink}
              onChange={(e) => setFoodDrink(Number(e.target.value))}
            />
          </label>
          <label>
            🏠 Rent:
            <input
              type="number"
              value={rent}
              onChange={(e) => setRent(Number(e.target.value))}
            />
          </label>
        </div>
        <div className="input-column">
          <label>
            ⚡ Electricity Bill:
            <input
              type="number"
              value={electricityBill}
              onChange={(e) => setElectricityBill(Number(e.target.value))}
            />
          </label>
          <label>
            📶 Wi-Fi Bill:
            <input
              type="number"
              value={wifiBill}
              onChange={(e) => setWifiBill(Number(e.target.value))}
            />
          </label>
          <label>
            🛍️ Shopping:
            <input
              type="number"
              value={shopping}
              onChange={(e) => setShopping(Number(e.target.value))}
            />
          </label>
          <label>
            🎨 Entertainment:
            <input
              type="number"
              value={entertainment}
              onChange={(e) => setEntertainment(Number(e.target.value))}
            />
          </label>
        </div>
      </div>
      <PieChart width={400} height={400} className="pie-chart">
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={150}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Legend layout="horizontal" align="center" verticalAlign="bottom" />
        <Tooltip />
      </PieChart>
      <div className="back-button-container">
        <button className="back-button" onClick={() => navigate('/dashboard')}>
          Back
        </button>
      </div>
    </div>
  );
};

export default CategoriesPieChart;

