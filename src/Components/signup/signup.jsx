import React, { useState } from 'react';
import { FaRegUserCircle, FaLock } from "react-icons/fa";
import './signup.css';

const SignUpForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      if (password !== confirmPassword) {
        throw new Error("Passwords do not match");
      }

      const response = await fetch('http://localhost:3001/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      if (response.ok) {
        // handle successful signup
        console.log('Signup successful:', data);
        window.location.href = '/login'; // redirect to login page
      } else {
        setErrorMessage(data.message || 'Error occurred during sign up. Please try again.');
      }
    } catch (error) {
      console.error('Signup Error:', error);
      setErrorMessage(error.message);
    }
  };

  return (
    <div className='wrapper'>
      <form onSubmit={handleSignUp}>
        <h1>Sign Up</h1>
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
            placeholder='Create password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <FaLock className='icon' />
        </div>
        <div className="input-box">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder='Confirm password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <FaLock className='icon' />
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
          <button type="submit">Sign Up</button>
          <div className="register-link"></div>
          <p>Already have an account? <a href="/login">Log in</a></p>
        </div>
      </form>
    </div>
  );
};

export default SignUpForm;
