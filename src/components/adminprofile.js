import React, { useEffect,useState} from "react";
import './profile.css'

function AdminProfile(){
    const [admins, setAdmin] = useState([]);
    //const [selectedAdmin, setSelectedAdmin] = useState(null);
  
    useEffect(() => {
      // Fetch admins from the backend when the component mounts
      fetch('http://localhost:3001/admins')
        .then((response) => response.json())
        .then((data) => {
          setAdmin(data);
        })
        .catch((error) => {
          console.error('Error fetching vehicles:', error);
        });
    }, []);
    
   // const updateVehicle = (vehicle) => {
      // Set the selected vehicle for updating
      //setSelectedAdmin(vehicle);
   // };
  
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
                    <lebel>{Admin.name}</lebel>
                </div>
                ))}
                {/*selectedAdmin && (
                <UpdateAdmin
                Admin={selectedVehicle}
                onClose={() => setSelectedAdmin(null)}
                />
                )*/}
            </div>
        </div>
    );
}
export default AdminProfile;