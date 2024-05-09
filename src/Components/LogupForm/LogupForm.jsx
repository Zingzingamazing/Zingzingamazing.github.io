import React from 'react'
import './LogupForm.css';
import { FaRegUserCircle, } from "react-icons/fa";
import { FaLock } from "react-icons/fa";

const LogupForm = () => {
    return (
        <div className='wrapper'>
    <form action="">
            <h1>Log Up</h1>
            <div className="input-box">
                 <input type="text" placeholder='Full Name' required />
                 <FaRegUserCircle className='icon' />
                </div>
                <div className="input-box">
                 <input type="text" placeholder='Email' required />
                 <FaRegUserCircle className='icon' />
                </div>
              <div className="input-box">
                 <input type="password" placeholder='Password' required />
                 <FaLock className='icon'/>

                 <button type="submit">Log up</button>
                  <div className="register-link"></div>
                    <p>Already have account <a href="#">Log in</a></p>
            </div>
    
    </form>
        </div>

  )
}
export default LogupForm