import { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const Login = () => {
  const { login } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await login(data.email, data.password);
      setMessage({ text: `Authenticated as ${data.email}`, type: "success" });
      setTimeout(() => {
        setMessage({ text: "", type: "" });
        navigate("/chat");
      }, 3000);
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || "Login failed. Try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-md rounded-lg w-full max-w-md p-6">
        {message.text && (
          <div
            className={`text-center py-2 px-4 rounded mb-4 ${
              message.type === "success"
                ? "bg-green-100 text-green-600"
                : "bg-red-100 text-red-600"
            }`}
          >
            {message.text}
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-black">
              Email
            </label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              className="w-full border border-gray-300 p-2 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
            />
            {errors.email && (
              <p className="text-sm text-red-600 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-black">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", { required: "Password is required" })}
                className="w-full border border-gray-300 p-2 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-2 text-sm text-black hover:text-gray-800"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-600 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white font-medium py-2 rounded-md hover:bg-green-700 focus:ring-4 focus:ring-green-500 focus:outline-none flex justify-center items-center"
            disabled={loading}
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 mr-3 border-2 border-white border-t-transparent rounded-full"
                viewBox="0 0 24 24"
              ></svg>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
