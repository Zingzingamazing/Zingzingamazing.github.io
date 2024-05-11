// Dashboard.js
import React from 'react';
import './home.css';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <div className="menu-bar">
        {/* Your menu items here */}
        <div className="search-bar">
          <input type="text" placeholder="Search..." />
          <button>Search</button>
        </div>
        <div className="user-icon">
          <img src="user-icon.png" alt="User Icon" />
          <div className="user-dropdown">
            <button>Logout</button>
          </div>
        </div>
      </div>
      <div className="advertisement-list">
        {/* Display list of advertisements/campaigns */}
        {/* Allow user to add new advertisements/campaigns */}
      </div>
    </div>
  );
};

export default Dashboard;
