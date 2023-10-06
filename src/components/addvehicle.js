import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
function AddVehicle() {
  const [vname, setVName] = useState('');
  const [vdescription, setVDescription] = useState('');
  const [vimage, setVImage] = useState(null); // Use null to represent the file
  const [noofvehicle, setNoofVehicle] = useState('');

  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setVImage(e.target.files[0]);
  };

  const AddVehicle = async () => {
    try {
      const formData = new FormData();
      formData.append('vname', vname);
      formData.append('vdescription', vdescription);
      formData.append('vimage', vimage);
      formData.append('vunits', noofvehicle);

      const response = await fetch('http://localhost:3001/addvehicle', {
        method: 'POST',
        body: formData,
      });

      if (response.status === 200) {
        alert('Vehicle added successfully');
        // Clear the form fields after successful addition
        setVName('');
        setVDescription('');
        setVImage(null);
        setNoofVehicle('');
        navigate('/admindashboard');
      } else {
        console.error('Failed to add vehicle');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <div className="vehicle-form">
        <h3>Add Vehicle</h3>
        <input
          type="text"
          name="name"
          placeholder="Vehicle Name"
          value={vname}
          onChange={(e) => setVName(e.target.value)}
        />
        <input
          type="text"
          name="description"
          placeholder="Vehicle Description"
          value={vdescription}
          onChange={(e) => setVDescription(e.target.value)}
        />
        <input
          type="file"
          name="image"
          onChange={handleFileChange} // Use onChange to capture the file
        />
        <input
          type="number"
          name="no of vehicles"
          placeholder="Available vehicle"
          value={noofvehicle}
          onChange={(e) => setNoofVehicle(e.target.value)}
        />
        <button onClick={AddVehicle}>Add Vehicle</button>
      </div>
    </div>
  );
}

export default AddVehicle;
