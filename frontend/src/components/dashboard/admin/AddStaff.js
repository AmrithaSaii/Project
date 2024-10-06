import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const AddStaff = ({ onStaffAdded }) => {
  const [newStaff, setNewStaff] = useState({
    username: "",
    password: "",
    designation: "",
    branch: "", // New branch field
  });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null); // State for success message

  const validateForm = () => {
    const { username, password, designation, branch } = newStaff;

    if (!username || !password || !designation || !branch) {
      return "All fields are required.";
    }
    if (username.length < 5) {
      return "Username must be at least 5 characters long.";
    }
    if (password.length < 6) {
      return "Password must be at least 6 characters long.";
    }
    if (designation.length < 3) {
      return "Designation must be at least 3 characters long.";
    }
    if (branch.length < 3) {
      return "Branch must be at least 3 characters long.";
    }
    return null;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStaff((prevStaff) => ({
      ...prevStaff,
      [name]: value,
    }));
  };

  const addStaff = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setSuccessMessage(null);
      return;
    }

    try {
      const response = await axios.post("http://localhost:8081/addstaff", newStaff);
      if (response.status === 201) {
         // Successfully added staff
         setSuccessMessage("Staff added successfully."); // Set success message
         setError(null);
         setNewStaff({
           username: "",
           password: "",
           designation: "",
           branch: "", // Clear branch field after success
         });
         onStaffAdded(); // Notify parent component to refresh staff list
       } else {
         // Response status is not 201
         setError("Failed to add staff. Please try again.");
         setSuccessMessage(null);
       }
     } catch (error) {
       // Error during the request
       console.error("Error adding staff:", error);
       const errorMessage = error.response?.data?.message || "Failed to add staff. Please try again.";
       setError(errorMessage);
       setSuccessMessage(null);
     }
   };

  return (
    <div className="mb-3">
      {error && <div className="alert alert-danger">{typeof error === 'string' ? error : "An unknown error occurred"}</div>}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      <div className="form-group">
        <label>Staff ID</label>
        <input
          type="text"
          name="username"
          className="form-control"
          value={newStaff.username}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          name="password"
          className="form-control"
          value={newStaff.password}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <label>Designation</label>
        <input
          type="text"
          name="designation"
          className="form-control"
          value={newStaff.designation}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <label>Branch</label>
        <input
          type="text"
          name="branch"
          className="form-control"
          value={newStaff.branch}
          onChange={handleInputChange}
        />
      </div>
      <button className="btn btn-primary mt-2" onClick={addStaff}>
        Add Staff
      </button>
    </div>
  );
};

export default AddStaff;
