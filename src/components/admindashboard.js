import React from 'react';
import { useNavigate } from 'react-router-dom';
import VehicleList from './vehiclelist';

function AdminDashboard() {
  const navigate = useNavigate();
  const addvehicle=()=>{
    navigate('/addvehicle');
  }
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <button onClick={addvehicle}>add vehicle</button>
      <VehicleList />
    </div>
  );
}

export default AdminDashboard;