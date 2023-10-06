import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from "./home";
import { LoginForm, SignupForm } from "./user_form";
import Adminlogin from "./admin_login";
import UserDashBoard from "./userdashboard";
import AdminDashBoard from "./admindashboard";
import AddVehicle from "./addvehicle";

function Main() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/userlogin" element={<LoginForm />} />
        <Route path="/usersignup" element={<SignupForm />} />
        <Route path="/adminlogin" element={<Adminlogin />} />
        <Route path="/userdashboard" element={<UserDashBoard />} />
        <Route path="/admindashboard" element={<AdminDashBoard />} />
        <Route path="/addvehicle" element={<AddVehicle />} />
      </Routes>
    </Router>
  );
}

export default Main;
