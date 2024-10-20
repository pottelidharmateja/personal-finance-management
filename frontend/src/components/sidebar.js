import { Link } from 'react-router-dom';
import './sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <Link to="/dashboard" className="sidebar-link">Dashboard</Link>
      <Link to="/transactions" className="sidebar-link">Transactions</Link>
      <Link to="/cash-flow" className="sidebar-link">Cash Flow</Link>
      <Link to="/investments" className="sidebar-link">Investments</Link>
      <Link to="/categories" className="sidebar-link">Categories</Link>
      <Link to="/settings" className="sidebar-link">Settings</Link>
    </div>
  );
};

export default Sidebar;
