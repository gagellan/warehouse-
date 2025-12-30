import "../../assets/css/App.css";
import React, { useEffect, useState } from "react";
import logo from '../../assets/images/logo.jpg';

import { useLocation, useNavigate } from "react-router-dom";

import { IoHomeOutline } from "react-icons/io5";
import { IoImagesOutline } from "react-icons/io5";
import { MdOutlineCompare } from "react-icons/md";
import { MdOutlineTimelapse } from "react-icons/md";
import { TbReportAnalytics } from "react-icons/tb";
import { MdKeyboardArrowRight } from "react-icons/md";
import { TbClockHour5Filled } from "react-icons/tb";
import { MdOutlineToday } from "react-icons/md";
import { LuInfinity } from "react-icons/lu";
import { FaTruck } from "react-icons/fa6";

import { IoMdNotificationsOutline } from "react-icons/io";
import { AiOutlineSetting } from "react-icons/ai";
import { BsQuestionCircle } from "react-icons/bs";
import { VscAccount } from "react-icons/vsc";
import { FaExternalLinkAlt } from "react-icons/fa";

import userImage from '../../assets/images/user.jpg';


function Navbar({ onCollapseChange }) {

  const location = useLocation();
  const navigate = useNavigate();

  const [userFirstName, setUserFirstName] = useState("");
  const [email, setUserEmail] = useState("");
  const [showEmailBox, setShowEmailBox] = useState(false);

  const [dropdownOpen, setDropdownOpen] = useState(true); 
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (email) setUserEmail(email);
  }, []);

  useEffect(() => {
    const firstName = localStorage.getItem("userFirstName");
    if (firstName) setUserFirstName(firstName);
  }, []);

  const toggleEmailBox = () => {
    setShowEmailBox(prev => !prev);
  };

  const handleViewAccount = () => {
    navigate("/account");
  };

  const handleLogout = async () => {
    let sessionKey = localStorage.getItem("session_key");

    try {
      // Always attempt to notify backend even if session key is missing
      const response = await fetch("http://127.0.0.1:5000/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          session_key: sessionKey || "unknown_session" 
        }),
      });

      // Log the response status for debugging
      console.log("Logout response status:", response.status);

      // Don't wait for validation - clear local data regardless
      // This ensures the user is logged out on the client side
      localStorage.removeItem("session_key");
      localStorage.removeItem("userFirstName");
      localStorage.removeItem("userEmail");
      
      // Clear session storage as well
      sessionStorage.clear();

      // Redirect to login page
      window.location.href = "/login";

    } catch (error) {
      // Handle network errors gracefully - still log out on client
      console.error("Logout error (will still proceed with client logout):", error);
      
      // Clear all authentication data
      localStorage.removeItem("session_key");
      localStorage.removeItem("userFirstName");
      localStorage.removeItem("userEmail");
      sessionStorage.clear();

      // Redirect to login
      window.location.href = "/login";
    }
  };

  const pageTitles = {
    "/": "DASHBOARD",
    "/Dashboard": "DASHBOARD",
    "/dashboard": "DASHBOARD",
    "/images": "GALLERY",
    "/images/hourwise": "HOUR WISE IMAGES",
    "/images/daywise": "DAY WISE IMAGES",
    "/images/custom": "CUSTOM IMAGES",
    "/reports": "REPORTS",
    "/compareimages": "COMPARE IMAGES",
    "/timelapse": "TIMELAPSE",
    "/login": "LOGOUT",
    "/vehicledashboard": "VEHICLE DASHBOARD",
    "/logout": "Logout"
  };

  const currentPage = pageTitles[location.pathname];

  const toggleSidebarCollapse = () => {
    setSidebarCollapsed(prev => !prev);
    if (onCollapseChange) onCollapseChange(!sidebarCollapsed);
  };

  const handleOverlayClick = () => setSideMenuOpen(false);

  return (
    <div>

      {/* Sidebar Overlay (Mobile) */}
      {sideMenuOpen && (
        <div className="sidebar-overlay active" onClick={handleOverlayClick}></div>
      )}

      {/* Sidebar */}
      <div className={`dashboardnav-sidebar ${sideMenuOpen ? 'open' : ''} ${sidebarCollapsed ? 'collapsed' : ''}`}>

        {/* Mobile Close Button */}
        <button className="close-button" onClick={() => setSideMenuOpen(false)}>✕</button>

        <ul className="dashboardnav-SidebarList">

          <li
            className="dashboardnav-row"
            data-tooltip="Dashboard"
            id={location.pathname === '/dashboard' ? 'dashboardnav-active' : ''}
            onClick={() => navigate('/dashboard')}
          >
            <div id="dashboardnav-icon"><IoHomeOutline /></div>
            <div id="dashboardnav-title">Dashboard</div>
          </li>

          <li
            className="dashboardnav-row"
            data-tooltip="Gallery"
            id={location.pathname.startsWith('/images') ? 'dashboardnav-active' : ''}
            onClick={() => navigate('/images/hourwise')}
          >
            <div id="dashboardnav-icon"><IoImagesOutline /></div>
            <div id="dashboardnav-title">Gallery</div>
            <div id="dashboardnav-arrow"><MdKeyboardArrowRight /></div>
          </li>

          <ul className="dashboardnav-nested-list">
            <li className="dashboardnav-nested-item" onClick={() => navigate('/images/hourwise')}>
              <span className="dashboardnav-nested-icon"><TbClockHour5Filled /></span> Hour Wise
            </li>
            <li className="dashboardnav-nested-item" onClick={() => navigate('/images/daywise')}>
              <span className="dashboardnav-nested-icon"><MdOutlineToday /></span> Day Wise
            </li>
            <li className="dashboardnav-nested-item" onClick={() => navigate('/images/custom')}>
              <span className="dashboardnav-nested-icon"><LuInfinity /></span> Custom
            </li>
          </ul>

          <li
            className="dashboardnav-row"
            data-tooltip="Compare Images"
            id={location.pathname === '/compareimages' ? 'dashboardnav-active' : ''}
            onClick={() => navigate('/compareimages')}
          >
            <div id="dashboardnav-icon"><MdOutlineCompare /></div>
            <div id="dashboardnav-title">Compare Images</div>
          </li>

          <li
            className="dashboardnav-row"
            data-tooltip="Timelapse"
            id={location.pathname === '/timelapse' ? 'dashboardnav-active' : ''}
            onClick={() => navigate('/timelapse')}
          >
            <div id="dashboardnav-icon"><MdOutlineTimelapse /></div>
            <div id="dashboardnav-title">Timelapse</div>
          </li>

          <li
            className="dashboardnav-row"
            data-tooltip="Reports"
            id={location.pathname === '/reports' ? 'dashboardnav-active' : ''}
            onClick={() => navigate('/reports')}
          >
            <div id="dashboardnav-icon"><TbReportAnalytics /></div>
            <div id="dashboardnav-title">Reports</div>
          </li>

          <li
            className="dashboardnav-row"
            data-tooltip="Vehicle Dashboard"
            id={location.pathname === '/vehicledashboard' ? 'dashboardnav-active' : ''}
            onClick={() => navigate('/vehicledashboard')}
          >
            <div id="dashboardnav-icon"><FaTruck /></div>
            <div id="dashboardnav-title">Vehicle Dashboard</div>
          </li>

        </ul>
      </div>

      {/* TOP NAVBAR */}
      <div className="top-navbar">
        <button className="menu-button" onClick={() => {
          setSideMenuOpen(prev => !prev);
          toggleSidebarCollapse();
        }}>☰</button>
        <h1>{currentPage}</h1>

        <div className="top-navbar-right">
          <IoMdNotificationsOutline className="navbar-icon" />
          <AiOutlineSetting className="navbar-icon" />
          <BsQuestionCircle className="navbar-icon" />

          <div className="navbar-profile" onClick={toggleEmailBox}>
            <span className="navbar-email">{userFirstName || "Guest"}</span>
            <div className="navbar-email-icon"><VscAccount /></div>
          </div>
        </div>

        {showEmailBox && (
          <div className="email-box">
            <span className="email-text">{email || "No Email"}</span>

            <button className="view-account" onClick={handleViewAccount}>
              View account <FaExternalLinkAlt className="external-icon" />
            </button>

            <button className="logout-button" onClick={handleLogout}>
              Sign out
            </button>
          </div>
        )}
      </div>

    </div>
  );
}

export default Navbar;
