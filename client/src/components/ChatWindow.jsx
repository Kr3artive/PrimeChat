import { useEffect, useState } from "react";
import { ChatState } from "../contexts/ChatContext";
import { FaEye } from "react-icons/fa";

const ChatWindow = ({ chat }) => {
  const { user } = ChatState();
  const [messages, setMessages] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // Determine chat name (exclude logged-in user)
  const otherUser = chat?.users?.find((u) => u._id !== user._id);
  const chatName = chat?.isGroupChat
    ? chat.chatName
    : otherUser?.fullname || "Chat";

  useEffect(() => {
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
      {/* Chat Header with View Icon */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-bold">{chatName}</h2>
        <FaEye
          className="cursor-pointer text-gray-600 hover:text-gray-800"
          size={20}
          onClick={() => setShowModal(true)}
        />
      </div>

      {/* Chat Messages */}
      <div className="bg-gray-100 rounded-lg h-[400px] overflow-y-auto py-2">
        {messages.length > 0 ? (
          messages.map((msg) => (
            <div key={msg._id} className="mb-2">
              <strong>
                {msg.sender.fullname === user.fullname
                  ? "You"
                  : msg.sender.fullname}
                :
              </strong>{" "}
              <span>{msg.text}</span>
            </div>
          ))
        ) : (
          <p>No messages yet</p>
        )}
      </div>

      {/* Modal for Viewing Chat Details */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-5 rounded-lg shadow-lg w-80">
            <h3 className="text-lg font-bold mb-3">
              {chat?.isGroupChat ? "Group Members" : "Chat User"}
            </h3>
            <ul>
              {chat?.users
                ?.filter((u) => u._id !== user._id)
                .map((u) => (
                  <li key={u._id} className="mb-2">
                    <h4 className="font-bold">{u.fullname}</h4>
                    <p>{u.email}</p>
                  </li>
                ))}
            </ul>
            <button
              className="mt-4 w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
