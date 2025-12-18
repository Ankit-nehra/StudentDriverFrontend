import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png"; // Make sure your logo is in this path

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 transition-colors duration-300">
      
      {/* Big Logo */}
      <div className="mb-12 flex flex-col items-center">
        <img src={logo} alt="Logo" className="h-32 w-32 md:h-48 md:w-48 object-contain mb-6" />
        <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-gray-100 text-center leading-snug">
          Welcome to Autoriksha Booking Site
        </h1>
      </div>

      {/* Buttons */}
      <div className="flex flex-col md:flex-row gap-6 w-full max-w-lg">
        <button
          onClick={() => navigate("/auth/student")}
          className="flex-1 bg-blue-600 dark:bg-blue-500 text-white py-5 md:py-6 rounded-2xl text-xl font-semibold shadow-lg transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 hover:bg-blue-700 dark:hover:bg-blue-600"
        >
          I am a Student
        </button>

        <button
          onClick={() => navigate("/auth/driver")}
          className="flex-1 bg-green-600 dark:bg-green-500 text-white py-5 md:py-6 rounded-2xl text-xl font-semibold shadow-lg transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 hover:bg-green-700 dark:hover:bg-green-600"
        >
          I am a Driver
        </button>
      </div>

      {/* Optional Footer Text */}
      <p className="mt-16 text-gray-700 dark:text-gray-300 text-center max-w-xl text-lg">
        Connect with drivers and students seamlessly. Book autorickshaws quickly and efficiently with our real-time platform.
      </p>
    </div>
  );
}
