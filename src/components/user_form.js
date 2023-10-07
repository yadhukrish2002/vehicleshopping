// src/components/LoginForm.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginstatus,setLoginStatus]=useState('');
  const navigate = useNavigate();

  const tosignup = () => {
    navigate('/usersignup');
  };

  const login = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/login', { email, password });
      if (response.status === 200) {
        // Redirect to another page upon successful login
        navigate('/userdashboard');
      } else {
        // Handle login failure
        setLoginStatus('login failed');
        console.error('Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div>
      <h2>User Login</h2>
      <form onSubmit={login}>
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
      <p>{loginstatus}</p>
      <p>
        Don't have an account?
        <button type="button" onClick={tosignup}>
          Signup
        </button>
      </p>
    </div>
  );
}


function SignupForm() {
    const [name,setName]=useState('');
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    const [cPassword,setCPassword]=useState('');
    const [city,setCity]=useState('');
    const [state,setState]=useState('');
    const [country,setCountry]=useState('india');
    const [pinCode,setPincode]=useState('');
    const [phoneNumber, setPhoneNumber] = useState('+91');
    const [verificationCode, setVerificationCode] = useState('');
    const [verificationStatus, setVerificationStatus] = useState('');
    const [isPhoneOTPVisible, setIsPhoneOTPVisible] = useState(false);
    const navigate = useNavigate();
    const tologin=()=>{
      navigate('/userlogin');
    }
    const signup=async(e)=>{
      e.preventDefault();
      // Send a POST request to the server to signup
      axios
        .post('http://localhost:3001/signup', {name,email,password,cPassword,city,state,country,pinCode,phoneNumber})
        .then((response) => {
          if (response.data.success) {
            navigate('/userdashboard');
          } else {
          }
        })
        .catch((error) => {
          console.error('signup error:', error);
        });
    }

    const sendVerificationCode = () => {
      // Send a POST request to the server to request a verification code via Twilio
      axios
        .post('http://localhost:3001/send-verification-code', { phoneNumber })
        .then((response) => {
          if (response.data.success) {
            setVerificationStatus('Verification code sent successfully!');
          } else {
            setVerificationStatus('Failed to send verification code. Please try again.');
          }
        })
        .catch((error) => {
          console.error('Error sending verification code:', error);
          setVerificationStatus('Error sending verification code.');
        });
        setIsPhoneOTPVisible(true);
    };
  
    const verifyPhoneNumber = (e) => {
      e.preventDefault(); // Prevent the default button behavior

  // Send a POST request to the server to verify the phone number using Twilio
  axios
    .post('http://localhost:3001/verify-phone-number', { phoneNumber, verificationCode })
    .then((response) => {
      if (response.data.success) {
        //setphoneGV(true);
        setVerificationStatus('Phone number verified! You are now authenticated.');
      } else {
        setVerificationStatus('Invalid verification code. Please try again.');
      }
    })
    .catch((error) => {
      console.error('Error verifying phone number:', error);
      setVerificationStatus('Error verifying phone number.');
    });
    };
    return (
      <div>
        <h2>User Sign Up</h2>
        <form>
          <label>
            Email:<br /><input type="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
          </label><br />
          <label>
            Password:<br /><input type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
          </label><br />
          <label>
            Confirm Password:<br /><input type="password" value={cPassword} onChange={(e) => setCPassword(e.target.value)}/>
              </label><br />
              <label>
              Name:<br /><input type="text" value={name} onChange={(e) => setName(e.target.value)}/>
              </label><br />
              <label>
              City:<br /><input type="text" value={city} onChange={(e) => setCity(e.target.value)}/>
              </label><br />
              <label>
              State:<br /><input type="text" value={state} onChange={(e) => setState(e.target.value)}/>
              </label><br />
              <label>
              Country:<br /><input type="text" value={country} onChange={(e) => setCountry(e.target.value)}/>
              </label><br />
              <label>
              Pincode:<br /><input type="text" value={pinCode} onChange={(e) => setPincode(e.target.value)} />
              </label><br />
              <label>
              Phone number:<br /><input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
              </label><br />
              {isPhoneOTPVisible ? (
            <div>
            <label>Verification Code:</label><br />
            <input type="text" placeholder='enter code' value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} /><br />
            <button onClick={verifyPhoneNumber}>Verify Phone Number</button>
          </div>
        ) : (
            <button onClick={sendVerificationCode}>Send Verification Code</button>
        )}
        <div>
          <p>{verificationStatus}</p>
        </div>
          <button type="submit" onClick={signup}>Sign Up</button>
        </form>
        <p>
          Already have an account?<button type="button" onClick={tologin}>Login</button>
        </p>
      </div>
    );
}

export { LoginForm, SignupForm };

