import React, { useState, useEffect } from 'react';
import UpdateVehicle from './Updatevehicle';
function VehicleList() {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  useEffect(() => {
    // Fetch vehicles from the backend when the component mounts
    fetch('http://localhost:3001/vehicles')
      .then((response) => response.json())
      .then((data) => {
        setVehicles(data);
      })
      .catch((error) => {
        console.error('Error fetching vehicles:', error);
      });
  }, []);
  const deleteVehicle = (id) => {
    // Make an API call to delete the vehicle by ID
    fetch(`http://localhost:3001/deletevehicle/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        // Remove the deleted vehicle from the state
        setVehicles((prevVehicles) => prevVehicles.filter((vehicle) => vehicle._id !== id));
      })
      .catch((error) => {
        console.error('Error deleting vehicle:', error);
      });
  };
  const updateVehicle = (vehicle) => {
    // Set the selected vehicle for updating
    setSelectedVehicle(vehicle);
  };

  return (
    <div>
      <h3>Vehicle List</h3>
      <table border='1'>
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>price</th>
            <th>Description</th>
            <th>Available</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map((vehicle) => (
            <tr key={vehicle._id}>
              <td>
                {vehicle.image && (
                  <img src={`http://localhost:3001/image/${vehicle.image}`} 
                  alt={`${vehicle.name}`}
                  style={{ Width: '100px' }} />
                )}
              </td>
              <td>{vehicle.name}</td>
              <td>{vehicle.price}</td>
              <td>{vehicle.description}</td>
              <td>{vehicle.noofvehicle}</td>
              <td>
                <button onClick={() => deleteVehicle(vehicle._id)}>Delete</button>
              </td>
              <td>
              <button onClick={() => updateVehicle(vehicle)}>Update</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedVehicle && (
        <UpdateVehicle
          vehicle={selectedVehicle}
          onClose={() => setSelectedVehicle(null)}
        />
      )}
    </div>
  );
}

export default VehicleList;
