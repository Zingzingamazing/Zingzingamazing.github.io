import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import './AdminPanel.css';

const AdminPanel = () => {
  const [ads, setAds] = useState([]);
  const navigate = useNavigate();
  const { isAdmin } = useContext(AuthContext);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin/login');
      return;
    }

    const fetchAds = async () => {
      try {
        const response = await axios.get('http://localhost:3001/ads/pending');
        setAds(response.data);
      } catch (error) {
        console.error('Error fetching ads:', error.response?.data || error.message);
      }
    };

    fetchAds();
  }, [isAdmin, navigate]);

  const handleApprove = async (adId) => {
    try {
      await axios.post(`http://localhost:3001/ads/approve/${adId}`);
      setAds(ads.filter(ad => ad.id !== adId));
    } catch (error) {
      console.error('Error approving ad:', error.response?.data || error.message);
    }
  };

  const handleReject = async (adId) => {
    try {
      await axios.post(`http://localhost:3001/ads/reject/${adId}`);
      setAds(ads.filter(ad => ad.id !== adId));
    } catch (error) {
      console.error('Error rejecting ad:', error.response?.data || error.message);
    }
  };
  const handleUsersHomeClick = () => {
      navigate('/home');
  };

  const handleManageUsersClick = () => {
    if (isAdmin) {
      navigate('/users');
    } else {
      navigate('/admin/login');
    }
  };
  
  return (
    <div className="admin-panel-container">
      <h2>Admin Panel</h2>
      <button onClick={handleUsersHomeClick} className="manage-users-link">Go back to home page</button>
      <button onClick={handleManageUsersClick} className="manage-users-link">Manage Users</button>
      <ul className="ads-list">
        {ads.map((ad) => (
          <li key={ad.id} className="ad-item">
            <div className="ad-details">
              <img src={ad.image_url} alt={ad.title} className="ad-image" />
              <div>
                <h3>{ad.title}</h3>
                <p>{ad.description}</p>
                <p><strong>Publisher:</strong> {ad.publisher}</p>
              </div>
            </div>
            <div className="ad-actions">
              <button onClick={() => handleApprove(ad.id)} className="approve-button">Approve</button>
              <button onClick={() => handleReject(ad.id)} className="reject-button">Reject</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPanel;
