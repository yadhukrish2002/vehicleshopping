import React, { useState, useEffect } from 'react';
import './vehiclelist.css';
function UserDashBoard(){
    const [vehicles, setVehicles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('asc'); // Default sorting order is ascending

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

    return (
        <div>
          <h3>Vehicle List</h3>
          <div>
        <input
          type="text"
          placeholder="Search by vehicle name"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <select value={sortOrder} onChange={handleSortOrderChange}>
          <option value="asc">Sort by Price (Low to High)</option>
          <option value="desc">Sort by Price (High to Low)</option>
        </select>
        </div>
          <table>
            <tbody>
              {filteredAndSortedVehicles.map((vehicle) => (
                <tr key={vehicle._id}>
                  <td width='40%'>
                    {vehicle.image && (
                      <img src={`http://localhost:3001/image/${vehicle.image}`} 
                      alt={`${vehicle.name}`}
                      style={{ Width: '250px',height:'250px' }} />
                    )}
                  </td>
                  <td width='60%'>
                    <b>{vehicle.name}</b><br />
                    price<b>{vehicle.price}/-</b><br />
                    {vehicle.description}<br />
                    Available{vehicle.noofvehicle}<br />
                    <button >book</button><br />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
}

export default UserDashBoard;