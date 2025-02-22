import React from "react";
import "../../assets/css/App.css";
import warehouseImage from "../../assets/images/download8.jpeg";

const Login = () => {

    const handleclicklogin = (e) => {
        e.preventDefault(); // Prevent the default form submission behavior
        window.location.href = '/Dashboard'; // Redirect to the dashboard page
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-left-section">
                    <img src={warehouseImage} alt="Warehouse" className="login-background-image" />
                </div>
                <div className="login-right-section">
                    <div className="login-top-links">
                    </div>
                    <h1>Welcome Back!</h1>
                    <br />
                    <br />
                    <form className="login-form">
                        <input type="text" placeholder="Username" className="login-input-box" required />
                        <input type="password" placeholder="Password" className="login-input-box" required />
                        <button type="submit" className="login-btn-primary"  onClick={handleclicklogin}>Sign In</button>
                    </form>
                    <p className="login-signup-text">Don't have an account? <a href="/register"><b>Register</b></a></p>
                </div>
            </div>
        </div>
    );
};

export default Login;