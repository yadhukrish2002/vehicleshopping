import React from "react";
import { useNavigate } from 'react-router-dom';
import './home.css';
function Home(){
    const navigate = useNavigate();

    const userlogin= ()=>{
        navigate('/userlogin');
    }
    const adminlogin= ()=>{
        navigate('/adminlogin');
    }


    return(
        <>
            <lebel>vehicles</lebel>
            <button onClick={userlogin}>userlogin</button>
            <button onClick={adminlogin}>adminlogin</button>
            <h1>SELECT YOUR OWN VEHICLE</h1>
            <p>Choose your own vehicle for better experence</p>

        </>
    );
}
export default Home;