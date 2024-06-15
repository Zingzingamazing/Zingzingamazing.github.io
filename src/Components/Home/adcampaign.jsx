import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './adcampaign.css';

const AdCampaign = () => {
    const [userType, setUserType] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const navigate = useNavigate();

    const handleUserTypeChange = (event) => {
        setUserType(event.target.value);
    };
      


    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('image', image);
        formData.append('userType', userType);

        try {
            await axios.post('http://localhost:3001/ads', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert('Ad submitted for approval!');
        } catch (error) {
            console.error('Error uploading ad:', error);
        }
    };

    const handleLogout = () => {
        navigate('/login'); // Use navigate here
      };
    
    return (
        <div className="ad-campaign-container">
             <div className="menu-bar">
        <div className="logo">Team 007</div>
        <nav className="nav-links">
          <a href="/">Home</a>
          <a href="/">About</a>          
        </nav>
        <div className="user-section">
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
            <h2>Create Ad Campaign</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>
                        Are you a business owner or a public user? 
                        <select value={userType} onChange={handleUserTypeChange}>
                            <option value="">Select</option>
                            <option value="business">Business Owner</option>
                            <option value="public">Public User</option>
                        </select>
                    </label>
                </div>
                <div className="form-group">
                    <label>Title</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Description</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
                </div>
                <div className="form-group">
                    <label>Upload Image</label>
                    <input type="file" onChange={(e) => setImage(e.target.files[0])} required />
                </div>
                <button type="submit">Submit Ad</button>
            </form>
        </div>
    );
};

export default AdCampaign;
