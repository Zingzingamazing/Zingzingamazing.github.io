import React from 'react'
import './LogupForm.css';
import { FaRegUserCircle, } from "react-icons/fa";
import { FaLock } from "react-icons/fa";

const LoginForm = () => {
  return (
    <div className='wrapper'>
<form action="">
    <h1>Log Up</h1>
    <div className='input-box'>
        <input type="text" placeholder='Username' required />
        <FaRegUserCircle className='icon' />
    </div>
    <div className='input-box'>
        <input type="text" placeholder='Email' required />
        <FaRegUserCircle className='icon' />
    </div>
    <div className='input-box'>
        <input type="password" placeholder='Password' required />
        <FaLock className='icon'/>
    </div>
    <div className='remember-forgot'>
<label><input type="checkbox" />Remember me</label>
<a href="#"> Forgot Password? </a>
    </div>
    <div>
        <button type='submit'>Login</button>

        <div className='register-link'></div>
        <p>Dont have account <a href="#">Register</a></p>
    </div>

</form>

    </div>
  )
}

export default LoginForm