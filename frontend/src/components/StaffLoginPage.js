import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./LoginPage.css";

const StaffLoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    axios
      .post("http://localhost:8081/stafflogin", { username, password })
      .then((res) => {
        if (res.data.success) {
          console.log("staff login successful");
          alert("Login successful");
          localStorage.setItem("token", res.data.token);
          navigate("/StaffPage");
        } else {
          console.log("Login failed");
          alert("Login failed");
          setError("Invalid username or password");
        }
      })
      .catch((err) => {
        console.error("Error during login:", err);
        setError("An error occurred. Please try again later.");
      });
  };

  const renderLoginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        <label>Staff ID: </label>
        <br></br>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit">Login</button>
      <Link to="/">
        <button type="button">Back</button>
      </Link>
    </form>
  );

  return (
    <div className="loginpage">
      <header className="loginpage-header">
        <h1>Login</h1>
        <div>{renderLoginForm()}</div>
        {error && <p className="error">{error}</p>}
      </header>
    </div>
  );
};

export default StaffLoginPage;
