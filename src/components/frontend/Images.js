import React, { useState, useEffect } from "react";
import "../../assets/css/App.css";
import TimeSlider from "./TimelineSlider";

const timeframes = ["07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00"];
const tags = ["P1", "T2", "C1", "A3"]; // Random tags

const SurveillanceDashboard = () => {
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const today = new Date().toDateString();
    setCurrentDate(today);
  }, []);

  return (
    <div className="image-dashboard">
      <TimeSlider />
      <header className="image-dashboard-header">{currentDate}</header>
      <div className="image-camera-grid">
        {[1, 2, 3, 4].map((row) => (
          <div key={row} className="image-camera-row">
            {timeframes.map((time, index) => (
              <div key={index} className="image-camera-card">
                <img src="https://via.placeholder.com/150" />
                <div className="image-timestamp">{time}</div>
                {Math.random() > 0.6 && (
                  <span className={`image-tag image-tag-${index % tags.length}`}>{tags[index % tags.length]}</span>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SurveillanceDashboard;