import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./LoginPage.css";

const AdminLoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post('http://localhost:8081/admin', { username, password });

      if (response.data.success) {
        console.log("Admin login successful");
        navigate('/AdminPage');
      } else {
        console.log("Error in login");
        alert("Error in login");
      }
    } catch (error) {
      console.error("Error in login:", error);
      alert("Error in login");
    }
  };

  return (
    <div className="loginpage">
      <header className="loginpage-header">
        <h1>Login</h1>
        <div>
          <form onSubmit={handleLogin}>
            <div>
              <label>Admin ID:</label><br />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Password:</label><br />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit">Login</button>
          </form>
          <Link to="/">
            <button type="button">Back</button>
          </Link>
        </div>
        {error && <p className="error">{error}</p>}
      </header>
    </div>
  );
};

export default AdminLoginPage;
