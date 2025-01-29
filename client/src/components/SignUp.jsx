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

      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Full Name</label>
          <input
            type="text"
            {...register("fullName", { required: "Full name is required" })}
          />
          {errors.fullName && <p>{errors.fullName.message}</p>}
        </div>
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
          <input
            type="password"
            {...register("password", { required: "Password is required" })}
          />
          {errors.password && <p>{errors.password.message}</p>}
        </div>
        <div>
          <label>Confirm Password</label>
          <input
            type="password"
            {...register("confirmPassword", {
              required: "Confirm password is required",
            })}
          />
          {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
        </div>
        <div>
          <label>Profile Image</label>
          <input
            type="file"
            {...register("pic", { required: "Profile image is required" })}
          />
          {errors.pic && <p>{errors.pic.message}</p>}
        </div>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;
