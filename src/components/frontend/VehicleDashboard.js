import React, { useState, useEffect } from "react";
import "../../assets/css/App.css";
import { FaEdit } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";
import { ImBin2 } from "react-icons/im";
import img1 from "../../assets/images/tr.jpg";
import img2 from "../../assets/images/truc.jpg";

const VehicleDashboard = () => {
    const [allVehicles, setAllVehicles] = useState([]);

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                console.log("🔄 Fetching vehicles...");
                const response = await fetch("http://127.0.0.1:5000/api/vehicles");

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                console.log("✅ Fetched data:", data);

                if (data && data.length > 0) {
                    const formattedVehicles = data.map((vehicle) => ({
                        number: vehicle.vehicle_number,
                        npr: vehicle.npr_image
                            ? `data:image/jpeg;base64,${vehicle.npr_image}`
                            : null,
                        inTime: vehicle.detection_time,
                        warehouse: "WH001", // Example data
                        gate: "Gate 1", // Example data
                        location: "Swarna Giri, HYD", // Example data
                        status: "Active",
                    }));
                    setAllVehicles(formattedVehicles);
                }
            } catch (error) {
                console.error("❌ Error fetching vehicles:", error);
            }
        };

        fetchVehicles();
    }, []);

    return (
        <div className="vehicle-dashboard">
            {/* Stats Section */}
            <section className="vehicle-stats">
                <div className="vehicle-stat-box"> <h3>75</h3> <p>Total Vehicles</p> </div>
                <div className="vehicle-stat-box"> <h3>57</h3> <p>Vehicles On-Run</p> </div>
                <div className="vehicle-stat-box"> <h3>9</h3> <p>Vehicles In-House</p> </div>
                <div className="vehicle-stat-box"> <h3>32</h3> <p>Total Trips Today</p> </div>
            </section>

            {/* Vehicle Info (Subset Data) */}
            <section className="vehicle-info">
                <div className="vehicle-image-grid">
                    <img src={img1} alt="Vehicles in parking" />
                    <img src={img2} alt="Loaded truck" />
                </div>
                <div className="vehicle-list">
                    <input type="text" placeholder="Search" className="vehicle-search" />
                    <table>
                        <thead>
                            <tr>
                                <th>Vehicle No</th>
                                <th>Warehouse No</th>
                                <th>Gate</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allVehicles.slice(0, 2).map((vehicle, index) => ( // ✅ Limit to first 2 rows
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
                                        <FaEdit style={{ marginRight: "6px" }} />
                                        {vehicle.status === "Registered" ? (
                                            <FaCheckCircle style={{ marginLeft: "6px" }} />
                                        ) : (
                                            <ImBin2 style={{ marginLeft: "6px" }} />
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                    </table>
                </div>
            </section>

            {/* All Vehicles (Full Data) */}
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
                                <td>
                                    {vehicle.npr ? (
                                        <img
                                            src={vehicle.npr}
                                            alt="NPR"
                                            style={{
                                                width: "80px",
                                                height: "50px",
                                                objectFit: "cover",
                                                borderRadius: "4px"
                                            }}
                                        />
                                    ) : (
                                        <span>No Image</span>
                                    )}
                                </td>
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
