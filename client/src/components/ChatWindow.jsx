import { useEffect, useState } from "react";
import { ChatState } from "../contexts/ChatContext";
import { FaEye, FaSpinner } from "react-icons/fa";
import axios from "axios";

const ChatWindow = ({ chat }) => {
  const { user } = ChatState();
  const [messagesByChat, setMessagesByChat] = useState({});
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false); // New state for loading
  const [showModal, setShowModal] = useState(false);
  const token = localStorage.getItem("token");

  const otherUser = chat?.users?.find((u) => u?._id !== user?._id) || {};
  const chatName = chat?.isGroupChat
    ? chat?.chatName
    : otherUser?.fullname || "Chat";

  // Fetch messages for the selected chat
  useEffect(() => {
    const fetchMessages = async () => {
      if (!chat?._id) return;

      try {
        const { data } = await axios.get(
          `https://primechat-t9vo.onrender.com/message/${chat._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setMessagesByChat((prev) => ({
          ...prev,
          [chat._id]: data, // Store messages under chat ID
        }));
      } catch (err) {
        console.error("Error fetching messages:", err.message);
      }
    };

    fetchMessages();
  }, [chat?._id, token]);

  // Send a new message
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return; // Prevent sending if empty or already sending

    setIsSending(true); // Start loading state

    try {
      const { data } = await axios.post(
        "https://primechat-t9vo.onrender.com/message/send",
        { content: newMessage, chatId: chat._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessagesByChat((prev) => ({
        ...prev,
        [chat._id]: [...(prev[chat._id] || []), data],
      }));

      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false); // Stop loading state
    }
  };

  const messages = messagesByChat[chat?._id] || [];

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-bold">{chatName}</h2>
        <FaEye
          className="cursor-pointer text-gray-600 hover:text-gray-800"
          size={20}
          onClick={() => setShowModal(true)}
        />
      </div>

      {/* Messages Container */}
      <div className="bg-gray-100 rounded-lg h-[400px] overflow-y-auto py-2 px-3 flex flex-col">
        {messages.length > 0 ? (
          messages.map((msg) => {
            const isMyMessage = msg?.sender?._id === user?._id;

            return (
              <div
                key={msg._id || Math.random()}
                className={`flex ${
                  isMyMessage ? "justify-end" : "justify-start"
                } my-1`}
              >
                <div
                  className={`max-w-xs md:max-w-md p-3 rounded-lg text-white ${
                    isMyMessage ? "bg-blue-500" : "bg-gray-300 text-black"
                  }`}
                >
                  <span className="block text-sm font-semibold">
                    {isMyMessage ? "You" : msg?.sender?.fullname}
                  </span>
                  <p className="text-sm">{msg?.content}</p>
                  <span className="block text-xs text-gray-200 mt-1 text-right">
                    {new Date(msg?.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-500">No messages yet</p>
        )}
      </div>

      {/* Message Input */}
      <form onSubmit={sendMessage} className="mt-3 flex">
        <input
          type="text"
          className="border p-2 flex-1 rounded"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          disabled={isSending} // Disable input when sending
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded ml-2 flex items-center justify-center"
          disabled={isSending} // Disable button when sending
        >
          {isSending ? (
            <FaSpinner className="animate-spin" size={18} />
          ) : (
            "Send"
          )}
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
