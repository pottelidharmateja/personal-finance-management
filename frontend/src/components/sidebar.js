import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faExchangeAlt, faChartLine, faPiggyBank, faTags, faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import './sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();

  // Handle logout logic
  const handleLogout = () => {
    // Clear user session data
    localStorage.removeItem('userToken'); // Example key, modify as needed
    // Redirect to login page
    navigate('/login');
  };

  return (
    <div className="sidebar">
      <Link to="/dashboard" className="sidebar-link">
        <FontAwesomeIcon icon={faTachometerAlt} /> Dashboard
      </Link>
      <Link to="/transactions" className="sidebar-link">
        <FontAwesomeIcon icon={faExchangeAlt} /> Transactions
      </Link>
      <Link to="/cash-flow" className="sidebar-link">
        <FontAwesomeIcon icon={faChartLine} /> Cash Flow
      </Link>
      <Link to="/investments" className="sidebar-link">
        <FontAwesomeIcon icon={faPiggyBank} /> Investments
      </Link>
      <Link to="/categories" className="sidebar-link">
        <FontAwesomeIcon icon={faTags} /> Categories
      </Link>
      <Link to="/settings" className="sidebar-link">
        <FontAwesomeIcon icon={faCog} /> Settings
      </Link>

      {/* Logout Button */}
      <button className="sidebar-link logout-button" onClick={handleLogout}>
        <FontAwesomeIcon icon={faSignOutAlt} /> Logout
      </button>
    </div>
  );
};

export default Sidebar;
