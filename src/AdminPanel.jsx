// AdminPanel.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './AdminPanel.css';

const AdminPanel = ({ isAdmin }) => {
  const [ads, setAds] = useState([]);
  const navigate = useNavigate();

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
        console.error('Error fetching ads:', error);
      }
    };

    fetchAds();
  }, [isAdmin, navigate]);

  const handleApprove = async (adId) => {
    try {
      await axios.post(`http://localhost:3001/ads/approve/${adId}`);
      setAds(ads.filter(ad => ad.id !== adId));
    } catch (error) {
      console.error('Error approving ad:', error);
    }
  };

  const handleReject = async (adId) => {
    try {
      await axios.post(`http://localhost:3001/ads/reject/${adId}`);
      setAds(ads.filter(ad => ad.id !== adId));
    } catch (error) {
      console.error('Error rejecting ad:', error);
    }
  };

  return (
    <div className="admin-panel-container">
      <h2>Admin Panel</h2>
      <Link to="/users">Manage Users</Link>
      <ul>
        {ads.map((ad) => (
          <li key={ad.id}>
            <h3>{ad.title}</h3>
            <p>{ad.description}</p>
            <p><strong>Publisher:</strong> {ad.publisher}</p>
            <img src={ad.imageUrl} alt={ad.title} style={{ width: '100px' }} />
            <button onClick={() => handleApprove(ad.id)}>Approve</button>
            <button onClick={() => handleReject(ad.id)}>Reject</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPanel;
