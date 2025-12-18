import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import GroupChat from "../Component/GroupChat";
import socket from "../utils/socket";
import { setTheme } from "../utils/theme";

export default function StudentDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const { name, rollno, course } = location.state || {};

  const [onlineStudents, setOnlineStudents] = useState([]);
  const [onlineDrivers, setOnlineDrivers] = useState([]);
  const [theme, setThemeState] = useState("light");

  // Mobile toggle states
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [onlineStudentsOpen, setOnlineStudentsOpen] = useState(false);
  const [onlineDriversOpen, setOnlineDriversOpen] = useState(false);

  useEffect(() => {
    if (!name || !rollno) {
      navigate("/");
      return;
    }

    if (!socket.connected) socket.connect();

    socket.emit("join", {
      name,
      rollno,
      course,
      role: "student",
    });

    socket.on("onlineStudents", setOnlineStudents);
    socket.on("onlineDrivers", setOnlineDrivers);

    return () => {
      socket.off("onlineStudents");
      socket.off("onlineDrivers");
    };
  }, [name, rollno, course, navigate]);

  useEffect(() => {
    setTheme(theme);
  }, [theme]);

  const handleLogout = () => {
    socket.disconnect();
    navigate("/");
  };

  const isMobile = window.innerWidth < 768;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-4 md:p-6">

      {/* Header */}
      <div className="max-w-7xl mx-auto flex justify-between items-center bg-white dark:bg-gray-800 shadow-lg rounded-2xl px-6 py-4 mb-6">
        <h1 className="text-2xl font-bold">🎓 Student Dashboard</h1>

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

      {/* Student Info (Desktop) */}
      <div className="hidden md:block max-w-7xl mx-auto bg-white dark:bg-gray-800 shadow rounded-2xl p-6 mb-6">
        <h2 className="text-lg font-semibold mb-3">Student Information</h2>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <p><strong>Name:</strong> {name}</p>
          <p><strong>University_ID:</strong> {rollno}</p>
          <p><strong>Course:</strong> {course}</p>
        </div>
      </div>

      {/* Chat Section */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">

        {/* Left Aside: Online Students */}
        <div
          className={`md:col-span-1 bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-4 overflow-y-auto transition-all duration-300`}
          style={{
            height: isMobile
              ? onlineStudentsOpen
                ? "550px" // expanded height
                : "50px" // collapsed height
              : "550px", // desktop/laptop height
          }}
        >
          {/* Mobile: toggle header */}
          <h3
            className="text-lg font-semibold mb-4 md:mb-4 flex justify-between items-center cursor-pointer md:cursor-auto"
            onClick={() => isMobile && setOnlineStudentsOpen(!onlineStudentsOpen)}
          >
            Online Students ({onlineStudents.length})
            {isMobile && <span>{onlineStudentsOpen ? "▲" : "▼"}</span>}
          </h3>

          {/* List */}
          <ul className={`space-y-4 overflow-y-auto ${isMobile && !onlineStudentsOpen ? "hidden" : "block"}`}>
            {onlineStudents.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No students online
              </p>
            ) : (
              onlineStudents.map((s) => (
                <li
                  key={s.rollno}
                  className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700 hover:shadow-md transition"
                >
                  <p><strong>Name:</strong> {s.name}</p>
                  <p><strong>University_ID:</strong> {s.rollno}</p>
                  <p><strong>Course:</strong> {s.course}</p>
                </li>
              ))
            )}
          </ul>
        </div>

        {/* Group Chat */}
        <div className="md:col-span-3 h-[550px]">
          <GroupChat name={name} rollno={rollno} role="student" />
        </div>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-40 md:hidden" onClick={() => setSidebarOpen(false)}></div>
        )}

        {/* Mobile Sidebar (Student Info) */}
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

          <h2 className="text-lg font-semibold mb-4">Student Information</h2>
          <div className="grid gap-2 text-sm">
            <p><strong>Name:</strong> {name}</p>
            <p><strong>University_ID:</strong> {rollno}</p>
            <p><strong>Course:</strong> {course}</p>
          </div>

          <button
            onClick={handleLogout}
            className="mt-6 w-full py-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Online Drivers */}
      <div
        className="max-w-7xl mx-auto bg-white dark:bg-gray-800 shadow rounded-2xl p-6 mt-6 transition-all duration-300 overflow-y-auto"
        style={{
          height: isMobile
            ? onlineDriversOpen
              ? "auto" // expand to full content
              : "50px" // collapsed height
            : "auto",
        }}
      >
        <h2
          className="text-lg font-semibold mb-4 flex justify-between items-center cursor-pointer md:cursor-auto"
          onClick={() => isMobile && setOnlineDriversOpen(!onlineDriversOpen)}
        >
          Online Drivers ({onlineDrivers.length})
          {isMobile && <span>{onlineDriversOpen ? "▲" : "▼"}</span>}
        </h2>

        <div className={`${isMobile && !onlineDriversOpen ? "hidden" : "block"}`}>
          {onlineDrivers.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No drivers online</p>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {onlineDrivers.map((d) => (
                <div
                  key={d.rollno}
                  className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700"
                >
                  <p className="font-semibold">{d.name}</p>
                  <p className="text-sm">Vehicle No: {d.rollno}</p>
                  <p className="text-sm">Location: {d.location}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
