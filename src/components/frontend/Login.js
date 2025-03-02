import React, { useState } from "react";
import "../../assets/css/App.css";
import axios from "axios";
import warehouseImage from "../../assets/images/download8.jpeg";

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleclicklogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://127.0.0.1:5000/login", formData);

            if (response.data.message) {
                localStorage.setItem("session_key", response.data.session_key); // Store session key
                window.location.href = "/Dashboard"; // Redirect to Dashboard
            }
        } catch (error) {
            setError(error.response?.data?.error || "Invalid credentials");
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-left-section">
                    <img src={warehouseImage} alt="Warehouse" className="login-background-image" />
                </div>
                <div className="login-right-section">
                    <h1>Welcome Back!</h1>
                    <br />
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    <form className="login-form">
                        <input type="email" name="email" placeholder="Email" className="login-input-box" onChange={handleChange} required />
                        <input type="password" name="password" placeholder="Password" className="login-input-box" onChange={handleChange} required />
                        <button type="submit" className="login-btn-primary" onClick={handleclicklogin}>Sign In</button>
                    </form>
                    <p className="login-signup-text">Don't have an account? <a href="/register"><b>Register</b></a></p>
                </div>
            </div>
        </div>
    );
};

export default Login;
