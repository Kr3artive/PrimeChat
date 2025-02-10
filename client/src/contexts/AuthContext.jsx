import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["authorization"] = token;
    } else {
      delete axios.defaults.headers.common["authorization"];
    }
  }, [token]);

  const login = async (email, password) => {
    const response = await axios.post(
      "https://primechat-t9vo.onrender.com/auth/login",
      {
        email,
        password,
      }
    );
    setToken(response.data.token);
    localStorage.setItem("token", response.data.token);
    setUser(response.data.user);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["authorization"];
  };


  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
