// ProfileDropdown.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProfileDropdown = ({ username }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token or any other auth data
    navigate('/login'); // Redirect to login page
  };

  return (
    <div className="profile-dropdown">
      <div className="profile-icon" onClick={() => setIsOpen(!isOpen)}>
        U {/* Replace 'U' with user's initial or an icon */}
      </div>
      {isOpen && (
        <div className={`dropdown-menu ${isOpen ? 'show' : ''}`}>
          <p>{username}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
