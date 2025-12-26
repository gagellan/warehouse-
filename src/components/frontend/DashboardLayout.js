import React, { useState } from "react";
import Navbar from "./Navbar";

const DashboardLayout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="dashboard-layout">
      {/* Navbar contains sidebar + top menu */}
      <Navbar onCollapseChange={setSidebarCollapsed} />

      {/* Main content */}
      <div className={`dashboard-content ${sidebarCollapsed ? "collapsed" : ""}`}>
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
