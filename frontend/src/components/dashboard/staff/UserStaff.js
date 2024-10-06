import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import AddUser from "../admin/AddUser";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [error, setError] = useState(null);
  const [showAddUserForm, setShowAddUserForm] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8081/userlisting");
      setUsers(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to fetch users. Please try again later.");
    }
  };

  const updateUser = async () => {
    try {
      const {
        username,
        firstname,
        lastname,
        dob,
        email,
        phoneNumber,
        address,
        accountType,
        password,
      } = editUser;
      await axios.put(`http://localhost:8081/updateuser`, {
        username,
        firstname,
        lastname,
        dob,
        email,
        phoneNumber,
        address,
        accountType,
        password,
      });
      setEditUser(null);
      setEditMode(false);
      fetchUsers();
      setError(null);
    } catch (error) {
      console.error("Error updating user:", error);
      setError("Failed to update user. Please try again.");
    }
  };

  const deleteUser = async (username) => {
    const isConfirmed=window.confirm("Are you sure?");
    if (isConfirmed) {
    try {
      await axios.post(`http://localhost:8081/deleteuser`, {
        username: username,
      });
      fetchUsers();
      setError(null);
    } catch (error) {
      console.error("Error deleting user:", error);
      setError("Failed to delete user. Please try again.");
    }
  }
  };

  const handleEditUser = (user) => {
    setEditMode(true);
    setEditUser(user);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditUser(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  return (
    <div className="container">
      <h2>User Management</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <button
        className="btn btn-success mb-3"
        onClick={() => setShowAddUserForm(!showAddUserForm)}
      >
        {showAddUserForm ? "Hide Form" : " Add User"}
      </button>
      {showAddUserForm && <AddUser onUserAdded={fetchUsers} />}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Userid</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Date of Birth</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Address</th>
            <th>Account Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.username}>
              {editUser && editUser.username === user.username && editMode ? (
                <>
                  <td>{user.username}</td>
                  <td>
                    <input
                      type="text"
                      name="firstname"
                      value={editUser.firstname}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="lastname"
                      value={editUser.lastname}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="dob"
                      value={editUser.dob}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="email"
                      value={editUser.email}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="phoneNumber"
                      value={editUser.phoneNumber}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="address"
                      value={editUser.address}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="accountType"
                      value={editUser.accountType}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <button className="btn btn-primary" onClick={updateUser}>
                      Save
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td>{user.username}</td>
                  <td>{user.firstname}</td>
                  <td>{user.lastname}</td>
                  <td>{user.dob}</td>
                  <td>{user.email}</td>
                  <td>{user.phoneNumber}</td>
                  <td>{user.address}</td>
                  <td>{user.accountType}</td>
                  <td>
                    <button
                      className="btn btn-warning"
                      onClick={() => handleEditUser(user)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => deleteUser(user.username)}
                    >
                      Delete
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
