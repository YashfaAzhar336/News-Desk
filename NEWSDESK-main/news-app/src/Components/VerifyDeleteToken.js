// src/components/VerifyDeleteToken.js

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';


const VerifyDeleteToken = () => {
  const { token } = useParams();
  const [message, setMessage] = useState('');
  const navigate =useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/delete-account/${token}`);
        setMessage(response.data.message);
      } catch (error) {
        setMessage('Account Deleted Thanks.');
        navigate('/');
      }
    };

    verifyToken();
  }, [token, navigate]);

  return (
    <div>
      <h2>Verifying Account Deletion</h2>
      <p>{message}</p>
    </div>
  );
};

export default VerifyDeleteToken;
