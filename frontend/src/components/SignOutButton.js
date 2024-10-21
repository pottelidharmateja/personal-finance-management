import React from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom'; // Import useLocation

const SignOutButton = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // Get current location

  const handleSignOut = () => {
    // Clear any stored tokens
    localStorage.removeItem('token'); // Adjust according to your token key
    logout(); // Update authentication state
    navigate('/'); // Redirect to the home page
  };

  // Hide the button on Home, Login, and Signup pages
  const hiddenRoutes = ['/', '/login', '/signup'];
  if (hiddenRoutes.includes(location.pathname)) {
    return null; // Do not render the button
  }

  return (
    <button onClick={handleSignOut} className="signout-button">
      Sign Out
    </button>
  );
};

export default SignOutButton;
