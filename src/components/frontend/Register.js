import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../assets/css/App.css";
import warehouseImage from "../../assets/images/download8.jpeg";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    country: "",
    phoneCode: "",
    password: "",
    confirmPassword: ""
  });

  const [countries, setCountries] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch countries.json from public folder
  useEffect(() => {
    fetch("/countries.json")
      .then((response) => response.json())
      .then((data) => setCountries(data.countries))
      .catch((error) => console.error("Error fetching countries:", error));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle country selection and update phone code
  const handleCountryChange = (e) => {
    const selectedCountry = e.target.value;
    setFormData({ ...formData, country: selectedCountry });

    const countryData = countries.find((c) => c.name === selectedCountry);
    if (countryData) {
      setFormData((prev) => ({ ...prev, phoneCode: countryData.code }));
    }
  };

  const handleclickregister = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://127.0.0.1:5000/register", formData);
      setSuccess(response.data.message);
      setError("");
      setTimeout(() => {
        window.location.href = "/Dashboard";
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.error || "Something went wrong");
      setSuccess("");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-left-section">
          <img src={warehouseImage} alt="Warehouse" className="login-background-image" />
        </div>

        <div className="login-right-section">
          <h1>Hello! Create Your Account</h1>
          <br />
          {error && <p style={{ color: "red" }}>{error}</p>}
          {success && <p style={{ color: "green" }}>{success}</p>}
          <form className="login-form">
            <input type="text" name="firstName" placeholder="First Name" className="login-input-box" onChange={handleChange} required />
            <input type="text" name="lastName" placeholder="Last Name" className="login-input-box" onChange={handleChange} required />
            <input type="email" name="email" placeholder="Email" className="login-input-box" onChange={handleChange} required />

            {/* Country Selection */}
            <select name="country" className="login-input-box" onChange={handleCountryChange} required>
              <option value="">Select Country</option>
              {countries.map((country) => (
                <option key={country.name} value={country.name}>
                  {country.name}
                </option>
              ))}
            </select>

            {/* Phone Number Input with Country Code */}
            <div className="phone-container">
              <input
                type="text"
                name="phoneCode"
                className="phone-code-box"
                value={formData.phoneCode}
                readOnly
              />
              <input
                type="text"
                name="mobileNumber"
                placeholder="Mobile Number"
                className="login-input-box"
                onChange={handleChange}
                required
              />
            </div>

            <input type="password" name="password" placeholder="Password" className="login-input-box" onChange={handleChange} required />
            <input type="password" name="confirmPassword" placeholder="Confirm Password" className="login-input-box" onChange={handleChange} required />
            <button type="submit" className="login-btn-primary" onClick={handleclickregister}>
              Register
            </button>
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
