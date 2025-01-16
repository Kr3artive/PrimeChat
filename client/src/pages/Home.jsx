import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Link } from "react-router-dom";

const Home = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true); // Track if Login or Signup is active
  const [message, setMessage] = useState({ text: "", type: "" }); // Message state

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Toggle Password Visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Form submission handler for Login and Signup
  const onSubmit = async (data) => {
    try {
      const endpoint = isLogin ? "/api/login" : "/api/signup"; // Differentiate endpoint
      const formData = new FormData();

      // Append all fields to FormData (for signup with image)
      for (const key in data) {
        formData.append(key, data[key]);
      }

      const response = await axios.post(endpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage({
        text: isLogin
          ? "Login successful!"
          : "Signup successful! You can now log in.",
        type: "success",
      });

      if (!isLogin) setIsLogin(true); // Switch to login tab after signup
    } catch (error) {
      setMessage({
        text:
          error.response?.data?.message ||
          "An error occurred. Please try again.",
        type: "error",
      });
    } finally {
      // Clear the message after 5 seconds
      setTimeout(() => setMessage({ text: "", type: "" }), 5000);
    }
  };

  return (
    <div className="p-2 flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        {/* Popup for messages */}
        {message.text && (
          <div
            className={`absolute bottom-3 right-14 p-3 rounded-md mb-4 text-center text-white ${
              message.type === "success" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Site Name */}
        <h1 className="text-3xl font-bold text-center text-black mb-6">
          PrimeChat
        </h1>

        {/* Toggle between Login and Signup */}
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

        {/* Form for Login or Signup */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Conditional Full Name Input */}
          {!isLogin && (
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-black"
              >
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                placeholder="Enter your full name"
                className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                {...register("fullName", {
                  required: "Full name is required",
                })}
              />
              {errors.fullName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.fullName.message}
                </p>
              )}
            </div>
          )}

          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-black"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: "Please enter a valid email",
                },
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Input */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-black"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter your password"
                className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                {...register("password", { required: "Password is required" })}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Conditional Confirm Password Input */}
          {!isLogin && (
            <>
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-black"
                >
                  Confirm Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="confirmPassword"
                  placeholder="Confirm your password"
                  className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  {...register("confirmPassword", {
                    required: "Confirm password is required",
                  })}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Profile Image Upload */}
              <div>
                <label
                  htmlFor="profileImage"
                  className="block text-sm font-medium text-black"
                >
                  Profile Image
                </label>
                <input
                  type="file"
                  id="profileImage"
                  accept="image/*"
                  className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  {...register("profileImage", {
                    required: "Profile image is required",
                  })}
                />
                {errors.profileImage && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.profileImage.message}
                  </p>
                )}
              </div>
            </>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 mt-6 bg-green-600 text-black font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {isLogin ? "Login" : <Link to={"/verifyotp"}>VerifyOtp</Link>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Home;
