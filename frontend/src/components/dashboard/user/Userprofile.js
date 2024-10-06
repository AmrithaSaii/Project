import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form, Table, Container, Alert } from 'react-bootstrap';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    dob: "",
    email: "",
    phoneNumber: "",
    address: "",
    accountType: "",
    password: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("No token found. Please log in.");
      return;
    }

    axios
      .get("http://localhost:8081/hello/userprofile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.success) {
          const userData = res.data.user;
          setUser(userData);
          setFormData({
            firstname: userData.firstname,
            lastname: userData.lastname,
            dob: formatDateForInput(userData.dob),
            email: userData.email,
            phoneNumber: userData.phoneNumber,
            address: userData.address,
            accountType: userData.accountType,
            password: userData.password,
          });
        } else {
          setError("Failed to fetch user profile");
        }
      })
      .catch((err) => {
        console.error("Error fetching user profile:", err);
        setError("An error occurred while fetching the profile");
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    axios
      .put("http://localhost:8081/hello/userprofile", formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.success) {
          setUser((prevUser) => ({ ...prevUser, ...formData }));
          setEditMode(false);
          alert("Profile updated successfully");
        } else {
          setError("Failed to update profile");
        }
      })
      .catch((err) => {
        console.error("Error updating profile:", err);
        setError("An error occurred while updating the profile");
      });
  };

  const formatDateForInput = (dateString) => {
    // Assuming dateString is in dd-mm-yyyy format
    const [day, month, year] = dateString.split("-");
    return `${year}-${month}-${day}`;
  };

  if (error) return <div>{error}</div>;

  return (
    <div className="container userpage">
      <h1>User Profile</h1>
      {user ? (
        <form onSubmit={handleSave}>
          <table className="table table-bordered">
            <tbody>
              <tr>
                <th>Username</th>
                <td>{user.username}</td>
              </tr>
              <tr>
                <th>First Name</th>
                <td>
                  {editMode ? (
                    <input
                      type="text"
                      name="firstname"
                      value={formData.firstname}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  ) : (
                    user.firstname
                  )}
                </td>
              </tr>
              <tr>
                <th>Last Name</th>
                <td>
                  {editMode ? (
                    <input
                      type="text"
                      name="lastname"
                      value={formData.lastname}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  ) : (
                    user.lastname
                  )}
                </td>
              </tr>
              <tr>
                <th>Date of Birth</th>
                <td>
                  {editMode ? (
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  ) : (
                    user.dob
                  )}
                </td>
              </tr>
              <tr>
                <th>Email</th>
                <td>
                  {editMode ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  ) : (
                    user.email
                  )}
                </td>
              </tr>
              <tr>
                <th>Phone Number</th>
                <td>
                  {editMode ? (
                    <input
                      type="text"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  ) : (
                    user.phoneNumber
                  )}
                </td>
              </tr>
              <tr>
                <th>Address</th>
                <td>
                  {editMode ? (
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  ) : (
                    user.address
                  )}
                </td>
              </tr>
              <tr>
                <th>Account Type</th>
                <td>
                  {editMode ? (
                    <select
                      name="accountType"
                      value={formData.accountType}
                      onChange={handleInputChange}
                      className="form-control"
                    >
                      <option value="Savings">Savings</option>
                      <option value="Checking">Checking</option>
                      <option value="Business">Business</option>
                    </select>
                  ) : (
                    user.accountType
                  )}
                </td>
              </tr>
              <tr>
                <th>Password</th>
                <td>
                  {editMode ? (
                    <input
                      type="text" // Display password in plain text while editing
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  ) : (
                    "******" // Display a placeholder text for password when not in edit mode
                  )}
                </td>
              </tr>
            </tbody>
          </table>
          <div className="text-end">
            <button type="button" className="btn btn-primary me-2" onClick={() => setEditMode(!editMode)}>
              {editMode ? "Cancel" : "Edit"}
            </button>
            {editMode && <button type="submit" className="btn btn-success">Save</button>}
          </div>
        </form>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default UserProfile;
