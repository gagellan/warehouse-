import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import "../App.css"; // Ensure styles are added in your main CSS file

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Navigation Links */}
        <div className="footer-links">
          <Link to="/about" className="footer-link">About Us</Link>
          <Link to="/partners" className="footer-link">Partners</Link>
          <Link to="/products" className="footer-link">Products</Link>
          <Link to="/solutions" className="footer-link">Solutions</Link>
        </div>

        {/* Terms & Privacy */}
        <div className="footer-policy">
          <Link to="/terms" className="footer-link">Terms & Conditions</Link>
          <Link to="/privacy" className="footer-link">Privacy Policy</Link>
        </div>

        {/* Social Media Icons */}
        <div className="footer-social">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon"><FaFacebookF /></a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon"><FaTwitter /></a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon"><FaLinkedinIn /></a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon"><FaInstagram /></a>
        </div>
      </div>

      {/* Copyright */}
      <div className="footer-bottom">
        <p>Copyright © {new Date().getFullYear()} Gagellan Global Solution. All Rights Reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
