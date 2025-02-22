import React from "react";
import { useLocation } from "react-router-dom";
import "../App.css"; // Import global styles

export default function TopNavbar() {
  const location = useLocation();

  const pageTitles = {
    "/": "Dashboard",
    "/Dashboard": "Dashboard",
    "/dashboard": "Dashboard",
    "/images": "Images",
    "/images/hourwise": "Hour Wise Images",
    "/images/daywise": "Day Wise Images",
    "/images/custom": "Custom Images",
    "/reports": "Reports",
    "/compareimages": "Compare Images",
    "/timelapse": "Timelapse",
    "/login": "Logout",
  };

  const currentPage = pageTitles[location.pathname] || "Page Not Found";

  return (
    <div className="dashboardnav-top-navba">
      {/* <h1>{currentPage}</h1> */}
    </div>
  );
}