import React, { useState, useEffect } from "react";
import "../../assets/css/App.css";
import { FaEdit } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";
import { ImBin2 } from "react-icons/im";

const VehicleDashboard = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [vehicles, setVehicles] = useState([
        { number: "TS 08 JP 9444", warehouse: "WH001", gate: "Gate1", status: "Registered" },
        { number: "TS 09 MN 2398", warehouse: "WH002", gate: "Gate2", status: "Unregistered" },
    ]);
    const [allVehicles, setAllVehicles] = useState([
        { number: "TS 07 UD 0500", npr: "plate.jpg", inTime: "2024-09-10 14:23:57", warehouse: "WH001", location: "Swarna Giri, HYD", status: "Active" },
        { number: "TS 08 UE 7016", npr: "plate2.jpg", inTime: "2024-08-10 09:27:37", warehouse: "WH001", location: "Miyapur, HYD", status: "Inactive" },
    ]);

    return (
        <div className="vehicle-dashboard">
            {/* Header */}
            {/* <header className="vehicle-header">
                <div className="vehicle-logo">
                    <img src="logo.png" alt="Logo" />
                </div>
                <input
                    type="text"
                    placeholder="Search..."
                    className="vehicle-search-bar"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="vehicle-icons">
                    <i className="fa fa-user"></i>
                    <i className="fa fa-bell"></i>
                    <i className="fa fa-cog"></i>
                </div>
            </header> */}

            {/* Stats Section */}
            <section className="vehicle-stats">
                <div className="vehicle-stat-box"> <h3>75</h3> <p>Total Vehicles</p> </div>
                <div className="vehicle-stat-box"> <h3>57</h3> <p>Vehicles On-Run</p> </div>
                <div className="vehicle-stat-box"> <h3>9</h3> <p>Vehicles In-House</p> </div>
                <div className="vehicle-stat-box"> <h3>32</h3> <p>Total Trips Today</p> </div>
                <div className="vehicle-stat-box">
                    <p>Vehicle Flow</p>
                    <div className="vehicle-chart"></div>
                </div>
            </section>

            {/* Vehicle Info */}
            <section className="vehicle-info">
                <div className="vehicle-image-grid">
                    <img src="/truck.jfif" alt="Vehicles in parking" />
                    <img src="/truck1.jfif" alt="Loaded truck" />
                </div>
                <div className="vehicle-list">
                    <input type="text" placeholder="Search" className="vehicle-search" />
                    <table>
                        <thead>
                            <tr>
                                <th>Vehicle No</th>
                                <th>Warehouse No</th>
                                <th>Gate</th>
                                <th>Vehicle Info</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vehicles.map((vehicle, index) => (
                                <tr key={index}>
                                    <td>{vehicle.number}</td>
                                    <td>{vehicle.warehouse}</td>
                                    <td>{vehicle.gate}</td>
                                    <td>
                                        <span className={`vehicle-status ${vehicle.status.toLowerCase()}`}>
                                            {vehicle.status}
                                        </span>
                                    </td>
                                    <td>
                                        <FaEdit style={{ marginRight: "6px" , font: "40px"}} />
                                        {vehicle.status === "Registered" ? (
                                            <FaCheckCircle style={{ marginLeft: "6px" , font: "40px"}} />
                                        ) : (
                                            <ImBin2 style={{ marginLeft: "6px" , font: "40px"}} />
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* All Vehicles */}
            <section className="vehicle-all-vehicles">
                <h3>All Vehicles</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Vehicle Number</th>
                            <th>NPR</th>
                            <th>In-Time</th>
                            <th>Warehouse No</th>
                            <th>Location</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allVehicles.map((vehicle, index) => (
                            <tr key={index}>
                                <td>{vehicle.number}</td>
                                <td><img src={vehicle.npr} alt="NPR" /></td>
                                <td>{vehicle.inTime}</td>
                                <td>{vehicle.warehouse}</td>
                                <td>{vehicle.location}</td>
                                <td>
                                    <span className={`vehicle-status ${vehicle.status.toLowerCase()}`}>
                                        {vehicle.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </div>
    );
};

export default VehicleDashboard;
