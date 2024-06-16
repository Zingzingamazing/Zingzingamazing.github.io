import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './home.css';
import { AuthContext } from '../../AuthContext'; // Adjust the path as needed

const Home = () => {
  const [ads, setAds] = useState([]);
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await fetch('http://localhost:3001/ads?status=approved');
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
    logout();
    navigate('/signin');
  };

  return (
    <div className="dashboard-container">
      <div className="menu-bar">
        <div className="logo">Team 007</div>
        <nav className="nav-links">
          <a href="/home">Home</a>
          <a href="/home">About</a>
          <a href="/adcampaign">Add Your Campaign</a>
        </nav>
        <div className="user-section">
          <span className="username">{user?.username}</span>
          <button className="button" onClick={handleLogout}>Logout</button>
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
              <div className="advertisement-publisher"><strong>Publisher:</strong> {ad.publisher}</div>
            </div>
            <div className="card-footer">
              <span className="dot"></span>
              <span className="likes"></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
