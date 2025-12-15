import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">
        Welcome to Autoriksha Booking Site
      </h1>

      <div className="flex flex-col md:flex-row gap-6 w-full max-w-md">
        <button
          onClick={() => navigate("/auth/student")}
          className="bg-blue-600 text-white py-4 rounded-lg text-lg hover:bg-blue-700"
        >
          I am a Student
        </button>

        <button
          onClick={() => navigate("/auth/driver")}
          className="bg-green-600 text-white py-4 rounded-lg text-lg hover:bg-green-700"
        >
          I am a Driver
        </button>
      </div>
    </div>
  );
}
