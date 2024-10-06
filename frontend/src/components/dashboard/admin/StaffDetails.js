import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import AddStaff from './AddStaff';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

const StaffManagement = () => {
  const [staff, setStaff] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editStaff, setEditStaff] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null); // Success message state
  const [showAddUserForm, setShowAddUserForm] = useState(false);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const response = await axios.get('http://localhost:8081/stafflisting');
      setStaff(response.data);
      setError(null);
      setSuccessMessage(null); // Clear success message when fetching staff
    } catch (error) {
      console.error('Error fetching staff:', error);
      setError('Failed to fetch staff. Please try again later.');
    }
  };

  const updateStaff = async () => {
    if (!editStaff) return;
    try {
      const { username, password, designation, branch } = editStaff; // Include branch
      const response = await axios.put('http://localhost:8081/updatestaff', {
        username,
        password,
        designation,
        branch, // Include branch in the update request
      });
      if (response.status === 200) {
        setEditStaff(null);
        setEditMode(false);
        fetchStaff(); // Refresh staff list
        setSuccessMessage('Staff updated successfully.'); // Set success message
        setError(null);
      } else {
        setError('Failed to update staff. Please try again.');
        setSuccessMessage(null); // Clear success message if update fails
      }
    } catch (error) {
      console.error('Error updating staff:', error);
      setError('Failed to update staff. Please try again.');
      setSuccessMessage(null); // Clear success message if an error occurs
    }
  };

  const deleteStaff = async (username) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this staff member?');
    if (isConfirmed) {
      try {
        const response = await axios.delete('http://localhost:8081/deletestaff', {
          data: { username },
        });
        if (response.status === 200) {
          fetchStaff(); // Refresh staff list
          setSuccessMessage('Staff deleted successfully.'); // Set success message
        } else {
          setError('Failed to delete staff. Please try again.');
          setSuccessMessage(null); // Clear success message if deletion fails
        }
      } catch (error) {
        console.error('Error deleting staff:', error);
        setError('Failed to delete staff. Please try again.');
        setSuccessMessage(null); // Clear success message if an error occurs
      }
    }
  };

  const handleEditStaff = (staffMember) => {
    setEditMode(true);
    setEditStaff({ ...staffMember });
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditStaff(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditStaff((prevStaff) => ({
      ...prevStaff,
      [name]: value,
    }));
  };

  const handleCloseAlert = () => {
    setSuccessMessage(null);
  };

  return (
    <div className="container">
      <h2>Staff Management</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <Snackbar open={!!successMessage} autoHideDuration={6000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity="success">
          {successMessage}
        </Alert>
      </Snackbar>
      <button
        className="btn btn-success mb-3"
        onClick={() => setShowAddUserForm(!showAddUserForm)}
      >
        {showAddUserForm ? "Hide Form" : "Add Staff"}
      </button>
      {showAddUserForm && <AddStaff onStaffAdded={fetchStaff} />}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Username</th>
            <th>Password</th>
            <th>Designation</th>
            <th>Branch</th> {/* New Branch column */}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {staff.map((staffMember) => (
            <tr key={staffMember.username}>
              {editStaff && editStaff.username === staffMember.username && editMode ? (
                <>
                  <td>{staffMember.username}</td>
                  <td>
                    <input
                      type="text"
                      name="password"
                      value={editStaff.password}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="designation"
                      value={editStaff.designation}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="branch" // Add editable branch field
                      value={editStaff.branch}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <button className="btn btn-primary" onClick={updateStaff}>
                      Save
                    </button>
                    <button className="btn btn-secondary" onClick={handleCancelEdit}>
                      Cancel
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td>{staffMember.username}</td>
                  <td>{staffMember.password}</td>
                  <td>{staffMember.designation}</td>
                  <td>{staffMember.branch}</td> {/* Display branch */}
                  <td>
                    <button
                      className="btn btn-warning"
                      onClick={() => handleEditStaff(staffMember)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => deleteStaff(staffMember.username)}
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

export default StaffManagement;
