import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
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
    try {
      const response = await axios.post(
        "https://primechat-t9vo.onrender.com/auth/login",
        data
      );

      setMessage({ text: "Login successful!", type: "success" });
      navigate("/chat"); // Navigate to chat on successful login
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || "Login failed. Try again.",
        type: "error",
      });
    } finally {
      setTimeout(() => setMessage({ text: "", type: "" }), 5000);
    }
  };

  return (
    <div className="auth-form">
      {message.text && (
        <div
          className={`alert ${
            message.type === "success" ? "success" : "error"
          }`}
        >
          {message.text}
        </div>
      )}

      <h2>Login</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Email</label>
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
          />
          {errors.email && <p>{errors.email.message}</p>}
        </div>
        <div>
          <label>Password</label>
          <div className="password-input">
            <input
              type={showPassword ? "text" : "password"}
              {...register("password", { required: "Password is required" })}
            />
            <button type="button" onClick={togglePasswordVisibility}>
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {errors.password && <p>{errors.password.message}</p>}
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
