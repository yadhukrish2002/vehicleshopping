import React, { useEffect, useState } from "react";
import './profile.css'
import EditProfile from "./editadmin";

function AdminProfile() {
  const [admins, setAdmin] = useState([]);
  const [isEditVisible, setEditVisible] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  useEffect(() => {
    // Fetch admins from the backend when the component mounts
    fetch('http://localhost:3001/admins')
      .then((response) => response.json())
      .then((data) => {
        setAdmin(data);
      })
      .catch((error) => {
        console.error('Error fetching admins:', error);
      });
  }, []);

  const updateprofile = (Admin) => {
    // Set the selected admin for updating
    setEditVisible(true);
    setSelectedAdmin(Admin);
  };

  return (
    <div align='center'>
      <div className="body">
        {admins.map((Admin) => (
          <div key={Admin._id}>
            <div>
              {Admin.photo && (
                <img src={`http://localhost:3001/image/${Admin.photo}`}
                     alt={`${Admin.name}`}
                />
              )}
            </div>
            <label>{Admin.name}</label><br /><br /><br />
            <button onClick={() => updateprofile(Admin)}>Edit profile</button>
          </div>
        ))}
      </div>
      <div>
        {isEditVisible && selectedAdmin && (
          <EditProfile Admin={selectedAdmin} onClose={() => setSelectedAdmin(null)} />
        )}
      </div>
    </div>
  );
}

export default AdminProfile;
