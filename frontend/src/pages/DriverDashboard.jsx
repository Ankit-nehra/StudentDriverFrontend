import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import GroupChat from "../Component/GroupChat";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

export default function DriverDashboard() {
  const location = useLocation();
  const { name, vehicleNo, location: driverLocation } = location.state || {};

  const [onlineDrivers, setOnlineDrivers] = useState([]);

  useEffect(() => {
    if (!name || !vehicleNo) return;

    socket.emit("join", {
      name,
      rollno: vehicleNo,
      role: "driver",
      location: driverLocation,
    });

    socket.on("onlineDrivers", (drivers) => {
      setOnlineDrivers(drivers);
    });

    return () => {
      socket.off("onlineDrivers");
    };
  }, [name, vehicleNo, driverLocation]);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6">Driver Dashboard</h1>

      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md mb-6">
        <p><strong>Name:</strong> {name || "N/A"}</p>
        <p><strong>Vehicle No:</strong> {vehicleNo || "N/A"}</p>
        <p><strong>Location:</strong> {driverLocation || "N/A"}</p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-md mb-6">
        <h2 className="text-xl font-bold mb-2">
          Currently Online Drivers ({onlineDrivers.length})
        </h2>

        {onlineDrivers.length === 0 ? (
          <p className="text-gray-500">No other drivers online</p>
        ) : (
          <ul className="space-y-2">
            {onlineDrivers.map((d) => (
              <li key={d.rollno} className="border p-2 rounded bg-gray-50">
                <p><strong>Name:</strong> {d.name}</p>
                <p><strong>Vehicle No:</strong> {d.rollno}</p>
                <p><strong>Location:</strong> {d.location || "N/A"}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <GroupChat name={name} rollno={vehicleNo} role="driver" />
    </div>
  );
}
