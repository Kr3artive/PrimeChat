import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext"; 

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);

    if (!userInfo) {
      navigate("/");
    }
  }, []);

  const Logout = () => {
    logout();
    setUser(null);
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  return (
    <ChatContext.Provider value={{ user, setUser, Logout }}>
      {children}
    </ChatContext.Provider>
  );
};

// Custom hook to use ChatState
export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
