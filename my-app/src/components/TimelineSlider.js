import React, { useState } from "react";
import { Slider, TextField } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import dayjs from "dayjs";
import "./TimeSlider.css";
import { CiFilter } from "react-icons/ci";

const hours = Array.from({ length: 24 }, (_, i) => ({ value: i, label: i })); // Marks for hours

const TimeSlider = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs("2021-05-27"));
  const [selectedTime, setSelectedTime] = useState(13); // Default: 1 PM

  const formatLabel = (value) => {
    const hour = value % 12 || 12;
    const period = value >= 12 ? "PM" : "AM";
    return `${hour}:00 ${period}`;
  };

  return (
    <div className="time-slider-container .css-xvk2i-MuiSlider-track">
      {/* Date Picker */}
      <div className="date-picker">
      <CiFilter />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            value={selectedDate}
            onChange={(newDate) => setSelectedDate(newDate)}
            renderInput={(params) => <TextField {...params} size="small" />}
          />
        </LocalizationProvider>
      </div>

      {/* Timeline Slider */}
      <div className="slider-container">
        <Slider
          value={selectedTime}
          onChange={(e, value) => setSelectedTime(value)}
          step={1}
          marks={hours} // Display numbers below
          min={1}
          max={24}
          valueLabelDisplay="auto"
          valueLabelFormat={formatLabel}
        />
      </div>
    </div>
  );
};

export default TimeSlider;

