import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import GroupChat from "../Component/GroupChat";
import socket from "../utils/socket";

export default function DriverDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const { name, vehicleNo, location: driverLocation } = location.state || {};

  const [onlineDrivers, setOnlineDrivers] = useState([]);

  useEffect(() => {
    // 🚫 direct URL access protection
    if (!name || !vehicleNo) {
      navigate("/");
      return;
    }

    // 🔌 connect socket once
    if (!socket.connected) {
      socket.connect();
    }

    // 🔔 join (ONLY HERE)
    socket.emit("join", {
      name,
      rollno: vehicleNo, // 🔥 IMPORTANT: vehicleNo ko rollno ki tarah use kar rahe
      role: "driver",
      location: driverLocation,
    });

    socket.on("onlineDrivers", (drivers) => {
      setOnlineDrivers(drivers);
    });

    return () => {
      socket.off("onlineDrivers");
    };
  }, [name, vehicleNo, driverLocation, navigate]);

  const handleLogout = () => {
    socket.disconnect();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 bg-gray-100">
      <div className="w-full max-w-3xl flex justify-between mb-4">
        <h1 className="text-3xl font-bold">Driver Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <div className="bg-white p-6 w-full max-w-3xl rounded shadow-md mb-4">
        <p><strong>Name:</strong> {name}</p>
        <p><strong>Vehicle No:</strong> {vehicleNo}</p>
        <p><strong>Location:</strong> {driverLocation}</p>
      </div>

      <div className="bg-white p-4 w-full max-w-3xl rounded shadow-md mb-4">
        <h3 className="font-bold mb-2">
          Online Drivers ({onlineDrivers.length})
        </h3>

        <ul className="space-y-2 max-h-48 overflow-y-auto">
          {onlineDrivers.map((d) => (
            <li key={d.rollno} className="border p-2 rounded bg-gray-50">
              <p><strong>Name:</strong> {d.name}</p>
              <p><strong>Vehicle No:</strong> {d.rollno}</p>
              <p><strong>Location:</strong> {d.location}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* 🔥 Group Chat */}
      <GroupChat
        name={name}
        rollno={vehicleNo}
        role="driver"
      />
    </div>
  );
}
