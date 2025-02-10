import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import NewButton from "./NewButton";
import { ModalContext } from "../contexts/ModalContext";
import CreateGroupChatModal from "./CreateGroupChatModal";

const MenuBar = ({ children }) => {
  const { openCreateGroupChatModal } = useContext(ModalContext);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const token = localStorage.getItem("token"); // Ensure the user is authenticated
        const response = await axios.get(
          "http://localhost:9000/chat/allchats",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setChats(response.data); // Store fetched chats
      } catch (err) {
        console.error("Error fetching chats:", err);
        setError("Failed to load chats");
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  return (
    <div className="bg-green-300 flex gap-5 p-5">
      <div className="bg-white rounded-xl w-1/4">
        <div className="flex justify-between m-4">
          <h3 className="text-2xl">My Chats</h3>
          <NewButton
            content={"New Group Chat"}
            onclick={openCreateGroupChatModal}
          />
        </div>

        <ul className="bg-green-100 h-[450px] mt-7 rounded-xl p-4 mx-2 overflow-y-auto">
          {loading ? (
            <p className="text-center text-green-700">Loading chats...</p>
          ) : error ? (
            <p className="text-center text-red-600">{error}</p>
          ) : chats.length > 0 ? (
            chats.map((chat) => (
              <li
                key={chat._id}
                title={chat.lastMessage || "No messages yet"}
                className="bg-green-200 w-full rounded-lg my-4 h-16 flex justify-between items-end pb-2.5 pt-1.5 px-2 hover:cursor-pointer hover:bg-green-300 transition-colors duration-500"
              >
                <div className="flex flex-col gap-1">
                  <span className="font-semibold">{chat.chatName}</span>
                  <span className="text-sm">
                    {chat.lastMessage?.length <= 25
                      ? chat.lastMessage
                      : chat.lastMessage.substring(0, 25) + " ..."}
                  </span>
                </div>
                <p className="text-xs text-green-800">{chat.updatedAt}</p>
              </li>
            ))
          ) : (
            <p className="text-center text-black">No chats available</p>
          )}
        </ul>
      </div>

      <div className="bg-white rounded-xl w-3/4 p-4">{children}</div>

      {/* For dev process */}
      <CreateGroupChatModal />
    </div>
  );
};

export default MenuBar;
