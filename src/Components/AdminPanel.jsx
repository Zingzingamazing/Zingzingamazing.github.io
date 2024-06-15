import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './admin.css';

const AdminPanel = () => {
    const [ads, setAds] = useState([]);

    useEffect(() => {
        const fetchAds = async () => {
            try {
                const response = await axios.get('/ads/pending');
                setAds(response.data);
            } catch (error) {
                console.error('Error fetching ads:', error);
            }
        };
        fetchAds();
    }, []);

    const handleApprove = async (adId) => {
        try {
            await axios.post(`/ads/approve/${adId}`);
            setAds(ads.filter(ad => ad.id !== adId));
        } catch (error) {
            console.error('Error approving ad:', error);
        }
    };

    return (
        <div className="admin-panel-container">
            <h2>Admin Panel</h2>
            <ul>
                {ads.map((ad) => (
                    <li key={ad.id}>
                        <h3>{ad.title}</h3>
                        <p>{ad.description}</p>
                        <img src={ad.imageUrl} alt={ad.title} style={{ width: '100px' }} />
                        <button onClick={() => handleApprove(ad.id)}>Approve</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminPanel;
