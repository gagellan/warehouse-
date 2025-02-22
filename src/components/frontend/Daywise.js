import React, { useState, useEffect } from "react";
import "../../assets/css/App.css";
import TimeSlider from "./TimelineSlider.js";


const timeframes = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const tags = ["P1", "T2", "C1", "A3"]; // Random tags

const Daywise = () => {
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const today = new Date().toDateString();
    setCurrentDate(today);
  }, []);

  return (
    <div className="image-dashboard">
      <TimeSlider />
      <header className="image-dashboard-header">February, 2025</header>
      <div className="image-camera-grid">
        {[1, 2, 3, 5, 6, 7, 8, 9].map((row) => (
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

export default Daywise;