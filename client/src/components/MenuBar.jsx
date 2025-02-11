import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { HiMenu } from "react-icons/hi";
import { IoIosCloseCircle } from "react-icons/io";
import NewButton from "./NewButton";
import { ModalContext } from "../contexts/ModalContext";
import CreateGroupChatModal from "./CreateGroupChatModal";

const MenuBar = ({ children }) => {
  const { openCreateGroupChatModal } = useContext(ModalContext);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false); // Mobile menu state

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:9000/chats/getchat",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
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

    fetchChats();
  }, []);

  return (
    <div className="bg-green-300 flex flex-col md:flex-row gap-5 p-5 min-h-screen relative">
      {/* Mobile Menu Button */}
      <button
        className="md:hidden bg-white p-2 rounded-md shadow-md flex items-center gap-2"
        onClick={() => setMenuOpen(true)}
      >
        <HiMenu size={24} />
        <span className="font-semibold">My Chats</span>
      </button>

      {/* Chat List Panel */}
      <div
        className={`bg-white rounded-xl md:w-1/4 fixed md:static top-0 left-0 h-full md:h-auto z-50 transform ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:translate-x-0 shadow-lg`}
      >
        {/* Close Button (Inside the menu, top-right) */}
        <button
          className="md:hidden absolute top-4 right-4 text-red-600"
          onClick={() => setMenuOpen(false)}
        >
          <IoIosCloseCircle size={30} />
        </button>

        <div className="flex justify-between mx-4 mt-14">
          <h3 className="text-2xl">My Chats</h3>
          <NewButton
            content={"New Group Chat"}
            onclick={() => {
              openCreateGroupChatModal();
              setMenuOpen(false); // Close menu when opening modal
            }}
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
                    {chat.lastMessage || "No messages yet"}
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

      {/* Chat Messages Area */}
      <div className="bg-white rounded-xl md:w-3/4 w-full p-4">
        {children}
      </div>

      {/* Modal appears on top of everything */}
      <div className="absolute z-[100] ">
        <CreateGroupChatModal />
      </div>
    </div>
  );
};

export default MenuBar;
