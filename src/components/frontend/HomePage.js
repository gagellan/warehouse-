import React from "react";
import { Link } from "react-router-dom";
import "../../assets/css/App.css";
import PlanPage from "./PlanPage"; // Import PlanPage
import { VscAccount } from "react-icons/vsc";
import Footer from "./Footer.js"

function HomePage() {
  return (
    <div>
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-logo">
            {/* Gagellan Global Solution */}
          </Link>

          {/* Centered Navbar Links */}
          <div className="navbar-links">
            <Link to="/" className="navbar-link">About Us</Link>
            <Link to="/" className="navbar-link">Partners</Link>
            <Link to="/" className="navbar-link">Products</Link>
            <Link to="/" className="navbar-link">Solutions</Link>
          </div>

          {/* Login Link at End */}
          <div className="navbar-login">
            <Link to="/login" className="navbar-link"><VscAccount /></Link>
          </div>
        </div>
      </nav>

      <div className="contact-container">
        <div className="content">
          <h1>One Platform to Optimize & Secure Your Warehouse Operations</h1>
          <p>
            At <b>Gagellan Global Solution</b>, we provide an advanced AI-driven platform designed to optimize warehouse security, automate monitoring, and improve operational efficiency. Our intelligent system captures and analyzes real-time data from CCTV feeds, ensuring compliance, security, and productivity without the need for 24/7 manual supervision.
          </p>
          <div className="buttons">
            <Link to="/demo">
              <button className="btn demo-btn">Get a Demo</button>
            </Link>
            <Link to="/free-trial">
              <button className="btn trial-btn">Free Trial</button>
            </Link>
          </div>
        </div>
      </div>

      <PlanPage /> {/* Render PlanPage below HomePage content */}
      <Footer />
    </div>
  );
}

export default HomePage;
