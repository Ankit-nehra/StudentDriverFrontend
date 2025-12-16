import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import GroupChat from "../Component/GroupChat";
import socket from "../utils/socket";

export default function StudentDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const { name, rollno, course } = location.state || {};

  const [onlineStudents, setOnlineStudents] = useState([]);
  const [onlineDrivers, setOnlineDrivers] = useState([]);

  useEffect(() => {
    // 🚫 Agar direct URL se aaye ho (no state)
    if (!name || !rollno) {
      navigate("/");
      return;
    }

    // 🔌 connect socket only once
    if (!socket.connected) {
      socket.connect();
    }

    // 🔔 join event (ONLY HERE)
    socket.emit("join", {
      name,
      rollno,
      course,
      role: "student",
    });

    // 👥 listeners
    socket.on("onlineStudents", (students) => {
      setOnlineStudents(students);
    });

    socket.on("onlineDrivers", (drivers) => {
      setOnlineDrivers(drivers);
    });

    // 🧹 cleanup
    return () => {
      socket.off("onlineStudents");
      socket.off("onlineDrivers");
    };
  }, [name, rollno, course, navigate]);

  const handleLogout = () => {
    socket.disconnect(); // user offline
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-4">
      {/* Header */}
      <div className="w-full max-w-3xl flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Student Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* Student Info */}
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-3xl mb-6">
        <p><strong>Name:</strong> {name}</p>
        <p><strong>Roll No:</strong> {rollno}</p>
        <p><strong>Course:</strong> {course}</p>
      </div>

      {/* Online Students */}
      <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-3xl mb-6">
        <h2 className="text-xl font-bold mb-2">
          Online Students ({onlineStudents.length})
        </h2>

        {onlineStudents.length === 0 ? (
          <p className="text-gray-500">No other students online</p>
        ) : (
          <ul className="space-y-2 max-h-48 overflow-y-auto">
            {onlineStudents.map((s) => (
              <li key={s.rollno} className="border p-2 rounded bg-gray-50">
                <p><strong>Name:</strong> {s.name}</p>
                <p><strong>Roll No:</strong> {s.rollno}</p>
                <p><strong>Course:</strong> {s.course}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Group Chat */}
      <GroupChat name={name} rollno={rollno} role="student" />

      {/* Online Drivers */}
      <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-3xl mt-6">
        <h2 className="text-xl font-bold mb-2">
          Online Drivers ({onlineDrivers.length})
        </h2>

        {onlineDrivers.length === 0 ? (
          <p className="text-gray-500">No drivers online</p>
        ) : (
          <ul className="space-y-2 max-h-48 overflow-y-auto">
            {onlineDrivers.map((d) => (
              <li key={d.rollno} className="border p-2 rounded bg-gray-50">
                <p><strong>Name:</strong> {d.name}</p>
                <p><strong>Vehicle No:</strong> {d.rollno}</p>
                <p><strong>Location:</strong> {d.location}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
