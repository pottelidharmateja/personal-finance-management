import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // Handle signup form submission
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    // Validate passwords match
    if (password !== confirmPassword) {
      setLoading(false);
      setErrorMessage('Passwords do not match.');
      return;
    }

    try {
      // Send signup request to the backend
      await axios.post('http://localhost:5500/api/auth/signup', { email, password });

      // Display success message and redirect to login
      alert('Signup successful! Please log in.');
      navigate('/login');
    } catch (error) {
      // Stop loading and display error message
      setLoading(false);
      const message = error.response?.data?.error || 'Signup failed. Please try again.';
      setErrorMessage(message);
    }
  };

  // Navigate to the homepage
  const goToHome = () => {
    navigate('/');
  };

  return (
    <div
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL}/images/signup-bg.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        flexDirection: 'column',
      }}
    >
      <img
        src={`${process.env.PUBLIC_URL}/images/account.png`}
        alt="Signup Logo"
        style={{ width: '120px', height: 'auto', marginBottom: '20px' }}
      />
      <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', width: '300px' }}>
        {errorMessage && <p className="error-message" style={{ color: 'red' }}>{errorMessage}</p>}
        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: '10px', fontSize: '1rem', width: '100%' }}
        />
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: '10px', fontSize: '1rem', width: '100%' }}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          style={{ padding: '10px', fontSize: '1rem', width: '100%' }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '10px 20px',
            fontSize: '1rem',
            fontWeight: 'bold',
            backgroundColor: '#e67e22',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            marginTop: '10px',
          }}
        >
          {loading ? 'Signing up...' : 'Signup'}
        </button>
      </form>
      <button
        type="button"
        onClick={goToHome}  // Navigate to homepage
        className="btn btn-light"
        style={{ padding: '10px 20px', fontSize: '1rem', marginTop: '20px', borderRadius: '5px' }}
      >
        Back
      </button>
    </div>
  );
};

export default Signup;
