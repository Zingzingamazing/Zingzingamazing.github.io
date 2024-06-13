import React from 'react';
import './home.css';

const Home = () => {
  const handleLogout = () => {
    window.location.href = "/login";
  };

  return (
    <div className="dashboard-container">
      <div className="menu-bar">
        <div className="logo">Team 007</div>
        <nav className="nav-links">
          <a href="/">Home</a>
          <a href="/">About</a>
          
          <a href="/adcampaign">Add Campaign</a>
        </nav>
        <div className="user-section">
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
      <div className="advertisement-list">
        {Array.from({ length: 12 }).map((_, index) => (
          <div className="advertisement-card" key={index}>
            <div className="placeholder-image"></div>
            <div className="card-content">
              <div className="text">LOOKING FOR A......</div>
              <div className="text">LOOKING FOR A......</div>
            </div>
            <div className="card-footer">
              <span className="dot"></span>
              <span className="likes">68</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
