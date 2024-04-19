import React, { useState } from 'react';
// import './ForgetPassword.css';
import axios from 'axios';  

const ForgetPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/forgot-password', { email });
      setMessage(response.data.message);
    }catch (error) {
  if (error.response && error.response.data && error.response.data.error) {
    setMessage(error.response.data.error);
  } else {
    setMessage('Error requesting password reset.');
  }
}

  };

  return (
    <div className='login template d-flex justify-content-center align-items-center vh-100 bg-primary'>
    <div className='form_container p-5 rounded bg-white'> 
      <form onSubmit={handleForgotPassword}>
        <h3 className='text-center'>Forget Password</h3>
        {message && <p className="message">{message}</p>}

        <div className='mb-2'>
          <label htmlFor='email'>Email</label>
          <input 
            type='email' 
            name='email' 
            placeholder='Enter Email' 
            className='form-control' 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>

        <div className='d-grid'>
          <button className='btn btn-primary'>Send Email</button>
        </div>
      </form>
    </div>
  </div>
  );
};

export default ForgetPassword;
