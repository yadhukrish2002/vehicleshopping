import React, { useState, useEffect } from 'react';
import UpdateVehicle from './Updatevehicle';
import './home.css'
function VehicleList() {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  const handleSortOrderChange = (e) => {
    setSortOrder(e.target.value);
  };
  // Function to filter and sort vehicles based on the search query and sorting order
  const filteredAndSortedVehicles = vehicles
    .filter((vehicle) => {
      const regex = new RegExp(searchQuery, 'i'); // 'i' for case-insensitive search
      return regex.test(vehicle.name);
    })
    .sort((a, b) => {
      const priceA = a.price;
      const priceB = b.price;

      if (sortOrder === 'asc') {
        return priceA - priceB;
      } else if (sortOrder === 'desc') {
        return priceB - priceA;
      } else {
        return 0;
      }
    });

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
      <div>
        <input
          className='field'
          type="text"
          placeholder="Search by vehicle name"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <select value={sortOrder} onChange={handleSortOrderChange} className='field'>
          <option value="asc">Sort by Price (Low to High)</option>
          <option value="desc">Sort by Price (High to Low)</option>
        </select>
        </div>
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
          {filteredAndSortedVehicles.map((vehicle) => (
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
