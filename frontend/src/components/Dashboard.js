import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './sidebar';
import DashboardContent from './DashboardContent';
import Transactions from './Transactions';
import CashFlow from './CashFlow';
import Investments from './Investments';
import Categories from './Categories';
import Settings from './Settings';
import ProfileDropdown from './ProfileDropdown';
import './Dashboard.css';
import './ProfileDropdown.css';

const Dashboard = () => {
  // Retrieve the user's name from localStorage for display in ProfileDropdown
  const userName = localStorage.getItem('userName') || "User's Name"; // Fallback to "User's Name" if not available

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="top-bar">
        <ProfileDropdown username={userName} /> {/* Pass the actual username */}
      </div>
      <div className="content">
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
