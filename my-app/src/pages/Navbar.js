import React, { useState } from 'react';
import '../App.css'; // Import global styles
import logo from '../assets/logo.jpg';
import { useLocation } from "react-router-dom";

import { IoHomeOutline } from "react-icons/io5";
import { IoImagesOutline } from "react-icons/io5";
import { MdOutlineCompare } from "react-icons/md";
import { MdOutlineTimelapse } from "react-icons/md";
import { TbReportAnalytics } from "react-icons/tb";
import { MdOutlineLogout } from "react-icons/md";
import { MdKeyboardArrowDown } from "react-icons/md";
import { TbClockHour5Filled } from "react-icons/tb";
import { MdOutlineToday } from "react-icons/md";
import { LuInfinity } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { FaTruck } from "react-icons/fa6";
import { IoMdNotificationsOutline } from "react-icons/io";
import { AiOutlineSetting } from "react-icons/ai";
import { BsQuestionCircle } from "react-icons/bs";
import { VscAccount } from "react-icons/vsc";
import userImage from '../assets/user.jpg'; // Add user image

function Navbar() {



  const location = useLocation();
  
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
      "/vehicledashboard": "VEHICLE DASHBOARD"
    };
  
    const currentPage = pageTitles[location.pathname];


  const [dropdownOpen, setDropdownOpen] = useState(false); // State for dropdown
  const [sideMenuOpen, setSideMenuOpen] = useState(false); // State for side menu
  const navigate = useNavigate();

  return (
    <div>
      <div className={`dashboardnav-sidebar ${sideMenuOpen ? 'open' : ''}`}>
        <button className="close-button" onClick={() => setSideMenuOpen(false)}>☰</button>
        {/* <div className="user-info">
          <img src={userImage} alt="User" className="user-image" />
          <span className="username">John Doe</span>
        </div> */}
        <ul className="dashboardnav-SidebarList">
          {/* Dashboard */}
          <li
            className="dashboardnav-row"
            id={window.location.pathname === '/dashboard' ? 'dashboardnav-active' : ''}
            onClick={() => navigate('/dashboard')}
          >
            <div id="dashboardnav-icon"><IoHomeOutline /></div>
            <div id="dashboardnav-title">Dashboard</div>
          </li>

          {/* Images with Dropdown */}
          <li className="dashboardnav-row"
              id={window.location.pathname.startsWith('/images') ? 'dashboardnav-active' : ''}
              onClick={() => setDropdownOpen(!dropdownOpen)}
              >
            <div id="dashboardnav-icon"><IoImagesOutline /></div>
            <div id="dashboardnav-title">Gallery</div>
            <div id="dashboardnav-arrow"  className={dropdownOpen ? 'dashboardnav-rotate' : ''} ><MdKeyboardArrowDown /></div>
          </li>
          {dropdownOpen && (
            <ul className="dashboardnav-nested-list">
            <li
              className="dashboardnav-nested-item"
              onClick={() => navigate('/images/hourwise')}
            >
              <span className="dashboardnav-nested-icon"><TbClockHour5Filled /></span> Hour Wise
            </li>
            <li
              className="dashboardnav-nested-item"
              onClick={() => navigate('/images/daywise')}
            >
              <span className="dashboardnav-nested-icon"><MdOutlineToday /></span> Day Wise
            </li>
            <li
              className="dashboardnav-nested-item"
              onClick={() => navigate('/images/custom')}
            >
              <span className="dashboardnav-nested-icon"><LuInfinity /></span> Custom
            </li>
          </ul>
          )}

          {/* Compare Images */}
          <li
            className="dashboardnav-row"
            id={window.location.pathname === '/compareimages' ? 'dashboardnav-active' : ''}
            onClick={() => navigate('/compareimages')}
          >
            <div id="dashboardnav-icon"><MdOutlineCompare /></div>
            <div id="dashboardnav-title">Compare Images</div>
          </li>

          <li
            className="dashboardnav-row"
            id={window.location.pathname === '/timelapse' ? 'dashboardnav-active' : ''}
            onClick={() => navigate('/timelapse')}
          >
            <div id="dashboardnav-icon"><MdOutlineTimelapse /></div>
            <div id="dashboardnav-title">Timelapse</div>
          </li>

          <li
            className="dashboardnav-row"
            id={window.location.pathname === '/reports' ? 'dashboardnav-active' : ''}
            onClick={() => navigate('/reports')}
          >
            <div id="dashboardnav-icon"><TbReportAnalytics /></div>
            <div id="dashboardnav-title">Reports</div>
          </li>

          <li
            className="dashboardnav-row"
            id={window.location.pathname === '/vehicledashboard' ? 'dashboardnav-active' : ''}
            onClick={() => navigate('/vehicledashboard')}
          >
            <div id="dashboardnav-icon"><FaTruck /></div>
            <div id="dashboardnav-title">Vehicle Dashboard</div>
          </li>

          <li
            className="dashboardnav-row"
            id={window.location.pathname === '/login' ? 'dashboardnav-active' : ''}
            onClick={() => navigate('/login')}
          >
            <div id="dashboardnav-icon"><MdOutlineLogout /></div>
            <div id="dashboardnav-title">Logout</div>
          </li>
        </ul>
      </div>

      {/* Top Navbar */}
      <div className="top-navbar">
        <button className="menu-button" onClick={() => setSideMenuOpen(true)}>☰</button>
        <h1>{currentPage}</h1>

        {/* Right Side Icons and Profile */}
        <div className="top-navbar-right">
          <IoMdNotificationsOutline className="navbar-icon" />
          <AiOutlineSetting className="navbar-icon" />
          <BsQuestionCircle className="navbar-icon" />

          <div className="navbar-profile">
            <span className="navbar-email">ramaksccL@gmail.com</span>
            {/* <MdKeyboardArrowDown className="navbar-dropdown-icon" /> */}
            <div className="navbar-email-icon"><VscAccount /></div>
            {/* <img src={userImage} alt="User" className="navbar-user-image" /> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;