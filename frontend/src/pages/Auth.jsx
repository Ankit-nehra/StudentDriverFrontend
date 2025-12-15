import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

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
        data = {
          rollno: form.rollno,
          password: form.password,
        };
        if (!isLogin) {
          data.name = form.name;
          data.course = form.course;
        }
      } else {
        data = {
          vehicleNo: form.vehicleNo,
          password: form.password,
        };
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={submitHandler}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">
          {isLogin ? "Login" : "Signup"} as {role}
        </h2>

        {/* Name (Signup only) */}
        {!isLogin && (
          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="input mb-2"
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
              className="input mb-2"
              required
            />
            {!isLogin && (
              <input
                name="course"
                placeholder="Course"
                value={form.course}
                onChange={handleChange}
                className="input mb-2"
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
              className="input mb-2"
              required
            />
            {!isLogin && (
              <input
                name="location"
                placeholder="Location"
                value={form.location}
                onChange={handleChange}
                className="input mb-2"
                required
              />
            )}
          </>
        )}

        {/* Password (Login & Signup) */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="input mb-2"
          required
        />

        {/* Confirm Password (Signup Only) */}
        {!isLogin && (
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            className="input mb-2"
            required
          />
        )}

        <button className="bg-black text-white w-full py-2 rounded mt-4">
          {isLogin ? "Login" : "Signup"}
        </button>

        <p
          onClick={() => setIsLogin(!isLogin)}
          className="text-center mt-4 text-blue-600 cursor-pointer"
        >
          {isLogin ? "Create Account" : "Already have an account?"}
        </p>
      </form>
    </div>
  );
}

