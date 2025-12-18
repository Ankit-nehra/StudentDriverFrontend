import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import GroupChat from "../Component/GroupChat";
import socket from "../utils/socket";

export default function DriverDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const { name, vehicleNo, location: driverLocation } = location.state || {};

  const [onlineDrivers, setOnlineDrivers] = useState([]);
  const [studentNotifications, setStudentNotifications] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  // Mobile toggle states
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [onlineDriversOpen, setOnlineDriversOpen] = useState(false);

  const isMobile = window.innerWidth < 768;

  useEffect(() => {
    if (!name || !vehicleNo) {
      navigate("/");
      return;
    }

    if (!socket.connected) socket.connect();

    socket.emit("join", {
      name,
      rollno: vehicleNo,
      role: "driver",
      location: driverLocation,
    });

    socket.on("onlineDrivers", setOnlineDrivers);

    // Listen to student notifications
    socket.on("bookAuto", (student) => {
      setStudentNotifications((prev) => [student, ...prev]);
    });

    return () => {
      socket.off("onlineDrivers");
      socket.off("bookAuto");
    };
  }, [name, vehicleNo, driverLocation, navigate]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const handleLogout = () => {
    socket.disconnect();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-4 md:p-6">

      {/* Header */}
      <div className="max-w-7xl mx-auto flex justify-between items-center bg-white dark:bg-gray-800 shadow-lg rounded-2xl px-6 py-4 mb-6">
        <h1 className="text-2xl font-bold">🚍 Driver Dashboard</h1>

        <div className="hidden md:flex gap-3">
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        {/* Hamburger for mobile */}
        <div className="md:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-800 dark:text-gray-100 text-2xl font-bold"
          >
            &#9776;
          </button>
        </div>
      </div>

      {/* Driver Info (Desktop) */}
      <div className="hidden md:block max-w-7xl mx-auto bg-white dark:bg-gray-800 shadow rounded-2xl p-6 mb-4">
        <h2 className="text-lg font-semibold mb-4">Driver Information</h2>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <p><strong>Name:</strong> {name}</p>
          <p><strong>Vehicle No:</strong> {vehicleNo}</p>
          <p><strong>Location:</strong> {driverLocation}</p>
        </div>
      </div>

      {/* Student Notifications (Desktop) */}
      {!isMobile && studentNotifications.length > 0 && (
        <div className="max-w-7xl mx-auto bg-yellow-50 dark:bg-yellow-800 border-l-4 border-yellow-400 dark:border-yellow-600 shadow rounded-2xl p-4 mb-6">
          <h3 className="font-semibold mb-2">Student Book Requests:</h3>
          <ul className="space-y-2">
            {studentNotifications.map((s, idx) => (
              <li key={idx} className="text-sm">
                📣 {s.name} ({s.rollno}) requested an auto
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Chat Section */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">

        {/* Left Aside: Online Drivers */}
        <div
          className={`md:col-span-1 bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-4 overflow-y-auto transition-all duration-300`}
          style={{
            height: isMobile
              ? onlineDriversOpen
                ? "550px"
                : "50px"
              : "550px",
          }}
        >
          <h3
            className="text-lg font-semibold mb-4 md:mb-4 flex justify-between items-center cursor-pointer md:cursor-auto"
            onClick={() => isMobile && setOnlineDriversOpen(!onlineDriversOpen)}
          >
            Online Drivers ({onlineDrivers.length})
            {isMobile && <span>{onlineDriversOpen ? "▲" : "▼"}</span>}
          </h3>

          <div className={`${isMobile && !onlineDriversOpen ? "hidden" : "block"}`}>
            {onlineDrivers.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">No drivers online</p>
            ) : (
              <ul className="space-y-4">
                {onlineDrivers.map((d) => (
                  <li
                    key={d.rollno}
                    className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700 hover:shadow-md transition"
                  >
                    <p className="text-sm"><strong>Name:</strong> {d.name}</p>
                    <p className="text-sm"><strong>Vehicle No:</strong> {d.rollno}</p>
                    <p className="text-sm"><strong>Location:</strong> {d.location}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Group Chat */}
        <div className="md:col-span-3 h-[550px]">
          {/* Student Notifications (Mobile) */}
          {isMobile && studentNotifications.length > 0 && (
            <div className="bg-yellow-50 dark:bg-yellow-800 border-l-4 border-yellow-400 dark:border-yellow-600 shadow rounded-2xl p-4 mb-4">
              <h3 className="font-semibold mb-2">Student Book Requests:</h3>
              <ul className="space-y-2">
                {studentNotifications.map((s, idx) => (
                  <li key={idx} className="text-sm">
                    📣 {s.name} ({s.rollno}) requested an auto
                  </li>
                ))}
              </ul>
            </div>
          )}

          <GroupChat name={name} rollno={vehicleNo} role="driver" />
        </div>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-50 bg-black bg-opacity-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* Mobile Sidebar (Driver Info + Logout) */}
        <div
          className={`fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-gray-800 shadow-xl p-4 transform transition-transform duration-300 md:hidden
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-2xl mb-4 font-bold text-gray-800 dark:text-gray-100"
          >
            &times;
          </button>

          <h2 className="text-lg font-semibold mb-4">Driver Information</h2>
          <div className="grid gap-2 text-sm">
            <p><strong>Name:</strong> {name}</p>
            <p><strong>Vehicle No:</strong> {vehicleNo}</p>
            <p><strong>Location:</strong> {driverLocation}</p>
          </div>

          <button
            onClick={handleLogout}
            className="mt-6 w-full py-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
