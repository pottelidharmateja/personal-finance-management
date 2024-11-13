import React from 'react';
import { useNavigate } from 'react-router-dom';

const Investments = () => {
  const navigate = useNavigate();

  return (
    <div className="component-container">
      <h2>Investments</h2>
      <p>This section will display investment details.</p>
      {/* Back button moved to the bottom */}
      <div className="back-button-container">
        <button className="back-button" onClick={() => navigate('/dashboard')}>
          Back
        </button>
      </div>
    </div>
  );
};

export default Investments;