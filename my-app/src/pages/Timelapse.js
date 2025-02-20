import React, { useState } from "react";
import "../App.css";

const Timelapse = () => {
  const [selectedDate, setSelectedDate] = useState("2022-06-13");
  const [selectedPanel, setSelectedPanel] = useState("Tata Raipur Warehouse");

  // Dummy camera data
  const cameraData = [
    { id: 1, videoSrc: "https://www.w3schools.com/html/mov_bbb.mp4", available: true },
    { id: 2, videoSrc: "", available: false },
    { id: 3, videoSrc: "https://www.w3schools.com/html/mov_bbb.mp4", available: true },
    { id: 4, videoSrc: "", available: false },
    { id: 5, videoSrc: "", available: false },
    { id: 6, videoSrc: "", available: false },
    { id: 7, videoSrc: "", available: false },
    { id: 8, videoSrc: "", available: false },
    { id: 9, videoSrc: "", available: false },
    { id: 10, videoSrc: "", available: false },
    { id: 11, videoSrc: "", available: false },

  ];

  return (
    <div className="timelapse-container">
      {/* Header Controls */}
      <div className="header-controls">
        <div className="dropdowns">
          <label>Select Date:</label>
          <TimelapseSelect value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}>
            <option value="2022-06-13">13 Jun 2022</option>
            <option value="2022-06-14">14 Jun 2022</option>
            <option value="2022-06-14">15 Jun 2022</option>
            <option value="2022-06-14">16 Jun 2022</option>
            <option value="2022-06-14">17 Jun 2022</option>
            <option value="2022-06-14">18 Jun 2022</option>
            <option value="2022-06-14">19 Jun 2022</option>
          </TimelapseSelect>

          <label>Select Panel:</label>
          <TimelapseSelect value={selectedPanel} onChange={(e) => setSelectedPanel(e.target.value)}>
            <option value="Tata Central Warehouse Nagpur">Tata Central Warehouse Nagpur</option>
            <option value="Tata Dharwad Facility">Tata Dharwad Facility</option>
            <option value="Tata East Regional Warehouse">Tata East Regional Warehouse</option>
            <option value="Tata Raipur Warehouse">Tata Raipur Warehouse</option>

            <option value="Other Panel">Other Panel</option>
          </TimelapseSelect>
        </div>

        {/* Buttons */}
        <div className="action-buttons">
          <TimelapseButton onClick={() => window.location.reload()}>Refresh</TimelapseButton>
          <TimelapseButton>Export to Excel</TimelapseButton>
        </div>
      </div>

      {/* Camera Grid */}
      <div className="camera-grid">
        {cameraData.map((camera) => (
          <TimelapseCard key={camera.id} title={`CAM ${camera.id}`} videoSrc={camera.videoSrc} available={camera.available} />
        ))}
      </div>
    </div>
  );
};

// UI Components
const TimelapseButton = ({ children, ...props }) => (
  <button {...props} className="timelapse-button">
    {children}
  </button>
);

const TimelapseCard = ({ title, videoSrc, available }) => (
  <div className="timelapse-card">
    {available ? (
      <video controls className="video-player">
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    ) : (
      <div className="no-video">No Video Available</div>
    )}
    <h3 className="camera-title">{title}</h3>
    <p className="timestamp">13 Jun 2022 12:00 AM - 14 Jun 2022 12:00 AM</p>
  </div>
);

const TimelapseSelect = ({ children, ...props }) => (
  <select {...props} className="timelapse-select">
    {children}
  </select>
);

export default Timelapse;
