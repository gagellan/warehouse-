import React from "react";
import "../../assets/css/App.css";
import { FaFacebook } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa6";
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-left">
        <img src="/logo.png" alt="WM Logo" className="footer-logo" />
        <p className="footer-description">
          AI-driven platform designed to optimize warehouse security, automate monitoring, and improve operational efficiency.
        </p>
        <div className="footer-social">
          <a href="#" className="footer-social-icon">
            <i className="fab fa-linkedin"></i>
          </a>
          <a href="#" className="footer-social-icon">
            <i className="fab fa-youtube"></i>
          </a>
        </div>
        <button className="footer-contact-button">
          CONTACT US <span className="footer-arrow">→</span>
        </button>
      </div>

      <div className="footer-right">
        <div className="footer-column">
          <h4 className="footer-heading">OUR SOLUTIONS</h4>
          <ul>
            <li><a href="#">WM overview</a></li>
            <li><a href="#">Business solutions</a></li>
            <li><a href="#">Technology</a></li>
            <li><a href="#">Managed services</a></li>
            <li><a href="#">Customer success</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4 className="footer-heading">OUR CLIENTS</h4>
          <ul>
            <li><a href="#">Stealth Monitoring</a></li>
            <li><a href="#">ECAMSECURE</a></li>
            <li><a href="#">Time-Lapse Systems</a></li>
            <li><a href="#">EarthCam</a></li>
            <li><a href="#">CamDo</a></li>
            {/* <li><a href="#">Night Hawk Monitoring</a></li> */}
          </ul>
        </div>

        <div className="footer-column">
          <h4 className="footer-heading">WHO WE ARE</h4>
          <ul>
            <li><a href="#">About us</a></li>
            <li><a href="#">News</a></li>
            <li><a href="#">Awards</a></li>
            <li><a href="#">Events</a></li>
            <li><a href="#">Locations</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4 className="footer-heading">CAREERS</h4>
          <ul>
            <li><a href="#">Working at Gagellan</a></li>
            <li><a href="#">Our teams</a></li>
            {/* <li><a href="#">How we hire</a></li>
            <li><a href="#">Students and graduates</a></li> */}
            <li><a href="#">Testimonials</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4 className="footer-heading">CUSTOMER PORTAL</h4>
          <ul>
            <li><a href="#">Community zone</a></li>
            <li><a href="#">Customer portal</a></li>
            <br></br>
            <br></br>
            <li>
              <a href="https://www.facebook.com/gagellan/" style={{ marginRight: "10px", fontSize: "17px" }}><FaFacebook /></a>
              <a href="https://www.linkedin.com/company/gagellanggs/" style={{ marginRight: "10px", fontSize: "17px" }}><FaLinkedin /></a>
              <a href="https://www.instagram.com/_gagellan/" style={{ marginRight: "10px", fontSize: "17px" }}><FaInstagram /></a>
              <a href="https://x.com/gagellanbiz" style={{  fontSize: "17px" }}><FaXTwitter /></a>
            </li>
            {/* <li><a href="#"><FaLinkedin /></a></li>
            <li><a href="#"><FaInstagram /></a></li>
            <li><a href="#"><FaXTwitter /></a></li> */}



          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          <a href="#">Privacy policy</a> | <a href="#">Terms of use</a>{" "}
        </p>
        <p>Copyright © 2024-2026 Gagellan.com All Rights Reserved</p>
      </div>
    </footer>
  );
};

export default Footer;
