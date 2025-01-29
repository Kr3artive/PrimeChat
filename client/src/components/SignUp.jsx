import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const [message, setMessage] = useState({ text: "", type: "" });
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      setMessage({ text: "Passwords do not match", type: "error" });
      return;
    }

    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (key !== "pic") formData.append(key, data[key]);
      else formData.append("pic", data.pic[0]);
    });

    try {
      await axios.post(
        "https://primechat-t9vo.onrender.com/auth/signup",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setMessage({
        text: "Signup successful! Verify your email.",
        type: "success",
      });
      navigate("/verifyotp", { state: { email: data.email } });
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || "Signup failed. Try again.",
        type: "error",
      });
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-md">
        {message.text && (
          <div
            className={`mb-4 p-3 rounded text-center text-white ${
              message.type === "success" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {message.text}
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-black">
                Full Name
              </label>
              <input
                type="text"
                {...register("fullName", { required: "Full name is required" })}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-black"
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm">
                  {errors.fullName.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-black">
                Email
              </label>
              <input
                type="email"
                {...register("email", { required: "Email is required" })}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-black"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-black">
                Password
              </label>
              <input
                type="password"
                {...register("password", { required: "Password is required" })}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-black"
              />
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-black">
                Confirm Password
              </label>
              <input
                type="password"
                {...register("confirmPassword", {
                  required: "Confirm password is required",
                })}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-black"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          {/* Profile Image (Full Width) */}
          <div>
            <label className="block text-sm font-medium text-black">
              Profile Image
            </label>
            <input
              type="file"
              {...register("pic", { required: "Profile image is required" })}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-black"
            />
            {errors.pic && (
              <p className="text-red-500 text-sm">{errors.pic.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-green-600 text-white font-medium py-2 rounded-md hover:bg-green-700 focus:ring-4 focus:ring-green-500 focus:outline-none"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
