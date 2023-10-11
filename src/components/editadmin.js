import React, { useState } from "react";

function EditProfile({ Admin, onClose }) {
  const [updatedData, setUpdatedData] = useState({
    name: Admin.name,
    email: Admin.email,
    password: Admin.password,
  });
  const [profilePhoto, setProfilePhoto] = useState(Admin.photo);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData({ ...updatedData, [name]: value });
  };

  const handlePhotoChange = (e) => {
    setProfilePhoto(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Create a FormData object to send the file and other data
    const formData = new FormData();
    formData.append("name", updatedData.name);
    formData.append("email", updatedData.email);
    formData.append("password", updatedData.password);
    formData.append("photo", profilePhoto);

    // Send a PUT request with the FormData
    fetch(`http://localhost:3001/editprofile/${Admin._id}`, {
      method: "PUT",
      body: formData,
    })
      .then(() => {
        // Close the update form and trigger a refresh of the VehicleList component
        onClose();
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
      });
  };

  return (
    <div>
      <h3>Edit profile</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <br />
          <input
            type="text"
            name="name"
            value={updatedData.name}
            onChange={handleInputChange}
          />
          <br />
        </div>
        <div>
          <label>Email:</label>
          <br />
          <input
            type="text"
            name="email"
            value={updatedData.email}
            onChange={handleInputChange}
          />
          <br />
        </div>
        <div>
          <label>Profile Photo:</label>
          <br />
          <input type="file" name="photo" onChange={handlePhotoChange} />
          <br />
          {profilePhoto && (
            <img
              src={profilePhoto}
              alt="Profile"
              style={{ maxWidth: "200px" }}
            />
          )}
        </div>
        <div>
          <label>Change Password:</label>
          <br />
          <input
            type="text"
            name="password"
            value={updatedData.password}
            onChange={handleInputChange}
          />
          <br />
        </div>
        <button type="submit">Save</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </form>
    </div>
  );
}

export default EditProfile;
