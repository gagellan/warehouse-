import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../App.css"; // Import global styles
import { ImgComparisonSlider } from '@img-comparison-slider/react';
import img1 from "../assets/Screenshot (8).png";
import img2 from "../assets/Screenshot (9).png";

function CompareImages() {
  // State for datetime pickers
  const [startDateTime, setStartDateTime] = useState(new Date());
  const [endDateTime, setEndDateTime] = useState(new Date());

  // State for dropdown menus
  const [selectedPanel, setSelectedPanel] = useState("");
  const [selectedChannel, setSelectedChannel] = useState("");

  // Channel options based on panel selection
  const panelChannelMapping = {
    "Tata Dharwad Facility": ["CAM_ID_1", "CAM_ID_2", "CAM_ID_3"],
    "Tata Central Warehouse Nagpur": ["CAM_ID_4", "CAM_ID_5", "CAM_ID_6"],
    "Tata East Regional Warehouse": ["CAM_ID_7", "CAM_ID_8", "CAM_ID_9"],
    "Tata Raipur Warehouse": ["CAM_ID_10", "CAM_ID_11", "CAM_ID_12"],
  };

  const handlePanelChange = (e) => {
    const selectedPanel = e.target.value;
    setSelectedPanel(selectedPanel);

    // Reset channel selection when panel changes
    setSelectedChannel("");
  };

  const handleCompare = () => {
    console.log("Start DateTime:", startDateTime);
    console.log("End DateTime:", endDateTime);
    console.log("Selected Panel:", selectedPanel);
    console.log("Selected Channel:", selectedChannel);
  };

  return (
    <div>
      <div className="compareimages-container">
        <div className="compareimages-form-container">
          {/* Start DateTime Picker */}
          <div className="compareimages-input-group">
            <label htmlFor="start-datetime">Start Date & Time:</label>
            <DatePicker
              selected={startDateTime}
              onChange={(date) => setStartDateTime(date)}
              showTimeSelect
              dateFormat="Pp"
            />
          </div>

          {/* End DateTime Picker */}
          <div className="compareimages-input-group">
            <label htmlFor="end-datetime">End Date & Time:</label>
            <DatePicker
              selected={endDateTime}
              onChange={(date) => setEndDateTime(date)}
              showTimeSelect
              dateFormat="Pp"
            />
          </div>

          {/* Panel Dropdown */}
          <div className="compareimages-input-group">
            <label htmlFor="panel-dropdown">Select Panel:</label>
            <select
              id="panel-dropdown"
              value={selectedPanel}
              onChange={handlePanelChange}
            >
              <option value="" disabled>
                -- Select a Panel --
              </option>
              {Object.keys(panelChannelMapping).map((panel) => (
                <option key={panel} value={panel}>
                  {panel}
                </option>
              ))}
            </select>
          </div>

          {/* Channel Dropdown */}
          <div className="compareimages-input-group">
            <label htmlFor="channel-dropdown">Select Channel:</label>
            <select
              id="channel-dropdown"
              value={selectedChannel}
              onChange={(e) => setSelectedChannel(e.target.value)}
              disabled={!selectedPanel}
            >
              <option value="" disabled>
                -- Select a Channel --
              </option>
              {selectedPanel &&
                panelChannelMapping[selectedPanel].map((channel) => (
                  <option key={channel} value={channel}>
                    {channel}
                  </option>
                ))}
            </select>
          </div>

          {/* Submit/Compare Button */}
          <button className="compareimagesbtn" onClick={handleCompare}>Compare</button>
        </div>
      </div>
      <div className="compareimages-overlaycard">
        <ImgComparisonSlider>
          <img slot="first" src={img1} />
          <img slot="second" src={img2} />
        </ImgComparisonSlider>
      </div>
    </div>
  );
}

export default CompareImages;