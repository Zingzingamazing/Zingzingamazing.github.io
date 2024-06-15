// Users.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Users = ({ isAdmin }) => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin/login');
      return;
    }

    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:3001/users');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [isAdmin, navigate]);

  return (
    <div>
      <h2>All Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.username} - {user.email} {/* Adjust the fields based on your user data */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Users;
