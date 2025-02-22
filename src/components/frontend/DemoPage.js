import React, { useEffect, useState } from "react";
import "../../assets/css/App.css";

const DemoPage = () => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [phoneCode, setPhoneCode] = useState("");
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

    const country = countries.find((c) => c.code === countryCode);
    if (country) {
      setPhoneCode(country.phoneCode);
      setPhoneNumber(country.phoneCode + " ");
    } else {
      setPhoneCode("");
      setPhoneNumber("");
    }

    fetchStates(countryCode);
    setSelectedState("");
  };

  return (
    <div className="demo-container">
      <div className="sample-demo-c">
        <h1>Request A Demo</h1>
        <div className="content-wrapper">
          <div className="content">
            <h3>Discover How Gagellan Global Solutions Transforms Warehouse Operations</h3>
            <br />
            <p>✅<b> Experience AI-driven warehouse monitoring</b> - Get real-time insights into your operations</p>
            <br />
            <p>✅<b> Optimize security & compliance</b> - Ensure adherence to SOPs with automated alerts</p>
            <br />
            <p>✅<b> Streamline loading & unloading tracking</b> - Gain visibility into truck movement & workforce activity</p>
            <br />
            <p>✅<b> Leverage AI-powered analytics</b> - Identify trends, detect inefficiencies, and make data-driven decisions</p>
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

              <textarea placeholder="Please tell us more about how we can help you..." rows="4"></textarea>

              <button type="submit" className="btn demo-btn">Request A Demo</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoPage;