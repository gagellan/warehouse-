import React, { useEffect, useState } from "react";
import "../../assets/css/App.css";
// import dashboardImage from "../dashboard.jpeg"; // Ensure this file exists
import dashboardImage from "../../assets/images/dashboard.jpeg"; // Ensure this file exists


const FreeTrialPage = () => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const API_KEY = "U0dMdUZ1R3JKYWFtOEU2eVppM1BzZDlLUzlySE40MUs3QUEwSzQyTA=="; // Replace with actual API key

  useEffect(() => {
    async function fetchCountries() {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        const data = await response.json();
        const countryList = data
          .filter(country => country.idd?.root)
          .map((country) => ({
            name: country.name.common,
            code: country.cca2,
            phoneCode: country.idd.root + (country.idd.suffixes ? country.idd.suffixes[0] : ""),
          }));
        setCountries(countryList.sort((a, b) => a.name.localeCompare(b.name)));
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    }
    fetchCountries();
  }, []);

  async function fetchStates(countryCode) {
    if (!countryCode) return;
    try {
      const response = await fetch(`https://api.countrystatecity.in/v1/countries/${countryCode}/states`, {
        headers: { "X-CSCAPI-KEY": API_KEY },
      });
      if (!response.ok) throw new Error("Failed to fetch states");

      const data = await response.json();
      setStates(data);
    } catch (error) {
      console.error("Error fetching states:", error);
      setStates([]);
    }
  }

  const handleCountryChange = (event) => {
    const countryCode = event.target.value;
    setSelectedCountry(countryCode);
    fetchStates(countryCode);
    setSelectedState("");
  };

  return (
    <div className="demo-container">
      <div className="sample-demo-c">
      <h1>Request A Free Trial</h1>
      {/* <img src={dashboardImage} alt="Dashboard Preview" className="dashboard-image" /> */}
      <div className="content-wrapper">
        <div className="content">
          <h3>Unlock the full potential of AI-driven security, monitoring, and compliance solutions with our free trial.</h3>
          <br />
          <p>✅ Test AI security solutions in real-world scenarios</p>
          <br />
          <p>✅ Evaluate compliance tools tailored to industry regulations</p>
          <br />
          <p>✅ Access AI-powered monitoring & threat detection for enhanced safety</p>
          <br />
          <p>✅ Receive personalized support from our expert team</p>
          <br />
        </div>
        <div className="form-container">
          <form className="demo-form">
            <input type="text" placeholder="First Name*" required />
            <input type="text" placeholder="Last Name*" required />
            <input type="email" placeholder="Email*" required />
            <input type="text" placeholder="Company Name" />
            <input type="text" placeholder="Job Title" />
            <div className="phone-container">
              <select onChange={handleCountryChange} value={selectedCountry}>
                <option value="">Select Country</option>
                {countries.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </select>
              <input type="tel" placeholder="Phone Number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
            </div>
            <select value={selectedState} onChange={(e) => setSelectedState(e.target.value)}>
              <option value="">Select State</option>
              {states.map((state) => (
                <option key={state.iso2} value={state.iso2}>
                  {state.name}
                </option>
              ))}
            </select>
            <textarea placeholder="Tell us about your AI needs..." rows="4"></textarea>
            <button type="submit" className="btn demo-btn">Start Free Trial</button>
          </form>
        </div>
      </div>
      </div>
    </div>
  );
};

export default FreeTrialPage;