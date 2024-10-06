import { React, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginPage from "./UserLoginPage";
import About from "./About";
import Services from "./Services";
import "./HomePage.css";

const HomePage = ({}) => {
  return (
    <div className="homepage">
      <header className="homepage-header">
        <h1> Welcome to UniCredit Bank</h1>
        <p>Your trusted financial partner.</p>
        <button>
          {" "}
          <a href="/signup"> Get Started</a>
        </button>
      </header>
    </div>
  );
};
export default HomePage;
