import { useEffect, useState } from "react";
import { ChatState } from "../contexts/ChatContext";
import { FaEye, FaSpinner } from "react-icons/fa";
import axios from "axios";
import { io } from "socket.io-client";
import Lottie from "react-lottie";
import animationData from "../animations/typing.json";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

const ENDPOINT = "https://primechat-t9vo.onrender.com";
const socket = io(ENDPOINT, { transports: ["websocket"] });

const ChatWindow = ({ chat }) => {
  const { user, notifications, setNotifications } = ChatState();
  const [messagesByChat, setMessagesByChat] = useState({});
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [lastTypingTime, setLastTypingTime] = useState(null);
  const [loading, setLoading] = useState()
  const [messageState, setMessageState] = useState(null);
  const token = localStorage.getItem("token");

  const otherUser = chat?.users?.find((u) => u?._id !== user?._id) || {};
  const chatName = chat?.isGroupChat
    ? chat?.chatName
    : otherUser?.fullname || "Chat";

  useEffect(() => {
    if (!chat?._id) return;

    socket.emit("join chat", chat._id);

    socket.on("new message", (message) => {
      if (message.chatId === chat._id) {
        setMessagesByChat((prev) => ({
          ...prev,
          [chat._id]: [...(prev[chat._id] || []), message],
        }));
      }
    });

    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    return () => {
      socket.off("new message");
      socket.off("typing");
      socket.off("stop typing");
    };
  }, [chat?._id]);

  useEffect(() => {
    if (!chat?._id) return;

    const fetchMessages = async () => {
      try {
        const { data } = await axios.get(`${ENDPOINT}/message/${chat._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setMessagesByChat((prev) => ({
          ...prev,
          [chat._id]: data,
        }));
      } catch (err) {
        console.error("Error fetching messages:", err.message);
      }
    };

    fetchMessages(); // Initial fetch

    const interval = setInterval(fetchMessages, 10000); // Fetch every 10 seconds

    return () => clearInterval(interval);
  }, [chat?._id, token]);

const handleSearch = async (e) => {
  const searchValue = e.target.value;
  setSearchTerm(searchValue);
  if (!searchValue.trim()) {
    setFilteredUsers([]);
    return;
  }
  setLoading(true);
  try {
    const response = await axios.get(
      `https://primechat-t9vo.onrender.com/user/alluser?search=${searchValue}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setFilteredUsers(response.data);
  } catch (error) {
    console.error("ERROR FETCHING USERS:", error);
    setFilteredUsers([]);
  } finally {
    setLoading(false);
  }
  };
  
  const showMessage = (text, type = "success") => {
    setMessageState({ text, type });
    setTimeout(() => setMessageState(null), 3000);
  };

const handleAddUser = async (userId) => {
  try {
    await axios.post(
      `https://primechat-t9vo.onrender.com/chats/${chat._id}/adduser`,
      { userId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    showMessage("User added successfully!");
    setFilteredUsers([]);
    setShowModal(false)
  } catch (err) {
    console.error("Failed to add user:", err);
  }
};

const handleLeaveGroup = async () => {
  try {
    await axios.post(
      `https://primechat-t9vo.onrender.com/groups/${chat._id}/leave-group`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    showMessage("You have left the group!");
    setShowModal(false);
  } catch (err) {
    console.error("Failed to leave group:", err);
  }
};

const handleRenameGroup = async () => {
  if (!newGroupName.trim()) return;
  try {
    await axios.put(
      `https://primechat-t9vo.onrender.com/chats/renamegroup`,
      { chatId: chat._id, chatName: newGroupName }, 
      { headers: { Authorization: `Bearer ${token}` } }
    );
    showMessage("Group renamed successfully!");
    setNewGroupName("");
    setShowModal(false);
  } catch (err) {
    console.error("Failed to rename group:", err);
  }
};

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);

    try {
      const { data } = await axios.post(
        `${ENDPOINT}/message/send`,
        { content: newMessage, chatId: chat._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      socket.emit("send message", data);

      setMessagesByChat((prev) => ({
        ...prev,
        [chat._id]: [...(prev[chat._id] || []), data],
      }));

      setNewMessage("");
      socket.emit("stop typing", chat._id);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);

    if (!typing) {
      setTyping(true);
      socket.emit("typing", chat._id);
    }

    setLastTypingTime(new Date().getTime());

    setTimeout(() => {
      let currentTime = new Date().getTime();
      let timeDiff = currentTime - lastTypingTime;
      if (timeDiff >= 3000 && typing) {
        socket.emit("stop typing", chat._id);
        setTyping(false);
      }
    }, 3000);
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
                    isMyMessage ? "bg-green-600" : "bg-gray-800 text-black"
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
          <p className="text-center text-black">No messages yet</p>
        )}
        {showModal && (
          <div className="fixed mt-14 inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-5 rounded-lg shadow-lg w-96">
              {chat?.isGroupChat ? (
                <>
                  <h3 className="text-lg font-bold mb-3">Manage Group</h3>
                  <div>
                    {messageState && (
                      <div
                        className={`p-2 text-white text-center rounded ${
                          messageState.type === "error"
                            ? "bg-red-500"
                            : "bg-green-500"
                        }`}
                      >
                        {messageState.text}
                      </div>
                    )}
                  </div>
                  <input
                    type="text"
                    className="border p-2 w-full rounded mb-3"
                    placeholder="Rename group"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                  />
                  <button
                    className="bg-green-600 text-white px-4 py-2 rounded w-full mb-3"
                    onClick={handleRenameGroup}
                  >
                    Rename Group
                  </button>
                  <input
                    type="text"
                    className="border p-2 w-full rounded mb-3"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                  <ul>
                    {filteredUsers.map((u) => (
                      <li
                        key={u._id}
                        className="p-2 border-b flex justify-between"
                      >
                        {u.fullname}
                        <button
                          className="bg-green-500 text-white px-2 py-1 rounded"
                          onClick={() => handleAddUser(u._id)}
                        >
                          Add
                        </button>
                      </li>
                    ))}
                  </ul>
                  <p className="mb-2 font-semibold">Group Members:</p>
                  <ul className="mb-3 border rounded p-2 max-h-40 overflow-y-auto">
                    {chat.users
                      .filter(
                        (u, index, self) =>
                          index === self.findIndex((user) => user._id === u._id)
                      )
                      .map((u) => (
                        <li
                          key={u._id}
                          className="p-2 border-b flex justify-between"
                        >
                          {u.fullname}
                        </li>
                      ))}
                  </ul>
                  {/* Leave Group Button */}
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded w-full mb-3"
                    onClick={handleLeaveGroup}
                  >
                    Leave Group
                  </button>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-bold mb-3">User Info</h3>
                  <div className="flex justify-center">
                    <img
                      src={user?.pic}
                      alt="Profile"
                      className="rounded-full h-36 object-cover"
                    />
                  </div>
                  <p>
                    <strong>Name:</strong> {otherUser.fullname}
                  </p>
                  <p>
                    <strong>Email:</strong> {otherUser.email}
                  </p>
                </>
              )}
              <button
                className="mt-2 w-full bg-black text-white py-2 rounded"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {isTyping && (
          <div>
            <Lottie options={defaultOptions} width={50} />
          </div>
        )}
      </div>

      <form onSubmit={sendMessage} className="mt-10 flex">
        <input
          type="text"
          className="border p-2 flex-1 rounded"
          placeholder="Type a message..."
          value={newMessage}
          onChange={handleTyping}
          disabled={isSending}
        />
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded ml-2 flex items-center justify-center"
          disabled={isSending}
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
