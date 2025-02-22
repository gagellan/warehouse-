import React from "react";
import "../../assets/css/App.css";
import warehouseImage from "../../assets/images/download8.jpeg"; 

const Register = () => {
  const handleclickregister = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    window.location.href = '/Dashboard'; // Redirect to the dashboard page
  };

  return (
    <div className="login-container">
    <div className="login-card">
      {/* Left Section */}
      <div className="login-left-section">
        <img src={warehouseImage} alt="Warehouse" className="login-background-image" />
      </div>

      {/* Right Section */}
      <div className="login-right-section">
        {/* Navigation Links */}
        {/* <div className="login-top-links">
          <a href="/login" className="sign-in">Sign in</a>
          <a href="/register" className="register active">Register</a>
        </div> */}

        <h1>Hello! Create Your Account</h1>
        <br />
        <br />

        {/* Form Section */}
        <form className="login-form">
          <input type="text" name="firstName" placeholder="First Name" className="login-input-box" required />
          <input type="text" name="lastName" placeholder="Last Name" className="login-input-box" required />
          <input type="email" name="email" placeholder="Email" className="login-input-box" required />
          <input type="password" name="password" placeholder="Password" className="login-input-box" required />
          <input type="password" name="confirmPassword" placeholder="Confirm Password" className="login-input-box" required />
          <button type="submit" className="login-btn-primary" onClick={handleclickregister}>Register</button>
        </form>

        <p className="login-signup-text">
          Already Have An Account? <a href="/login"><b>Sign In</b></a>
        </p>
      </div>
    </div>
    </div>
  );
};

export default Register;