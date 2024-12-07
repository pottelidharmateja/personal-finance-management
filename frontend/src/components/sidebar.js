import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faExchangeAlt, faChartLine, faPiggyBank, faTags, faCog, faClipboard, faChartPie } from '@fortawesome/free-solid-svg-icons'; // Added faChartPie for Spending Prediction
import './sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="logo">My Finance</div>
      <nav className="nav">
        <li><Link to="/" className="nav-link"><FontAwesomeIcon icon={faTachometerAlt} /> Dashboard</Link></li>
        <li><Link to="/transactions" className="nav-link"><FontAwesomeIcon icon={faExchangeAlt} /> Transactions</Link></li>
        <li><Link to="/cash-flow" className="nav-link"><FontAwesomeIcon icon={faChartLine} /> Cash Flow</Link></li>
        <li><Link to="/investments" className="nav-link"><FontAwesomeIcon icon={faPiggyBank} /> Investments</Link></li>
        <li><Link to="/categories" className="nav-link"><FontAwesomeIcon icon={faTags} /> Categories</Link></li>
        <li><Link to="/settings" className="nav-link"><FontAwesomeIcon icon={faCog} /> Settings</Link></li>
        <li><Link to="/categorizer" className="nav-link"><FontAwesomeIcon icon={faClipboard} /> Categorizer</Link></li>
        <li><Link to="/spending-prediction" className="nav-link"><FontAwesomeIcon icon={faChartPie} /> Spending Prediction</Link></li> {/* Added Spending Prediction */}
      </nav>
    </div>
  );
};

export default Sidebar;
