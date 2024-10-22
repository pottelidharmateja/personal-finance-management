import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(''); // Reset error message

    try {
      // Send login request to the backend
      const response = await axios.post('http://localhost:5500/api/auth/login', { email, password });

      // Store the token in local storage upon successful login
      localStorage.setItem('token', response.data.token);

      // Redirect to the dashboard
      navigate('/dashboard');
    } catch (error) {
      // Stop loading and display error message
      setLoading(false);
      setErrorMessage(error.response?.data?.error || 'Login failed. Please try again.');
    }
  };

  // Navigate to signup page
  const goToSignup = () => {
    navigate('/signup');
  };

  return (
    <div
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL}/images/login-bg.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center right',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        style={{
          backdropFilter: 'blur(8px)',
          padding: '30px',
          borderRadius: '10px',
          maxWidth: '400px',
          width: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
        }}
      >
        <img
          src={`${process.env.PUBLIC_URL}/images/login.png`}
          alt="Login Logo"
          style={{ width: '70px', height: 'auto', marginBottom: '20px' }}
        />
        <h3 className="mb-4" style={{ color: '#333', fontWeight: 'bold' }}>Login</h3>

        {/* Display error message */}
        {errorMessage && (
          <div className="alert alert-danger" style={{ width: '100%', marginBottom: '15px' }}>
            {errorMessage}
          </div>
        )}

        {/* Login form */}
        <form onSubmit={handleLogin} style={{ width: '100%' }}>
          <div className="form-group mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ padding: '12px', borderRadius: '5px' }}
            />
          </div>
          <div className="form-group mb-4">
            <input
              type="password"
              className="form-control"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ padding: '12px', borderRadius: '5px' }}
            />
          </div>
          <button
            type="submit"
            className="btn btn-warning btn-block mb-3"
            disabled={loading}
            style={{ fontWeight: 'bold', width: '100%', padding: '12px', fontSize: '1.1rem' }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Back button */}
        <button
          type="button"
          className="btn btn-outline-dark"
          onClick={goToSignup}
          style={{ width: '100%', padding: '10px', marginTop: '10px', fontSize: '1rem' }}
        >
          Back
        </button>

        {/* Signup button */}
        <button
          type="button"
          className="btn btn-info mt-3"
          onClick={goToSignup}
          style={{ width: '100%', padding: '10px', fontSize: '1rem', fontWeight: 'bold', color: 'white' }}
        >
          Signup
        </button>
      </div>
    </div>
  );
};

export default Login;
