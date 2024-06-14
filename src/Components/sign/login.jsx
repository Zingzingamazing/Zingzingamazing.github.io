import React, { useState } from 'react';
import { FaRegUserCircle, FaLock } from "react-icons/fa";
import './login.css';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      if (response.ok) {
        // handle successful login
        console.log('Login successful:', data);
        window.location.href = '/home'; // redirect to home page
      } else {
        setErrorMessage(data.message || 'Incorrect email or password. Please try again.');
      }
    } catch (error) {
      console.error('Login Error:', error);
      setErrorMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className='wrapper'>
      <form onSubmit={handleLogin}>
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
            type={showPassword ? "text" : "password"}
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <FaLock className='icon' />
        </div>
        <div className="show-forgot">
          <label>
            <input
              type="checkbox"
              id="showPasswordCheckbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />
            Show password
          </label>
          <a href="#">Forgot Password? </a>
        </div>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        <div>
          <button type="submit">Login</button>
          <div className="register-link"></div>
          <p>Don't have an account <a href="/signup">Register</a></p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
