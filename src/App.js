import React from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import HomePage from "./components/frontend/HomePage";
import DemoPage from "./components/frontend/DemoPage";
import FreeTrialPage from "./components/frontend/FreeTrialPage";
import Login from "./components/frontend/Login"; // Import the Login component
import Register from "./components/frontend/Register"; // Import the Register component
import Dashboard from "./components/frontend/Dashboard"; // Import the Dashboard component
import SurveillanceDashboard from "./components/frontend/Images"; // Import the Images component
import CompareImages from "./components/frontend/CompareImages"; // Import the CompareImages component
import Timelapse from "./components/frontend/Timelapse"; // Import the Timelapse component
import Reports from "./components/frontend/Reports"; // Import the Reports component
import FloatingChat from "./components/frontend/FloatingChat"; // Import the Floating Chat
import DashboardLayout from "./components/frontend/DashboardLayout"; // Import the DashboardLayout component
import Daywise from "./components/frontend/Daywise"; // Import the Images component
import VehicleDashboard from "./components/frontend/VehicleDashboard";


function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/demo" element={<DemoPage />} />
        <Route path="/free-trial" element={<FreeTrialPage />} />
        <Route path="/login" element={<Login />} /> {/* Add the Login route */}
        <Route path="/register" element={<Register />} /> {/* Add the Register route */}
        <Route path="/dashboard" element={<DashboardLayout><Dashboard /></DashboardLayout>} /> {/* Add the Dashboard route */}
        <Route path="/images/hourwise" element={<DashboardLayout><SurveillanceDashboard /></DashboardLayout>} /> {/* Add the Images route */}
        <Route path="/images/daywise" element={<DashboardLayout><Daywise /></DashboardLayout>} /> {/* Add the Images route */}
        {/* <Route path="/images/uploads" element={<DashboardLayout><SurveillanceDashboard /></DashboardLayout>} /> 
        <Route path="/images/favorites" element={<DashboardLayout><SurveillanceDashboard /></DashboardLayout>} />*/} 
        <Route path="/compareimages" element={<DashboardLayout><CompareImages /></DashboardLayout>} /> 
        <Route path="/vehicledashboard" element={<DashboardLayout><VehicleDashboard /></DashboardLayout>} /> 

        <Route path="/timelapse" element={<DashboardLayout><Timelapse /></DashboardLayout>} /> 
        <Route path="/reports" element={<DashboardLayout><Reports /></DashboardLayout>} />
      </Routes>
      {/* Floating Chat Component */}
      <FloatingChat />
    </div>
  );
}

export default App;