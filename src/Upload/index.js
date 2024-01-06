import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import { parse } from "date-fns";
import "./style.css";

const Upload = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dateError, setDateError] = useState("");
  const [dates, setDates] = useState([]);
  const navigate = useNavigate();

  const highlightDates = dates.map((dateString) => {
    const date = parse(dateString, "yyyy-MM-dd", new Date());
    return date;
  });

  const handleDateChange = (originalDate) => {
    setSelectedDate(originalDate);
    setDateError("");
  };

  const handleShowPreview = async () => {
    if (!selectedDate) {
      setDateError("Please select a date.");
      return;
    }

    if (selectedDate) {
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, "0"); // Months are zero-based
      const day = String(selectedDate.getDate()).padStart(2, "0");

      const formattedDate = `${year}-${month}-${day}`;
      navigate("/preview", {
        state: { formattedDate },
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://clientadminbackend.onrender.com/media/api/dates"
        );
        if (response.ok) {
          const data = await response.json();
          setDates(data.dates);
        } else {
          console.error("Failed to fetch dates");
        }
      } catch (error) {
        console.error("Error during date fetch:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="upload-container">
      <label className="upload-label">
        <span className="upload-text">Select Date:</span>
        <DatePicker
          className="upload-input"
          selected={selectedDate}
          onChange={handleDateChange}
          highlightDates={highlightDates}
          required
        />
        <div style={{ color: "red" }}>{dateError}</div>
      </label>
      <br />
      <label className="upload-label">
        <span className="upload-text">Select Media:</span>
      </label>
      <br />
      <button className="preview-button" onClick={handleShowPreview}>
        <span className="preview-btn-text">Show Preview</span>
      </button>
    </div>
  );
};

export default Upload;
