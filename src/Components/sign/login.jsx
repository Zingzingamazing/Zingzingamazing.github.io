import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRegUserCircle, FaLock } from "react-icons/fa";
import { AuthContext } from '../../AuthContext'; // Adjust the path as needed
import './login.css';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.status === 401) {
        setErrorMessage('Invalid email or password');
        return;
      } else if (!response.ok) {
        setErrorMessage(data.message || 'Error occurred during login. Please try again.');
        return;
      }

      // Save the user data in context
      login(data);  // Pass the entire data object to login

      // Redirect to home page after successful login
      navigate('/home');  // Corrected the variable name
    } catch (error) {
      console.error('Login Error:', error);
      setErrorMessage('Incorrect email or password. Please try again.');
    }
  };

  return (
    <div className='wrapper'>
      <form onSubmit={handleSubmit}>
        <h1>Login</h1>
        <div className="input-box">
          <input
            type="email"
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <FaRegUserCircle className='icon' />
        </div>
        <div className="input-box">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <FaLock className='icon'/>
        </div>
        <div className="show-password-checkbox">
          <input
            type="checkbox"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
          />
          <label>Show Password</label>
        </div>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        <div>
          <button type="submit">Login</button>
          <div className="register-link"></div>
          <p>Don't have an account? <a href="/signup">Sign up</a></p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
