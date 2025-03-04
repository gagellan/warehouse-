import React, { useState } from "react";
import axios from "axios";
import "../../assets/css/App.css";
import warehouseImage from "../../assets/images/download8.jpeg";

const Login = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [forgotPassword, setForgotPassword] = useState(false);
    const [otpSection, setOtpSection] = useState(false);
    const [resetEmail, setResetEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [resetMessage, setResetMessage] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://127.0.0.1:5000/login", formData);
            if (response.data.message) {
                localStorage.setItem("session_key", response.data.session_key);
                window.location.href = "/Dashboard";
            }
        } catch (error) {
            setError(error.response?.data?.error || "Invalid credentials");
        }
    };

    const handleForgotPassword = async () => {
        try {
            const response = await axios.post("http://127.0.0.1:5000/forgot-password", { email: resetEmail });
            setResetMessage("OTP sent to your email.");
            setOtpSection(true); // Show OTP input
        } catch (error) {
            setResetMessage(error.response?.data?.error || "Error sending OTP.");
        }
    };

    const handleResetPassword = async () => {
        try {
            const response = await axios.post("http://127.0.0.1:5000/reset-password", {
                email: resetEmail,
                otp,
                newPassword,
                confirmPassword
            });
            setResetMessage("Password reset successful. You can now log in.");
            setForgotPassword(false);
            setOtpSection(false);
        } catch (error) {
            setResetMessage(error.response?.data?.error || "Error resetting password.");
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
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    <form className="login-form">
                        <input type="email" name="email" placeholder="Email" className="login-input-box" onChange={handleChange} required />
                        <input type="password" name="password" placeholder="Password" className="login-input-box" onChange={handleChange} required />
                        <button type="submit" className="login-btn-primary" onClick={handleLogin}>Sign In</button>
                    </form>
                    <p className="login-signup-text">
                        <span onClick={() => setForgotPassword(true)} style={{ cursor: "pointer", color: "blue" }}>
                            Forgot Password?
                        </span>
                        <p className="login-signup-text">Don't have an account? <a href="/register"><b>Register</b></a></p>
                    </p>
                </div>
            </div>

            {forgotPassword && (
                <div className="forgot-password-overlay">
                    <div className="forgot-password-card">
                        <h2>Forgot Password</h2>
                        {!otpSection ? (
                            <>
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="forgot-password-input"
                                    onChange={(e) => setResetEmail(e.target.value)}
                                />
                                <button className="forgot-password-btn" onClick={handleForgotPassword}>Send OTP</button>
                            </>
                        ) : (
                            <>
                                <input
                                    type="text"
                                    placeholder="Enter OTP"
                                    className="forgot-password-input"
                                    onChange={(e) => setOtp(e.target.value)}
                                />
                                <input
                                    type="password"
                                    placeholder="New Password"
                                    className="forgot-password-input"
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                                <input
                                    type="password"
                                    placeholder="Confirm Password"
                                    className="forgot-password-input"
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                                <button className="forgot-password-btn" onClick={handleResetPassword}>Reset Password</button>
                            </>
                        )}
                        {resetMessage && <p>{resetMessage}</p>}
                        <button className="close-btn" onClick={() => setForgotPassword(false)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;
