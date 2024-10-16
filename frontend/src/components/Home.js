import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');  // Navigate to Login Page
  };

  const handleSignup = () => {
    navigate('/signup'); // Navigate to Signup Page
  };

  return (
    <div className="home-container">
      <h1>Welcome to Personal Finance Management</h1>
      <p>Manage your expenses and savings with ease!</p>
      <div className="button-group">
        <button onClick={handleLogin} className="btn login-btn">Login</button>
        <button onClick={handleSignup} className="btn signup-btn">Signup</button>
      </div>
    </div>
  );
};

export default Home;
