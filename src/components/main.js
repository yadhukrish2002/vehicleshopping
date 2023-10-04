import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from "./home";
import LoginForm from "./user_form";
import Adminlogin from "./admin_login";

function Main(){
    return(
        <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/userlogin" element={<LoginForm />} />
        <Route path="/adminlogin" element={<Adminlogin />} />
      </Routes>
    </Router>
    );
}
export default Main;