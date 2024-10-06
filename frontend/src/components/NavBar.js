import React, { useState } from "react";
import { Link } from "react-router-dom";

import "./NavBar.css";

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <nav className="naaaaavbar">
      <div className="uni">UniCredit Bank</div>

      <ul>
        <li>
          <a href="#services" >Services</a>
        </li>
        <li>
          <a href="#about" >
            About Us
          </a>
        </li>
        <li>
          <a href="#contact">Contact</a>
        </li>
        <li>
          <button id="rules" onClick={toggleDropdown}>Login &#9660;</button>
          

          {showDropdown && (
            <div className="hellohey">
              <ul>
                <li>
                  <Link to="/login/user">User </Link>
                </li>
                <li>
                  <Link to="/login/staff">Staff</Link>
                </li>
                <li>
                  <Link to="/login/admin">Admin</Link>
                </li>
              </ul>
            </div>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
