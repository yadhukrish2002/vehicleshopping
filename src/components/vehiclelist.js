import React, { useState, useEffect } from 'react';

function VehicleList() {
  const [vehicles, setVehicles] = useState([]);

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

  return (
    <div>
      <h3>Vehicle List</h3>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Image</th>
            <th>Available</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map((vehicle) => (
            <tr key={vehicle._id}>
              <td>{vehicle.name}</td>
              <td>{vehicle.description}</td>
              <td>
                {vehicle.image && (
                  <img src={`http://localhost:3001/${vehicle.image}`} alt={vehicle.name} width="100" />
                )}
              </td>
              <td>{vehicle.noofvehicle}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default VehicleList;
