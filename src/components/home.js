import React from "react";
import { useNavigate } from 'react-router-dom';
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
            <button onClick={userlogin}>userlogin</button>
            <button onClick={adminlogin}>adminlogin</button>
        </>
    );
}
export default Home;