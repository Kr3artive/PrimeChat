import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import axios from "axios";
import { io } from "socket.io-client";

const ChatContext = createContext();
const ENDPOINT = "http://localhost:9000"; // Ensure this matches your backend
const socket = io(ENDPOINT, { transports: ["websocket"] });

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [selectedchat, setSelectedchat] = useState(null);
  const [chats, setChats] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (!userInfo) {
      navigate("/");
    } else {
      setUser(userInfo);
      socket.emit("setup", userInfo);
    }
  }, []);

  // Handle joining a chat when selected chat changes
  useEffect(() => {
    if (!selectedchat?._id) return;

    console.log("Joining chat:", selectedchat._id);
    socket.emit("join chat", selectedchat._id);
  }, [selectedchat]);

  // Listen for new messages
  useEffect(() => {
    socket.on("new message", (message) => {
      console.log("New message received:", message);

      if (!message || !message.chatId) return;

      if (message.chatId === selectedchat?._id) {
        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat._id === message.chatId
              ? { ...chat, messages: [...chat.messages, message] }
              : chat
          )
        );
      } else {
        setNotifications((prevNotifications) => {
          const isDuplicate = prevNotifications.some(
            (notif) => notif.chatId === message.chatId
          );
          if (!isDuplicate) {
            return [
              ...prevNotifications,
              {
                chatId: message.chatId,
                text: `New message from ${
                  message.sender?.fullname || "Unknown"
                }`,
              },
            ];
          }
          return prevNotifications;
        });
      }
    });

    return () => {
      socket.off("new message");
    };
  }, [selectedchat]);

  const fetchChats = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${ENDPOINT}/chats/getchat`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setChats(response.data);
    } catch (err) {
      console.error("Error fetching chats:", err);
      setError("NETWORK ERROR, PLEASE CHECK YOUR CONNECTION");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchChats();
    }
  }, [user]);

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
        notifications,
        setNotifications,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
