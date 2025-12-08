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
import ProtectedRoute from "./components/frontend/ProtectedRoute";
import ViewAccount from "./components/frontend/ViewAccount";
import PlanDetail from "./components/frontend/PlanDetail";


function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/demo" element={<DemoPage />} />
        <Route path="/free-trial" element={<FreeTrialPage />} />
        <Route path="/login" element={<Login />} /> {/* Add the Login route */}
        <Route path="/register" element={<Register />} /> {/* Add the Register route */}
        {/* <Route path="/dashboard" element={<DashboardLayout><Dashboard /></DashboardLayout>} /> 
        <Route path="/images/hourwise" element={<DashboardLayout><SurveillanceDashboard /></DashboardLayout>} /> 
        <Route path="/images/daywise" element={<DashboardLayout><Daywise /></DashboardLayout>} />  */}
        {/* <Route path="/images/uploads" element={<DashboardLayout><SurveillanceDashboard /></DashboardLayout>} /> 
        <Route path="/images/favorites" element={<DashboardLayout><SurveillanceDashboard /></DashboardLayout>} />*/} 
        {/* <Route path="/compareimages" element={<DashboardLayout><CompareImages /></DashboardLayout>} /> 
        <Route path="/vehicledashboard" element={<DashboardLayout><VehicleDashboard /></DashboardLayout>} /> 

        <Route path="/timelapse" element={<DashboardLayout><Timelapse /></DashboardLayout>} /> 
        <Route path="/reports" element={<DashboardLayout><Reports /></DashboardLayout>} /> */}

      <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout><Dashboard /></DashboardLayout></ProtectedRoute>} />
      <Route path="/images/hourwise" element={<ProtectedRoute><DashboardLayout><SurveillanceDashboard /></DashboardLayout></ProtectedRoute>} />
      <Route path="/images/daywise" element={<ProtectedRoute><DashboardLayout><Daywise /></DashboardLayout></ProtectedRoute>} />
      <Route path="/compareimages" element={<ProtectedRoute><DashboardLayout><CompareImages /></DashboardLayout></ProtectedRoute>} />
      <Route path="/vehicledashboard" element={<ProtectedRoute><DashboardLayout><VehicleDashboard /></DashboardLayout></ProtectedRoute>} />
      <Route path="/timelapse" element={<ProtectedRoute><DashboardLayout><Timelapse /></DashboardLayout></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute><DashboardLayout><Reports /></DashboardLayout></ProtectedRoute>} />
      <Route path="/account" element={<ViewAccount />} />
      <Route path="/plan-details" element={<PlanDetail/>} />
      </Routes>
      {/* Floating Chat Component */}
      <FloatingChat />
      
    </div>
  );
}

export default App;