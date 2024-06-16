import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import './AdminLogin.css';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { loginAdmin } = useContext(AuthContext);

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:3001/admin/login', { email, password });
            if (response.status === 200) {
                loginAdmin(response.data.token);
                navigate('/admin');
            } else {
                alert('Invalid credentials');
            }
        } catch (error) {
            console.error('Error logging in:', error.response?.data || error.message);
            alert(`Error logging in: ${error.response?.data?.message || error.message}`);
        }
    };

    return (
        <div className="login-container">
            <h2>Admin Login</h2>
            <input 
                type="text" 
                placeholder="Email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
            />
            <input 
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
            />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
};

export default AdminLogin;
