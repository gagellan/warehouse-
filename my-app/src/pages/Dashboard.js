import React, { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";
import Navbar from "./Navbar"; // Import the Navbar component
import TopNavbar from "./TopNavbar"; // Import the TopNavbar component
import "../App.css"; // Import global styles

function Dashboard() {
  // References for the chart canvas elements
  const categoryChartRef = useRef(null);
  const statusChartRef = useRef(null);
  const categoryChartInstance = useRef(null);
  const statusChartInstance = useRef(null);

  useEffect(() => {
    // Data for charts
    const data = [
      { Category: "Category A", Count: 30 },
      { Category: "Category B", Count: 50 },
      { Category: "Category C", Count: 20 },
      { Category: "Category D", Count: 40 },
    ];

    const statusData = [
      { Date: "2023-01-01", Status: "Open", Count: 10 },
      { Date: "2023-01-01", Status: "WIP", Count: 15 },
      { Date: "2023-01-01", Status: "Closed", Count: 5 },
      { Date: "2023-01-02", Status: "Open", Count: 20 },
      { Date: "2023-01-02", Status: "WIP", Count: 10 },
      { Date: "2023-01-02", Status: "Closed", Count: 8 },
    ];

    // Destroy existing charts if they exist
    if (categoryChartInstance.current) {
      categoryChartInstance.current.destroy();
    }
    if (statusChartInstance.current) {
      statusChartInstance.current.destroy();
    }

    // Create the Category Chart
    const ctx1 = categoryChartRef.current.getContext("2d");
    categoryChartInstance.current = new Chart(ctx1, {
      type: "bar",
      data: {
        labels: data.map((item) => item.Category),
        datasets: [
          {
            label: "Tickets",
            data: data.map((item) => item.Count),
            backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
        },
      },
    });

    // Create the Status Chart
    const dates = [...new Set(statusData.map((item) => item.Date))];
    const statusTypes = ["Open", "WIP", "Closed"];
    const datasets = statusTypes.map((status) => ({
      label: status,
      data: dates.map((date) =>
        statusData
          .filter((item) => item.Date === date && item.Status === status)
          .reduce((sum, curr) => sum + curr.Count, 0)
      ),
      borderColor: status === "Open" ? "#FF6384" : status === "WIP" ? "#36A2EB" : "#FFCE56",
      fill: false,
    }));

    const ctx2 = statusChartRef.current.getContext("2d");
    statusChartInstance.current = new Chart(ctx2, {
      type: "line",
      data: {
        labels: dates,
        datasets: datasets,
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
        },
      },
    });

    // Cleanup function to destroy charts on unmount or before re-render
    return () => {
      if (categoryChartInstance.current) {
        categoryChartInstance.current.destroy();
      }
      if (statusChartInstance.current) {
        statusChartInstance.current.destroy();
      }
    };
  }, []); // Empty dependency array ensures the effect runs only once

  return (
    
      <div className="dashboard">
        <div className="cards">
          <div className="card">
            <p>Active Sites</p>
            <h2>10</h2>
            <p className="red-text">41 inactive sites</p>
          </div>
          <div className="card">
            <p>Total Images</p>
            <h2>2000</h2>
            <p className="blue-text">Today's Images: 300</p>
          </div>
          <div className="card">
            <p>Total Ticket Summary</p>
            <h3>Open: 50</h3>
            <h3>WIP: 30</h3>
          </div>
          <div className="card">
            <p>Today's Ticket Status</p>
            <h3>Open: 20</h3>
            <h3>Closed: 10</h3>
          </div>
        </div>
        <div className="charts">
          <div className="chart-container">
            <canvas ref={categoryChartRef} id="categoryChart"></canvas>
          </div>
          <div className="chart-container">
            <canvas ref={statusChartRef} id="statusChart"></canvas>
          </div>
        </div>
      </div>
  );
}

export default Dashboard;