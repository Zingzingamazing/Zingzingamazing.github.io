import React, { useState } from 'react';
import './adcampaign.css';

const AdCampaign = () => {
  const [userId, setUserId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleAdUpload = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('image', image);

    try {
      const response = await fetch('http://localhost:3001/ads', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (response.ok) {
        // handle successful ad upload
        console.log('Ad uploaded successfully:', data);
        alert('Ad submitted!');
        window.location.href = '/home'; // redirect to home page
      } else {
        setErrorMessage(data.message || 'Error occurred during ad upload. Please try again.');
      }
    } catch (error) {
      console.error('Ad Upload Error:', error);
      setErrorMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className="ad-campaign-container">
      <h2>Create a New Ad Campaign</h2>
      <form onSubmit={handleAdUpload}>
        <div className="form-group">
          <label htmlFor="userId">User ID</label>
          <input
            type="text"
            id="userId"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="image">Image</label>
          <input
            type="file"
            id="image"
            onChange={(e) => setImage(e.target.files[0])}
            required
          />
        </div>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AdCampaign;
