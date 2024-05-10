import React, { useState } from 'react';
import { useHistory } from 'react-router-dom'; // Import useHistory hook
import { auth } from '../firebase'; // Import Firebase auth
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import './LoginForm.css';
import { FaRegUserCircle } from "react-icons/fa";
import { FaLock } from "react-icons/fa";

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const history = useHistory(); // Initialize useHistory hook

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // User logged in successfully, navigate to dashboard or desired page
      history.push('https://www.youtube.com/watch?v=pkJ95d_j0TA');
    } catch (error) {
      console.error('Login Error:', error.message);
    }
  };

  return (
    <div className='wrapper'>
      <form onSubmit={handleSubmit}>
        <h1>Login</h1>
        <div className="input-box">
          <input
            type="text"
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <FaRegUserCircle className='icon' />
        </div>
        <div className="input-box">
          <input
            type="password"
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <FaLock className='icon'/>
        </div>
        <div className="remember-forgot">
          <label>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            Remember me
          </label>
          <a href="#"> Forgot Password? </a>
        </div>
        <div>
          <button type="submit">Login</button>
          <div className="register-link"></div>
          <p>Don't have an account <a href="/logup">Register</a></p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
