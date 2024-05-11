import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { auth } from '../../firebase.js';
import './signup.css';
import { FaRegUserCircle, FaLock } from "react-icons/fa";

const LogupForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const history = useHistory();

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            if (password !== confirmPassword) {
                throw new Error("Passwords do not match");
            }

            await createUserWithEmailAndPassword(auth, email, password);
            history.push('/login');
        } catch (error) {
            console.error('Signup Error:', error.message);
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

export default LogupForm;
