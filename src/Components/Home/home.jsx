import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './home.css';

const Home = () => {
  const [ads, setAds] = useState([]);
  const navigate = useNavigate(); // Add this line

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await fetch('http://localhost:3001/ads');
        const data = await response.json();
        
        if (Array.isArray(data)) {
          setAds(data);
        } else {
          console.error('Fetched data is not an array:', data);
          setAds([]);
        }
      } catch (error) {
        console.error('Error fetching ads:', error);
        setAds([]);
      }
    };

    fetchAds();
  }, []);

  const handleLogout = () => {
    navigate('/login'); // Use navigate here
  };

  return (
    <div className="dashboard-container">
      <div className="menu-bar">
        <div className="logo">Team 007</div>
        <nav className="nav-links">
          <a href="/">Home</a>
          <a href="/">About</a>
          <a href="/adcampaign">Add Your Campaign</a>
          
        </nav>
        <div className="user-section">
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
      <div className="advertisement-list">
        {ads.map((ad) => (
          <div className="advertisement-card" key={ad.id}>
            <div
              className="advertisement-image"
              style={{ backgroundImage: `url(http://localhost:3001${ad.image_url})` }}
            ></div>
            <div className="card-content">
              <div className="advertisement-title">{ad.title}</div>
              <div className="advertisement-description">{ad.description}</div>
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
