import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const StaffProfile = () => {
  const [staff, setStaff] = useState(null);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    designation: "",
    password: "",
    branch:"",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("No token found. Please log in.");
      return;
    }

    axios
      .get("http://localhost:8081/hello/staffprofile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.success) {
          setStaff(res.data.staff);
          setFormData({
            designation: res.data.staff.designation,
            password: res.data.staff.password,
            branch: res.data.staff.branch
          });
        } else {
          setError("Failed to fetch staff profile");
        }
      })
      .catch((err) => {
        console.error("Error fetching staff profile:", err);
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
      .put("http://localhost:8081/hello/staffprofile", formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.success) {
          setStaff((prevStaff) => ({ ...prevStaff, ...formData }));
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

  if (error) return <div>{error}</div>;

  return (
    <div className="container staffpage">
      <h1> Profile</h1>
      {staff ? (
        <form onSubmit={handleSave}>
          <table className="table table-bordered">
            <tbody>
              <tr>
                <th>Username</th>
                <td>{staff.username}</td>
              </tr>
              <tr>
                <th>Designation</th>
                <td>
                  {editMode ? (
                    <input
                      type="text"
                      name="designation"
                      value={formData.designation}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  ) : (
                    staff.designation
                  )}
                </td>
              </tr>
              <tr>
                <th>Password</th>
                <td>
                  {editMode ? (
                    <input
                      type="text"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  ) : (
                    staff.password
                  )}
                </td>
              </tr>
              <tr>
                <th>Branch</th> {/* New Branch row */}
                <td>
                  {editMode ? (
                    <input
                      type="text"
                      name="branch"
                      value={formData.branch}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  ) : (
                    staff.branch
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

export default StaffProfile;
