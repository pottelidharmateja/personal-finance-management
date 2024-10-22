import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './sidebar';
import DashboardContent from './DashboardContent';
import Transactions from './Transactions';
import CashFlow from './CashFlow';
import Investments from './Investments';
import Categories from './Categories';
import Settings from './Settings';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <Sidebar /> {/* Sidebar should be here */}
      <div className="content">
        {/* Routes for different dashboard components */}
        <Routes>
          <Route path="/" element={<DashboardContent />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/cash-flow" element={<CashFlow />} />
          <Route path="/investments" element={<Investments />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
