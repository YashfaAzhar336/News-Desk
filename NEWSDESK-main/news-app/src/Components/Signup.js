import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate  } from 'react-router-dom';

export default function Signup() {
  const [signupData, setSignupData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPswd: '',
  });

  const history = useNavigate ();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignupData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (signupData.password !== signupData.confirmPswd) {
      alert('Passwords do not match!');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/signup', signupData);
      alert(response.data.message);
      history('/');
    } catch (error) {
      if (error.response && error.response.data) {
        alert(error.response.data.error);
      } else {
        alert('Error signing up');
      }
    }
  };

  return (
    <div className='login template d-flex justify-content-center align-items-center 100-w vh-100 bg-primary'>
      <div className='40-w p-5 rounded bg-white'> 
        <form onSubmit={handleSignup}>
          <h3 className='text-center'>Sign Up</h3>

          <div className='mb-2'>
            <label htmlFor='firstName'>First Name</label>
            <input 
              type='text' 
              name='firstName' 
              placeholder='Enter First Name' 
              className='form-control' 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className='mb-2'>
            <label htmlFor='lastName'>Last Name</label>
            <input 
              type='text' 
              name='lastName' 
              placeholder='Enter Last Name' 
              className='form-control' 
              onChange={handleChange} 
              required 
            />
          </div>

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

          <div className='mb-2'>
            <label htmlFor='confirmPswd'>Confirm Password</label>
            <input 
              type='password' 
              name='confirmPswd' 
              placeholder='Enter confirm password' 
              className='form-control' 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className='d-grid'>
            <button className='btn btn-primary'>Sign Up</button>
          </div>

          <p className='text-right'>
            Already Have an Account?
            <Link className='ms-2' to='/'>Sign In</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
