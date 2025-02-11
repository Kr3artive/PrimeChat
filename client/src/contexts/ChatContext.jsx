import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import axios from "axios"; 

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [selectedchat, setSelectedchat] = useState()
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);

    if (!userInfo) {
      navigate("/");
    }
  }, []);

   const fetchChats = async () => {
     try {
       const token = localStorage.getItem("token");
       const response = await axios.get(
         "https://primechat-t9vo.onrender.com/chats/getchat",
         {
           headers: { Authorization: `Bearer ${token}` },
         }
       );
       setChats(response.data);
     } catch (err) {
       console.error("Error fetching chats:", err);
       setError("NETWORK ERROR, PLEASE CHECK YOUR CONNECTION");
     } finally {
       setLoading(false);
     }
   };

   useEffect(() => {
     fetchChats(); // Fetch chats when the app loads
   }, []);

  const Logout = () => {
    logout();
    setUser(null);
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  return (
    <ChatContext.Provider
      value={{
        user,
        setUser,
        Logout,
        selectedchat,
        setSelectedchat,
        chats,
        setChats,
        fetchChats,
        loading,
        error,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

// Custom hook to use ChatState
export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
