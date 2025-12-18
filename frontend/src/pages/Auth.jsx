import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import logo from "../assets/logo.png"; // Import your logo here

export default function Auth() {
  const { role } = useParams(); // "student" or "driver"
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  const [form, setForm] = useState({
    name: "",
    rollno: "",
    course: "",
    vehicleNo: "",
    location: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!isLogin && form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      let data = {};

      if (role === "student") {
        data = { rollno: form.rollno, password: form.password };
        if (!isLogin) {
          data.name = form.name;
          data.course = form.course;
        }
      } else {
        data = { vehicleNo: form.vehicleNo, password: form.password };
        if (!isLogin) {
          data.name = form.name;
          data.location = form.location;
        }
      }

      const endpoint = `https://studentdriverbackend-3.onrender.com/api/${role}/${isLogin ? "login" : "signup"}`;
      const res = await axios.post(endpoint, data);

      alert(res.data.message);

      if (isLogin) {
        navigate(role === "student" ? "/student-dashboard" : "/driver-dashboard", {
          state: res.data.user,
        });
      } else {
        setIsLogin(true);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 transition-colors duration-300">
      <form
        onSubmit={submitHandler}
        className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-2xl w-full max-w-md space-y-6 transition-colors duration-300"
      >
        {/* Logo + Heading */}
        <div className="flex items-center justify-center mb-6 space-x-4">
          <img src={logo} alt="Logo" className="h-14 w-14 object-contain" />
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {isLogin ? "Login" : "Signup"} as {role.charAt(0).toUpperCase() + role.slice(1)}
          </h2>
        </div>

        {/* Name (Signup only) */}
        {!isLogin && (
          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
            required
          />
        )}

        {/* Student Inputs */}
        {role === "student" && (
          <>
            <input
              name="rollno"
              placeholder="University ID"
              value={form.rollno}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
              required
            />
            {!isLogin && (
              <input
                name="course"
                placeholder="Course"
                value={form.course}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
              />
            )}
          </>
        )}

        {/* Driver Inputs */}
        {role === "driver" && (
          <>
            <input
              name="vehicleNo"
              placeholder="Vehicle Number"
              value={form.vehicleNo}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
              required
            />
            {!isLogin && (
              <input
                name="location"
                placeholder="Location"
                value={form.location}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
                required
              />
            )}
          </>
        )}

        {/* Password */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
          required
        />

        {/* Confirm Password (Signup only) */}
        {!isLogin && (
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
            required
          />
        )}

        <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors duration-300">
          {isLogin ? "Login" : "Signup"}
        </button>

        <p
          onClick={() => setIsLogin(!isLogin)}
          className="text-center mt-2 text-blue-500 dark:text-blue-400 cursor-pointer hover:underline transition-colors duration-300"
        >
          {isLogin ? "Create Account" : "Already have an account?"}
        </p>
      </form>
    </div>
  );
}
