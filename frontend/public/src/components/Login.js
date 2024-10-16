import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); // Hook to navigate to different routes

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Show loading state

    try {
      const response = await axios.post('http://localhost:5500/api/auth/login', {
        email,
        password,
      });

      // Store token in localStorage
      localStorage.setItem('token', response.data.token);

      // Redirect to dashboard on successful login
      navigate('/dashboard'); 
    } catch (error) {
      setLoading(false); // Stop loading
      const message = error.response?.data?.error || 'Login failed. Please try again.';
      setErrorMessage(message); // Show error message
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin}>
        <h2>Login</h2>
        {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Show errors */}
        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;
