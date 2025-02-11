import { useEffect, useState } from "react";
import { ChatState } from "../contexts/ChatContext";

const ChatWindow = ({ chat }) => {
  const { user } = ChatState();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Fetch messages when chat changes
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `https://primechat-t9vo.onrender.com/messages/${chat._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await response.json();
        setMessages(data);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    if (chat?._id) {
      fetchMessages();
    }
  }, [chat]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-3">{chat.chatName}</h2>
      <div className="bg-gray-100 p-4 rounded-lg h-[400px] overflow-y-auto">
        {messages.length > 0 ? (
          messages.map((msg) => (
            <div key={msg._id} className="mb-2">
              <strong>
                {msg.sender.name === user.name ? "You" : msg.sender.name}:
              </strong>{" "}
              <span>{msg.text}</span>
            </div>
          ))
        ) : (
          <p>No messages yet</p>
        )}
      </div>
    </div>
  );
};

export default ChatWindow;
