import React, { useEffect, useState } from "react";
import "../../assets/css/App.css";

const DemoPage = () => {
  const [countries, setCountries] = useState([]); // Store country list
  const [selectedCountry, setSelectedCountry] = useState(""); // Selected country
  const [phoneCode, setPhoneCode] = useState(""); // Phone code
  const [phoneNumber, setPhoneNumber] = useState(""); // Full phone number
  const [isChecked, setIsChecked] = useState(false);

  // Fetch countries.json from the public folder
  useEffect(() => {
    fetch("/countries.json")
      .then((response) => {
        if (!response.ok) throw new Error("Failed to load countries.json");
        return response.json();
      })
      .then((data) => setCountries(data.countries || []))
      .catch((error) => console.error("Error fetching countries:", error));
  }, []);

  // Handle country selection
  const handleCountryChange = (event) => {
    const countryName = event.target.value;
    setSelectedCountry(countryName);

    const country = countries.find((c) => c.name === countryName);
    if (country) {
      setPhoneCode(country.code);
      setPhoneNumber(country.code + " "); // Pre-fill phone number with code
    } else {
      setPhoneCode("");
      setPhoneNumber("");
    }
  };


  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();

    if (!isChecked) {
      alert("Please agree to receive marketing communications before submitting.");
      return;
    }

    // Handle form submission logic here
    console.log("Form submitted successfully!");
  };

  return (
    <div className="demo-container">
      <div className="sample-demo-c">
        <h1>Request A Demo</h1>
        <div className="content-wrapper">
          <div className="content">
            <h3>Discover How Gagellan Global Solutions Transforms Warehouse Operations</h3>
            <br></br>
            <p>✅ <b>Experience AI-driven warehouse monitoring</b> - Get real-time insights into your operations</p>
            <br></br>
            <p>✅ <b>Optimize security & compliance</b> - Ensure adherence to SOPs with automated alerts</p>
            <br></br>
            <p>✅ <b>Streamline loading & unloading tracking</b> - Gain visibility into truck movement & workforce activity</p>
            <br></br>
            <p>✅ <b>Leverage AI-powered analytics</b> - Identify trends, detect inefficiencies, and make data-driven decisions</p>
            <br></br>
          </div>

          <div className="form-container">
            <form className="demo-form">
              <input type="text" placeholder="First Name*" required />
              <input type="text" placeholder="Last Name*" required />
              <input type="email" placeholder="Email*" required />
              <input type="text" placeholder="Company Name" />
              <input type="text" placeholder="Job Title" />

              {/* Country & Phone Number Section */}
              <div className="phone-container">
                <select onChange={handleCountryChange} value={selectedCountry}>
                  <option value="">Select Country</option>
                  {countries.map((country) => (
                    <option key={country.name} value={country.name}>
                      {country.name}
                    </option>
                  ))}
                </select>
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>

              <textarea placeholder="Please tell us more about how we can help you..." rows="4"></textarea>

              {/* Marketing Consent Checkbox */}
              <div className="checkbox-container">
                <input
                  type="checkbox"
                  id="marketingConsent"
                  checked={isChecked}
                  onChange={() => setIsChecked(!isChecked)}
                  required
                />
                <label htmlFor="marketingConsent" className="freeconsent-label">
                  I agree to receive marketing communications from Gagellan Global Solutions.  
                  You can unsubscribe from these communications at any time. For more  
                  information on how to unsubscribe, our privacy practices, and how we are  
                  committed to protecting and respecting your privacy, please read our full  
                  <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="freeconsent-link"> Privacy Policy</a>.
                </label>
              </div>

              <button type="submit" className="btn demo-btn">Request A Demo</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoPage;
