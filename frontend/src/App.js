import React, { useEffect, useState } from "react";
import axios from "axios";
import Home from "./components/home";
import { BrowserRouter as Router, Route, Link, Routes,Switch} from "react-router-dom";
import LoginPage from "./components/UserLoginPage";
import "./App.css";
import Signup from "./components/SignUp";
import AdminLoginPage from "./components/AdminLoginPage";
import StaffLoginPage from "./components/StaffLoginPage";
import UserLoginPage from "./components/UserLoginPage";
import AdminDashboard from "./components/dashboard/admin/AdminDashboard";
import UserDashboard from "./components/dashboard/user/UserDashboard";
import StaffDashboard from "./components/dashboard/staff/StaffDashboard";

function App() {
  

  return (
      <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<Signup />}></Route>
          <Route path="/AdminPage" element={<AdminDashboard />}></Route>
          <Route path="/UserPage" element={<UserDashboard />} />
          <Route path="/StaffPage" element={<StaffDashboard />} />
          <Route path="/login/user" element={<UserLoginPage />} />
          <Route path="/login/staff" element={<StaffLoginPage />} />
          <Route path="/login/admin" element={<AdminLoginPage />} />
        </Routes>
      </div>
    </Router>
  );
}
export default App;