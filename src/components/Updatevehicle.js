// UpdateVehicle.js (Create a new component)
import React, { useState } from 'react';


function UpdateVehicle({ vehicle, onClose }) {
  const [updatedData, setUpdatedData] = useState({
    name: vehicle.name,
    description: vehicle.description,
    price:vehicle.price,
    noofvehicle: vehicle.noofvehicle,
  });
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData({ ...updatedData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Send a PUT request to update the vehicle with updatedData
    fetch(`http://localhost:3001/updatevehicle/${vehicle._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    })
      .then(() => {
        // Close the update form and trigger a refresh of the VehicleList component
        onClose();
        window.location.reload();
      })
      .catch((error) => {
        console.error('Error updating vehicle:', error);
      });
  };

  return (
    <div>
      <h3>Update Vehicle</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label><br />
          <input
            type="text"
            name="name"
            value={updatedData.name}
            onChange={handleInputChange}
          /><br />
        </div>
        <div>
          <label>Description:</label><br />
          <input
            type="text"
            name="description"
            value={updatedData.description}
            onChange={handleInputChange}
          /><br />
        </div>
        <div>
          <label>price:</label><br />
          <input
            type="text"
            name="price"
            value={updatedData.price}
            onChange={handleInputChange}
          /><br />
        </div>
        <div>
          <label>Available:</label><br />
          <input
            type="number"
            name="noofvehicle"
            value={updatedData.noofvehicle}
            onChange={handleInputChange}
          /><br />
        </div>
        <button type="submit">Save</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </form>
    </div>
  );
}

export default UpdateVehicle;
