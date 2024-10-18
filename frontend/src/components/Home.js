import React, { useState } from 'react';
import Signup from './Signup';
import Login from './Login';
import './Home.css'; // Ensure CSS is imported

const Home = () => {
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const handleClose = () => {
    setIsSignupOpen(false);
    setIsLoginOpen(false);
  };

  return (
    <div className="home-container">
      <h1>Welcome to Personal Finance Management</h1>
      <p>Manage your finances with ease. Get started by logging in or signing up!</p>

      <div className="button-group">
        <button className="home-button" onClick={() => setIsSignupOpen(true)}>
          Signup
        </button>
        <button className="home-button" onClick={() => setIsLoginOpen(true)}>
          Login
        </button>
      </div>

      {/* Signup Modal */}
      {isSignupOpen && (
        <div className="modal">
          <div className="modal-content">
            <button className="close-button" onClick={handleClose}>
              &times;
            </button>
            <Signup />
          </div>
        </div>
      )}

      {/* Login Modal */}
      {isLoginOpen && (
        <div className="modal">
          <div className="modal-content">
            <button className="close-button" onClick={handleClose}>
              &times;
            </button>
            <Login />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
