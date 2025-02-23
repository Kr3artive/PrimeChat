import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BiCheckCircle, BiXCircle, BiUpload } from "react-icons/bi";

const Signup = () => {
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("No file chosen");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const showMessage = (text, type) => {
    setMessage({ text, type });

    setTimeout(() => {
      setMessage({ text: "", type: "" });

      if (type === "success") {
        navigate("/verifyotp", { state: { email: text.split(" ")[2] } });
      }
    }, 3000);
  };

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      showMessage("Passwords do not match", "error");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("fullname", data.fullname);
    formData.append("email", data.email);
    formData.append("password", data.password);

    if (data.pic && data.pic.length > 0) {
      formData.append("pic", data.pic[0]);
    }

    try {
      await axios.post("http://localhost:9000/auth/signup", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      showMessage(
        `SIGNUP SUCCESSFUL! VERIFY YOUR EMAIL ${data.email}`,
        "success"
      );
    } catch (error) {
      console.error("Signup error:", error);
      showMessage(
        error.response?.data?.message || "SIGNUP FAILED, PLEASE TRY AGAIN.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-md">
        {message.text && (
          <div
            className={`fixed top-5 right-5 flex items-center gap-3 px-6 py-4 rounded-lg shadow-lg transition-all transform ${
              message.type === "success"
                ? "bg-green-600 text-white"
                : "bg-red-600 text-white"
            }`}
            style={{
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
            }}
          >
            {message.type === "success" ? (
              <BiCheckCircle className="h-6 w-6 text-white" />
            ) : (
              <BiXCircle className="h-6 w-6 text-red-300" />
            )}
            <p className="text-lg font-semibold">{message.text}</p>
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
                {...register("fullname", { required: "Full name is required" })}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-black"
              />
              {errors.fullname && (
                <p className="text-red-500 text-sm">
                  {errors.fullname.message}
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
          <div>
            <label className="block text-sm font-medium text-black">
              Profile Image
            </label>
            <div className="relative border rounded p-2 cursor-pointer flex items-center gap-3 bg-gray-50">
              <BiUpload className="w-6 h-6 text-gray-500" />
              <input
                type="file"
                {...register("pic")}
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) =>
                  setFileName(e.target.files[0]?.name || "No file chosen")
                }
              />
              <span className="text-sm text-gray-700">{fileName}</span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white font-medium py-2 rounded-md hover:bg-green-700 focus:ring-4 focus:ring-green-500 focus:outline-none flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
