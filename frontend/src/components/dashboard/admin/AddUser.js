import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const AddUser = ({ onUserAdded }) => {
  const [newUser, setNewUser] = useState({
    username: "",
    firstname: "",
    lastname: "",
    dob: "",
    email: "",
    phoneNumber: "",
    address: "",
    accountType: "",
    password: "",
  });
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const usernameRegex = /^#user\d{5}$/;
    if (!usernameRegex.test(newUser.username)) {
      setError("Username must start with #user followed by 5 digits.");
      return false;
    }
    if (newUser.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return false;
    }
    return true;
  };

  const checkUsernameAvailability = async () => {
    try {
      const response = await axios.post("http://localhost:8081/checkusername", {
        username: newUser.username,
      });
      return response.data.available;
    } catch (error) {
      console.error("Error checking username availability:", error);
      setError("Failed to check username availability. Please try again.");
      return false;
    }
  };

  const addUser = async () => {
    if (!validateForm()) return;

    const isUsernameAvailable = await checkUsernameAvailability();
    if (!isUsernameAvailable) {
      setError("Username already taken.");
      return;
    }

    try {
      await axios.post("http://localhost:8081/adduser", newUser);
      onUserAdded();
      setError(null);
      setNewUser({
        username: "",
        firstname: "",
        lastname: "",
        dob: "",
        email: "",
        phoneNumber: "",
        address: "",
        accountType: "",
        password: "",
      });
    } catch (error) {
      console.error("Error adding user:", error);
      setError("Failed to add user. Please try again.");
    }
  };

  return (
    <div className="mb-3">
      <h3>Add User</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="form-group">
        <label>Username</label>
        <input
          type="text"
          name="username"
          className="form-control"
          value={newUser.username}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <label>First Name</label>
        <input
          type="text"
          name="firstname"
          className="form-control"
          value={newUser.firstname}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <label>Last Name</label>
        <input
          type="text"
          name="lastname"
          className="form-control"
          value={newUser.lastname}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <label>Date of Birth</label>
        <input
          type="text"
          name="dob"
          className="form-control"
          value={newUser.dob}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          name="email"
          className="form-control"
          value={newUser.email}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <label>Phone Number</label>
        <input
          type="text"
          name="phoneNumber"
          className="form-control"
          value={newUser.phoneNumber}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <label>Address</label>
        <input
          type="text"
          name="address"
          className="form-control"
          value={newUser.address}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <label>Account Type</label>
        <input
          type="text"
          name="accountType"
          className="form-control"
          value={newUser.accountType}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          name="password"
          className="form-control"
          value={newUser.password}
          onChange={handleInputChange}
        />
      </div>
      <button className="btn btn-primary mt-2" onClick={addUser}>
        Add User
      </button>
    </div>
  );
};

export default AddUser;
