import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ChatState } from "../contexts/ChatContext";
import { FaEye } from "react-icons/fa";
import axios from "axios";

const ChatWindow = ({ chat }) => {
  const { user } = ChatState();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState();
  const [showModal, setShowModal] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const token = localStorage.getItem("token");

  const { register, handleSubmit, reset } = useForm();

  const otherUser = chat?.users?.find((u) => u?._id !== user?._id) || {};
  const chatName = chat?.isGroupChat
    ? chat?.chatName
    : otherUser?.fullname || "Chat";

  useEffect(() => {
    const fetchMessages = async () => {
      if (!chat?._id) return;
      try {
        const { data } = await axios.get(
          `https://primechat-t9vo.onrender.com/message/${chat._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessages(data);
      } catch (err) {
        console.error("Error fetching messages:", err.message);
      }
    };
    fetchMessages();
  }, [chat, token]);

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

  const handleAddUser = async (userId) => {
    try {
      await axios.post(
        `https://primechat-t9vo.onrender.com/chats/${chat._id}/adduser`,
        { userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("User added successfully!");
      setFilteredUsers([]);
    } catch (err) {
      console.error("Failed to add user:", err);
    }
  };

  const handleRemoveUser = async (userId) => {
    try {
      await axios.post(
        `https://primechat-t9vo.onrender.com/chats/${chat._id}/removeuser`,
        { userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("User removed successfully!");
    } catch (err) {
      console.error("Failed to remove user:", err);
    }
  };

  const handleLeaveGroup = async () => {
    try {
      await axios.post(
        `https://primechat-t9vo.onrender.com/groups/${chat._id}/leave-group`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("You have left the group!");
      setShowModal(false);
    } catch (err) {
      console.error("Failed to leave group:", err);
    }
  };

  const handleRenameGroup = async () => {
    if (!newGroupName.trim()) return;
    try {
      await axios.put(
        `https://primechat-t9vo.onrender.com/groups/${chat._id}/rename`,
        { chatName: newGroupName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Group renamed successfully!");
      setNewGroupName("");
    } catch (err) {
      console.error("Failed to rename group:", err);
    }
  };

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

      <div className="bg-gray-100 rounded-lg h-[400px] overflow-y-auto py-2 px-3">
        {messages.length > 0 ? (
          messages.map((msg) => (
            <div key={msg?._id || Math.random()} className="mb-2">
              <strong>
                {msg?.sender?.fullname === user?.fullname
                  ? "You"
                  : msg?.sender?.fullname}
                :
              </strong>
              <span> {msg?.text}</span>
            </div>
          ))
        ) : (
          <p>No messages yet</p>
        )}
      </div>

      {showModal && (
        <div className="fixed mt-14 inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-5 rounded-lg shadow-lg w-96">
            {chat?.isGroupChat ? (
              <>
                <h3 className="text-lg font-bold mb-3">Manage Group</h3>
                <input
                  type="text"
                  className="border p-2 w-full rounded mb-3"
                  placeholder="Rename group"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                />
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded w-full mb-3"
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
                <p>
                  <strong>Name:</strong> {otherUser.fullname}
                </p>
                <p>
                  <strong>Email:</strong> {otherUser.email}
                </p>
              </>
            )}
            <button
              className="mt-2 w-full bg-gray-500 text-white py-2 rounded"
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
