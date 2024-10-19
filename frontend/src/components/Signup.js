import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Signup.css'; // Import Signup.css

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); // Hook to navigate

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true); // Show loading state

    // Check if passwords match
    if (password !== confirmPassword) {
      setLoading(false);
      setErrorMessage('Passwords do not match.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5500/api/auth/signup', {
        email,
        password,
        confirmPassword,
      });

      alert(response.data.message);
      navigate('/login'); // Redirect to login after signup
    } catch (error) {
      setLoading(false); // Stop loading
      const message = error.response?.data?.error || 'Signup failed. Please try again.';
      setErrorMessage(message); // Show error message
    }
  };

  return (
    <div className="signup-container">
      <form onSubmit={handleSignup}>
        <h2>Signup</h2>
        {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Show error message */}
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
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Signing up...' : 'Signup'}
        </button>
      </form>
    </div>
  );
};

export default Signup;
