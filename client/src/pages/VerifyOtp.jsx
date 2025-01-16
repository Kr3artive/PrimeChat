import { useState } from "react";

const VerifyOtp = () => {
  const [otp, setOtp] = useState(""); // OTP input state
  const [message, setMessage] = useState({ text: "", type: "" }); // Message state

  const handleVerifyOtp = async () => {
    try {
      // Simulate API call to verify OTP
      const response = await fakeApiCall(otp); // Replace with your actual API call

      if (response.status === "success") {
        setMessage({ text: "OTP verified successfully!", type: "success" });
      } else if (response.status === "already_authenticated") {
        setMessage({
          text: "Your account is already verified. Please log in.",
          type: "info",
        });
      }
    } catch (error) {
      setMessage({
        text: error.message || "Invalid OTP. Please try again.",
        type: "error",
      });
    } finally {
      // Clear the message after 5 seconds
      setTimeout(() => setMessage({ text: "", type: "" }), 5000);
    }
  };

  // Mock API call (replace with actual API call logic)
  const fakeApiCall = (otp) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (otp === "123456") resolve({ status: "success" });
        else if (otp === "already")
          resolve({ status: "already_authenticated" });
        else reject(new Error("Invalid OTP"));
      }, 1000);
    });
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

        {/* Heading */}
        <h1 className="text-2xl font-bold text-center text-black mb-4">
          Verify OTP
        </h1>
        <p className="text-gray-600 text-center mb-2">
          Please enter the OTP sent to your email to verify your account.
        </p>
        <p className="text-red-600 text-center mb-6">
          Also check your spam folder.
        </p>

        {/* Input and Button */}
        <div className="space-y-4">
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
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <button
            onClick={handleVerifyOtp}
            className="w-full py-3 bg-green-600 text-black font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Verify
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
