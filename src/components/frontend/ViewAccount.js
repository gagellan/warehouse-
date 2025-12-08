import React, { useState } from 'react';
import axios from 'axios';

const ViewAccount = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isOtpStep, setIsOtpStep] = useState(false);
    const [message, setMessage] = useState('');

    const resetFields = () => {
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setOtp('');
        setMessage('');
    };

    const handlePasswordSubmit = async () => {
        setMessage('');
        if (newPassword !== confirmPassword) {
            setMessage("New passwords do not match.");
            return;
        }

        try {
            await axios.post(
                "http://localhost:5000/reset-password-request",
                { oldPassword, newPassword },
                { withCredentials: true }
            );
            setIsOtpStep(true);
            setMessage("OTP sent to your registered email.");
        } catch (error) {
            setMessage(error.response?.data?.error || "Failed to send OTP.");
        }
    };

    const handleOtpVerify = async () => {
        setMessage('');
        try {
            await axios.post(
                "http://localhost:5000/update-password",
                { oldPassword, newPassword, otp },
                { withCredentials: true }
            );

            setMessage("Password updated successfully.");

            setTimeout(() => {
                resetFields();
                setIsModalOpen(false);
                setIsOtpStep(false);
                window.location.href = "/login";
            }, 2000);
        } catch (error) {
            setMessage(error.response?.data?.error || "OTP verification failed.");
        }
    };

    return (
        <div style={{ display: 'flex', gap: '2rem', padding: '2rem' }}>
            {/* Left: Camera Feed Card */}
            <div style={{ flex: 1, background: '#000', borderRadius: '10px', color: '#fff', padding: '1rem' }}>
                <h3>Camera Feed</h3>
                <p>Camera is currently offline.</p>
            </div>

            {/* Right: Change Password */}
            <div style={{ flex: 1, padding: '2rem', border: '1px solid #ccc', borderRadius: '10px' }}>
                <h3>Account Settings</h3>
                <button onClick={() => setIsModalOpen(true)} style={{ marginTop: '1rem' }}>
                    Change Password
                </button>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center'
                }}>
                    <div style={{
                        background: '#fff', padding: '2rem', borderRadius: '10px', width: '400px',
                        boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
                    }}>
                        <h3 style={{ marginBottom: '1.5rem' }}>Change Password</h3>

                        {!isOtpStep ? (
                            <>
                                <input
                                    type="password"
                                    placeholder="Old Password"
                                    value={oldPassword}
                                    onChange={e => setOldPassword(e.target.value)}
                                    style={{ width: '100%', marginBottom: '1rem', padding: '0.5rem' }}
                                />
                                <input
                                    type="password"
                                    placeholder="New Password"
                                    value={newPassword}
                                    onChange={e => setNewPassword(e.target.value)}
                                    style={{ width: '100%', marginBottom: '1rem', padding: '0.5rem' }}
                                />
                                <input
                                    type="password"
                                    placeholder="Confirm New Password"
                                    value={confirmPassword}
                                    onChange={e => setConfirmPassword(e.target.value)}
                                    style={{ width: '100%', marginBottom: '1rem', padding: '0.5rem' }}
                                />
                                <button onClick={handlePasswordSubmit} style={{ width: '100%' }}>
                                    Submit
                                </button>
                            </>
                        ) : (
                            <>
                                <input
                                    type="text"
                                    placeholder="Enter OTP"
                                    value={otp}
                                    onChange={e => setOtp(e.target.value)}
                                    style={{ width: '100%', marginBottom: '1rem', padding: '0.5rem' }}
                                />
                                <button onClick={handleOtpVerify} style={{ width: '100%' }}>
                                    Verify OTP
                                </button>
                            </>
                        )}

                        {message && (
                            <p
                                style={{
                                    color: message.toLowerCase().includes("success") ? "green" : "red",
                                    marginTop: '1rem',
                                    textAlign: 'center'
                                }}
                            >
                                {message}
                            </p>
                        )}

                        <button
                            onClick={() => {
                                setIsModalOpen(false);
                                setIsOtpStep(false);
                                resetFields();
                            }}
                            style={{ marginTop: '1rem', width: '100%', backgroundColor: '#ccc' }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViewAccount;
