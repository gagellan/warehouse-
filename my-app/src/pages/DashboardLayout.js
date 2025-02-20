import React from "react";
import Navbar from "./Navbar"; // Import the Navbar component
import TopNavbar from "./TopNavbar"; // Import the TopNavbar component

const DashboardLayout = ({ children }) => {
  return (
    <div>
      <Navbar /> {/* Render the Navbar */}
      {/* <TopNavbar /> Render the TopNavbar */}
      <div style={{ padding: "20px" }}>
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;