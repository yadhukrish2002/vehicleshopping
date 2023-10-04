// src/components/LoginForm.js
import React, { useState } from 'react';
import axios from 'axios';


function LoginForm() {
    const [isLogin, setIsLogin] = useState(true);
    const [name,setName]=useState('');
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    const [cPassword,setCPassword]=useState('');
    const [city,setCity]=useState('');
    const [state,setState]=useState('');
    const [country,setCountry]=useState('');
    const [pinCode,setPincode]=useState('');
    const [phoneNumber, setPhoneNumber] = useState('+91');
    const [verificationCode, setVerificationCode] = useState('');
    const [verificationStatus, setVerificationStatus] = useState('');
    const [isPhoneOTPVisible, setIsPhoneOTPVisible] = useState(false);

    const verify=()=>{
      if(isLogin){
        login()
      }
      else{
        signup()
      }
    }

    const login=()=>{
      // Send a POST request to the server to login
      axios
        .post('http://localhost:3001/login', {email,password})
        .then((response) => {
          if (response.data.success) {
            
          } else {
            
          }
        })
        .catch((error) => {
          console.error('login error:', error);
        });
    }
    const signup=()=>{
      // Send a POST request to the server to signup
      axios
        .post('http://localhost:3001/signup', {name,email,password,cPassword,city,state,country,pinCode,phoneNumber})
        .then((response) => {
          if (response.data.success) {
            
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
  
    const verifyPhoneNumber = () => {
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

    const toggleForm = () => {
      setIsLogin(!isLogin);
    };
  
    return (
      <div>
        <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
        <form>
          {/* Common form elements like username, password, etc. */}
          <label>
            Email:<br /><input type="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
          </label><br />
          <label>
            Password:<br /><input type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
          </label><br />
  
          {/* Render additional sign-up fields if it's a sign-up form */}
          {!isLogin && (
            <>
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
            </>
          )}
  
          <button type="submit" onClick={verify}>{isLogin ? 'Login' : 'Sign Up'}</button>
        </form>
  
        <p>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button type="button" onClick={toggleForm}>
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
    );
}

export default LoginForm;


