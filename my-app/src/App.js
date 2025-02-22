import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import DemoPage from "./pages/DemoPage";
import FreeTrialPage from "./pages/FreeTrialPage";
import Login from "./pages/Login"; // Import the Login component
import Register from "./pages/Register"; // Import the Register component
import Dashboard from "./pages/Dashboard"; // Import the Dashboard component
import SurveillanceDashboard from "./pages/Images"; // Import the Images component
import CompareImages from "./pages/CompareImages"; // Import the CompareImages component
import Timelapse from "./pages/Timelapse"; // Import the Timelapse component
import Reports from "./pages/Reports"; // Import the Reports component
import FloatingChat from "./components/FloatingChat"; // Import the Floating Chat
import DashboardLayout from "./pages/DashboardLayout"; // Import the DashboardLayout component
import Daywise from "./pages/Daywise"; // Import the Images component
import VehicleDashboard from "./pages/VehicleDashboard";


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