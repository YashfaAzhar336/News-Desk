import axios from 'axios';
import { useState  } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const { token } = useParams(); // Use useParams to get the token parameter
  const [newPassword, setNewPassword] = useState(''); 
  const history = useNavigate ();

  const handleChange = (e) => {
    const { value } = e.target;
    setNewPassword(value); // Update state with the typed password
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      // Send newPassword as expected by the server
      const response = await axios.post(`http://localhost:5000/reset-password/${token}`, { newPassword });
      alert(response.data.message); 
      history('/');
      // Display the server's success message
      // Redirect user to login page or another appropriate page if necessary
    } catch (error) {
      // Display the specific error message from the server if available
      if (error.response && error.response.data) {
        alert(error.response.data.error);
      } else {
        alert('Error updating password.'); // Fallback generic error
      }
    }
  };

  return (
    <div className='login template d-flex justify-content-center align-items-center vh-100 bg-primary'>
    <div className='form_container p-5 rounded bg-white'> 
      <form onSubmit={handleResetPassword}>
        <h3 className='text-center'>Reset Password</h3>

        <div className='mb-2'>
          <label htmlFor='email' mb-2>Enter New Password</label>
          <input 
            name='newPassword' // Change name to 'newPassword' to match server expectation
            type="password" 
            placeholder="Enter new password"
            className='form-control' 
            value={newPassword} // Bind value to state
           onChange={handleChange}
            required 
          />
        </div>

        <div className='d-grid'>
          <button className='btn btn-primary'>Change Password</button>
        </div>
      </form>
    </div>
  </div>
  );
};

export default ResetPassword;
