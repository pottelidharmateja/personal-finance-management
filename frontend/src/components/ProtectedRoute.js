import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token'); // Check if token exists in local storage

  if (!isAuthenticated) {
    return <Navigate to="/login" />; // Redirect to login page if not authenticated
  }

  return children; // Render the requested page if authenticated
};

export default ProtectedRoute;