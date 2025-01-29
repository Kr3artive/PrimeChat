import { useState } from "react";
import Login from "../components/Login";
import Signup from "../components/SignUp";

const Home = () => {
  const [isLogin, setIsLogin] = useState(true); // Track active form (Login or Signup)

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-black mb-6 font-mono">
          PrimeChat
        </h1>

        {/* Toggle Buttons */}
        <div className="flex justify-around mb-6">
          <button
            onClick={() => setIsLogin(true)}
            className={`w-1/2 py-2 ${
              isLogin
                ? "bg-green-300 rounded-xl font-medium text-black"
                : "text-black"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`w-1/2 py-2 ${
              !isLogin
                ? "bg-green-300 rounded-xl font-medium text-black"
                : "text-black"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Render Login or Signup */}
        {isLogin ? <Login /> : <Signup />}
      </div>
    </div>
  );
};

export default Home;
