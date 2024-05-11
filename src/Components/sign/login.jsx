import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword } from "firebase/auth";
import './login.css';
import { FaRegUserCircle, FaLock } from "react-icons/fa";

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (userCredential.user) {
        history.push('/home');
        window.location.href = window.location.href;
      }
    } catch (error) {
      console.error('Login Error:', error.message);
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
            type={showPassword ? "text" : "password"}
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <FaLock className='icon'/>
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
