import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));

  //  Load user and token from localStorage when the app starts
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userInfo"));
    if (storedUser) {
      setUser(storedUser);
    }

    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      axios.defaults.headers.common["authorization"] = storedToken;
    }
  }, []);

  const login = async (email, password) => {
    const response = await axios.post(
      "https://primechat-t9vo.onrender.com/auth/login",
      { email, password }
    );
    setToken(response.data.token);
    setUser(response.data.user);

    // Store both token and user in localStorage
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("userInfo", JSON.stringify(response.data.user));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    delete axios.defaults.headers.common["authorization"];
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
