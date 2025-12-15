import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import GroupChat from "../Component/GroupChat";
import { io } from "socket.io-client";

const socket = io("https://studentdriverbackend-3.onrender.com");

export default function StudentDashboard() {
  const location = useLocation();
  const { name, rollno, course } = location.state || {};

  const [onlineStudents, setOnlineStudents] = useState([]);
  const [onlineDrivers, setOnlineDrivers] = useState([]);

  useEffect(() => {
    if (!name || !rollno) return;

    // ✅ UPDATED: course bhi join event me bheja
    socket.emit("join", {
      name,
      rollno,
      course,
      role: "student",
    });

    socket.on("onlineStudents", (students) => {
      setOnlineStudents(students);
    });

    socket.on("onlineDrivers", (drivers) => {
      setOnlineDrivers(drivers);
    });

    return () => {
      socket.off("onlineStudents");
      socket.off("onlineDrivers");
    };
  }, [name, rollno, course]);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6">Student Dashboard</h1>

      {/* Student Info */}
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md mb-6">
        <p><strong>Name:</strong> {name || "N/A"}</p>
        <p><strong>Roll No:</strong> {rollno || "N/A"}</p>
        <p><strong>Course:</strong> {course || "N/A"}</p>
      </div>

      {/* Online Students */}
      <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-md mb-6">
        <h2 className="text-xl font-bold mb-2">
          Currently Online Students ({onlineStudents.length})
        </h2>

        {onlineStudents.length === 0 ? (
          <p className="text-gray-500">No other students online</p>
        ) : (
          <ul className="space-y-2">
            {onlineStudents.map((s) => (
              <li key={s.rollno} className="border p-2 rounded bg-gray-50">
                <p><strong>Name:</strong> {s.name}</p>
                <p><strong>Roll No:</strong> {s.rollno}</p>
                <p><strong>Course:</strong> {s.course || "N/A"}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <GroupChat name={name} rollno={rollno} role="student" />

      {/* Online Drivers */}
      <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-md mt-6">
        <h2 className="text-xl font-bold mb-2">
          Currently Online Drivers ({onlineDrivers.length})
        </h2>

        {onlineDrivers.length === 0 ? (
          <p className="text-gray-500">No drivers online</p>
        ) : (
          <ul className="space-y-2">
            {onlineDrivers.map((d) => (
              <li key={d.rollno} className="border p-2 rounded bg-gray-50">
                <p><strong>Name:</strong> {d.name}</p>
                <p><strong>Vehicle No:</strong> {d.rollno}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

