import React from "react";
import "../../assets/css/App.css";
import warehouseImage from "../../assets/images/download8.jpeg";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    password: "",
    confirmPassword: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
            <input type="text" name="mobileNumber" placeholder="Mobile Number" className="login-input-box" onChange={handleChange} required />
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
