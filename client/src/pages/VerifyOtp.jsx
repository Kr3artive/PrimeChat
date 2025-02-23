import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";


const VerifyOtp = () => {
  const [message, setMessage] = useState({ text: "", type: "" }); // Message state
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  const handleVerifyOtp = async (data) => {
    try {
      // Make the API request to verify OTP
      const response = await axios.post("http://localhost:9000/auth/verify", {
        email: email,
        otp: data.otp,
      });

      if (response.data.status === "success") {
        setMessage({ text: "OTP verified successfully!", type: "success" });
      } else if (response.data.status === "already_authenticated") {
        setMessage({
          text: "Your account is already verified. Please log in.",
          type: "info",
        });
      }
      navigate("/")
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || "Invalid OTP. Please try again.",
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
        {/* Message Popup */}
        {message.text && (
          <div
            className={`p-3 rounded-md mb-4 text-center text-white ${
              message.type === "success"
                ? "bg-green-500"
                : message.type === "info"
                ? "bg-blue-500"
                : "bg-red-500"
            }`}
          >
            {message.text}
          </div>
        )}

        <h1 className="text-2xl font-bold text-center text-black mb-4">
          Verify OTP
        </h1>
        <p className="text-gray-600 text-center mb-2">
          Please enter the OTP sent to your email to verify your account.
        </p>
        <p className="text-red-600 text-center mb-6">
          Also check your spam folder.
        </p>

        <form onSubmit={handleSubmit(handleVerifyOtp)} className="space-y-4">
          <div>
            <label
              htmlFor="otp"
              className="block text-sm font-medium text-black"
            >
              Enter OTP
            </label>
            <input
              type="text"
              id="otp"
              placeholder="Enter your OTP"
              {...register("otp", {
                required: "OTP is required",
                pattern: {
                  value: /^[0-9]{6}$/, // Assuming a 6-digit OTP
                  message: "OTP must be a 6-digit number",
                },
              })}
              className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.otp && (
              <p className="text-red-500 text-xs mt-1">{errors.otp.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Verify
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtp;
