import React from 'react';
import './home.css';

const Home = () => {
  const handleLogout = () => {
    // Redirect to the login page when the logout button is clicked
    window.location.href = "/login";
  };

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
        </div>
        <div>
          {/* Call handleLogout function when the button is clicked */}
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
      <div className="advertisement-list">
        {/* Display list of advertisements/campaigns */}
        {/* Allow user to add new advertisements/campaigns */}
      </div>
    </div>
  );
};

export default Home;
