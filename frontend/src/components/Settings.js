import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token'); // Ensure token is retrieved
  
        // If token is missing, redirect to login
        if (!token) {
          setError('User is not authenticated. Please log in.');
          navigate('/login'); // Redirect to login page
          return;
        }
  
        // Use the full backend URL for the API request
        const response = await axios.get('http://localhost:5500/api/user/settings', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (response.status === 200) {
          setUserData(response.data);
        } else {
          setError('Failed to fetch user data. Please try again.');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        if (error.response && error.response.status === 401) {
          setError('Your session has expired. Please log in again.');
          navigate('/login'); // Redirect to login if token is expired
        } else {
          setError('Failed to fetch user data. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };
  
    fetchUserData();
  }, [navigate]); // Add navigate to dependency array to avoid potential stale closure
  
  return (
    <div className="component-container">
      <h2>Settings</h2>
      {loading ? (
        <p>Loading...</p> // Show loading state
      ) : error ? (
        <p>{error}</p> // Display error message
      ) : userData ? (
        <div>
          <p>First Name: {userData.firstName}</p>
          <p>Last Name: {userData.lastName}</p>
          <p>Email: {userData.email}</p>
          {/* Add other user settings fields here */}
        </div>
      ) : (
        <p>No settings found.</p> // If no user data is found
      )}

      {/* Back button */}
      <div className="back-button-container">
        <button className="back-button" onClick={() => navigate('/dashboard')}>
          Back
        </button>
      </div>
    </div>
  );
};

export default Settings;
