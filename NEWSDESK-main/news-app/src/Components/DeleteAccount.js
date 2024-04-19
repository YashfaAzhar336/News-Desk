// src/components/DeleteAccount.js

import React, { useState } from 'react';
import axios from 'axios';

const DeleteAccount = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('http://localhost:5000/generate-delete-token', { email });
      setMessage(response.data.message);
    }
    catch (error) {
        if (error.response && error.response.data && error.response.data.error) {
          setMessage(error.response.data.error);
        } else {
          setMessage('Error requesting deleting Account.');
        }
    }
  };

  return (
    <div className='login template d-flex justify-content-center align-items-center vh-100 bg-primary'>
    <div className='form_container p-5 rounded bg-white'> 
      <form onSubmit={handleSubmit}>
        <h3 className='text-center'>Delete Account</h3>
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

export default DeleteAccount;
