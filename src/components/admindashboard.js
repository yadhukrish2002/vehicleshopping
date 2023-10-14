import React from 'react';
import { useNavigate } from 'react-router-dom';
import VehicleList from './vehiclelist';
import './home.css';

function AdminDashboard() {
  const navigate = useNavigate();
  const addvehicle=()=>{
    navigate('/addvehicle');
  }
  const adminprofile=()=>{
    navigate('/adminprofile');
  }
  return (
    <div>
      <lebel>Admin Dashboard</lebel>
      <button onClick={adminprofile}>Admin profile</button>
      <button onClick={addvehicle}>add vehicle</button>
      <VehicleList />
    </div>
  );
}

export default AdminDashboard;