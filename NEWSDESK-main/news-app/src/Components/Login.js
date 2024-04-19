import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prevState => ({ ...prevState, [name]: value }));
  };
  const history = useNavigate ();


  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', loginData);
      
      // Store JWT token in localStorage
      localStorage.setItem('jwtToken', response.data.token);
      console.log(response.data.token);
      alert(response.data.message); // Display server message
      history('/science');
      
    } catch (error) {
      if (error.response && error.response.data) {
        alert(error.response.data.error); // Display server error message
      } else {
        alert('Error logging in'); // Fallback generic error
      }
    }
  };
  
    
  return (
    <div className='login template d-flex justify-content-center align-items-center vh-100 bg-primary'>
      <div className='form_container p-5 rounded bg-white'> 
        <form onSubmit={handleLogin}>
          <h3 className='text-center'>Sign In</h3>

          <div className='mb-2'>
            <label htmlFor='email'>Email</label>
            <input 
              type='email' 
              name='email' 
              placeholder='Enter Email' 
              className='form-control' 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className='mb-2'>
            <label htmlFor='password'>Password</label>
            <input 
              type='password' 
              name='password' 
              placeholder='Enter password' 
              className='form-control' 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className='d-grid'>
            <button className='btn btn-primary'>Sign In</button>
          </div>

          <p className='text-right'>Forgot <Link to='/forget-password'>Password?</Link> or <Link to='/signup'>Sign Up</Link></p>
        </form>
      </div>
    </div>
  );
}