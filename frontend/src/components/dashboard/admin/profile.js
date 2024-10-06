import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const AdminProfile = () => {
  const [adminProfile, setAdminProfile] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showPassword, setShowPassword] = useState(false); // State variable for password visibility

  useEffect(() => {
    fetchAdminProfile();
  }, []);

  const fetchAdminProfile = async () => {
    try {
      const response = await axios.get("http://localhost:8081/admin/profile"); // Adjust endpoint if necessary
      setAdminProfile(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching admin profile:", error);
      setError("Failed to fetch admin profile. Please try again later.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAdminProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleSaveProfile = async () => {
    try {
      await axios.put(
        "http://localhost:8081/admin/updateprofile",
        adminProfile
      ); // Adjust endpoint if necessary
      setSuccess("Profile updated successfully.");
      setError(null);
    } catch (error) {
      console.error("Error updating admin profile:", error);
      setError("Failed to update profile. Please try again.");
      setSuccess(null);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="container mt-5">
      <h2>Edit Admin Profile</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <div className="card">
        <div className="card-body">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              className="form-control"
              id="username"
              name="username"
              value={adminProfile.username}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                id="password"
                name="password"
                value={adminProfile.password}
                onChange={handleInputChange}
              />
              <div className="input-group-append">
                <span className="input-group-text">
                  {showPassword ? (
                    <VisibilityOff onClick={togglePasswordVisibility} />
                  ) : (
                    <Visibility onClick={togglePasswordVisibility} />
                  )}
                </span>
              </div>
            </div>
          </div>
          <button className="btn btn-primary" onClick={handleSaveProfile}>
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
