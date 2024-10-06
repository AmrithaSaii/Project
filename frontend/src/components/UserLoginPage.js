import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./LoginPage.css";

const UserLoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    axios
      .post("http://localhost:8081/userlogin", { username, password })
      .then((res) => {
        if (res.data.success) {
          console.log("User login successful");
          alert("Login successful");
          localStorage.setItem("token", res.data.token);
          navigate("/UserPage");
        } else {
          console.log("failed");
          alert("Failed");
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
        <label>User ID: </label>
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

export default UserLoginPage;
