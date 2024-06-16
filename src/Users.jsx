import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import './Users.css';

const Users = () => {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();
    const { isAdmin } = useContext(AuthContext);

    useEffect(() => {
        if (!isAdmin) {
            navigate('/admin/login');
            return;
        }

        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:3001/users', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error.response?.data || error.message);
            }
        };

        fetchUsers();
    }, [isAdmin, navigate]);

    const handleDelete = async (userId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:3001/users/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setUsers(users.filter(user => user.id !== userId));
        } catch (error) {
            console.error('Error deleting user:', error.response?.data || error.message);
        }
    };

    if (!isAdmin) return null;

    return (
        <div className="users-container">
            <h2>Manage Users</h2>
            <button onClick={() => navigate('/admin')}>Back to Admin Panel</button>
            <table>
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>
                                <button onClick={() => handleDelete(user.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Users;
