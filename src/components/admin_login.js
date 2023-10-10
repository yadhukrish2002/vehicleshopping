import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Adminlogin() {
    const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminloginstatus,setAdminLoginStatus]=useState('');
  const navigate = useNavigate();

  const Alogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/adminlogin', { email, password });
      if (response.status === 200) {
        // Redirect to another page upon successful login
        navigate('/admindashboard');
      } else {
        // Handle login failure
        console.error('adminLogin failed');
        setAdminLoginStatus('admin login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };
  
    return (
        <div className='container'>
      <h2>Admin Login</h2>
      <form onSubmit={Alogin}>
        <label>
          Email:<br />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <br />
        <label>
          Password:<br />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <br />
        <button type="submit">Login</button>
      </form>
      <p>{adminloginstatus}</p>
    </div>
    );
}
export default Adminlogin