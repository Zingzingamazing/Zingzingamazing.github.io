import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom'; // Import useHistory hook
import { auth } from '../firebase.js'; // Import Firebase auth
import './LogupForm.css';
import { FaRegUserCircle } from "react-icons/fa";
import { FaLock } from "react-icons/fa";


const LogupForm = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const history = useHistory(); // Initialize useHistory hook


    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            // Create user with email and password
            console.log(auth, email, password);
            const result = await createUserWithEmailAndPassword(auth, email, password);
            // User signed up successfully, navigate to dashboard or desired page
            history.push('./login');
        } catch (error) {
            console.log("err", error);
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
                        type="text"
                        placeholder='Full Name'
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                    />
                    <FaRegUserCircle className='icon' />
                </div>
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
                        type="password"
                        placeholder='Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <FaLock className='icon' />
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
