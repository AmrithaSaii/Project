import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <div className="footer">
      <footer className="homepage-footer">
        <div className="footer-content">
          <div className="footer-section about">
            <h3>UniCredit Bank</h3>
            <p>UniCredit Bank is committed to providing the best financial services to our customers. Our goal is to be your trusted financial partner.</p>
          </div>
          <div className="footer-section links">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="#about">About Us</a></li>
              <li><a href="#services">Services</a></li>
              <li><a href="#contact">Contact</a></li>
              <li><a href="/privacy">Privacy Policy</a></li>
              <li><a href="/terms">Terms & Conditions</a></li>
            </ul>
          </div>
          <div className="footer-section social">
            <h3>Follow Us</h3>
            <img src="/images/instagram.png"  style={{ width: '50px', height: 'auto'}}/>
            <img src="/images/twitter.png" style={{ width: '50px', height: 'auto'}}/>
            <img src="/images/facebook.png" style={{ width: '50px', height: 'auto'}}/>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 UniCredit Bank. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
