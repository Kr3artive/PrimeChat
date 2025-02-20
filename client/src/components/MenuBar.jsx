import { useContext, useEffect, useState } from "react";
import { HiMenu } from "react-icons/hi";
import { IoIosCloseCircle } from "react-icons/io";
import NewButton from "./NewButton";
import { ModalContext } from "../contexts/ModalContext";
import CreateGroupChatModal from "./CreateGroupChatModal";
import { ChatState } from "../contexts/ChatContext";
import ChatWindow from "./ChatWindow";
import { getSender } from "../config/chatlogics";

const MenuBar = () => {
  const [loggedUser, setLoggedUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const { openCreateGroupChatModal } = useContext(ModalContext);
  const {
    chats,
    selectedchat,
    setSelectedchat,
    fetchChats,
    loading,
    error,
    user,
  } = ChatState();

  useEffect(() => {
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) {
      setLoggedUser(JSON.parse(storedUser));
    }

    if (typeof fetchChats === "function") {
      fetchChats();
    }
  }, [fetchChats]);

  const getChatName = (chat) => {
    if (!chat) return "No Chat Selected";

    if (chat.isGroupChat) {
      return chat.chatName; // Return group chat name
    }

    if (loggedUser && Array.isArray(chat.users)) {
      return getSender(loggedUser, chat.users); // Return the name of the other user
    }

    return "Unknown User";
  };

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
        <button
          className="md:hidden absolute top-4 right-4 text-red-600"
          onClick={() => setMenuOpen(false)}
        >
          <IoIosCloseCircle size={30} />
        </button>

        <div className="flex gap-2 justify-between mx-4 mt-14">
          <h3 className="text-2xl">My Chats</h3>
          <NewButton
            content={"New Group Chat"}
            onclick={() => {
              openCreateGroupChatModal();
              setMenuOpen(false);
            }}
          />
        </div>

        <ul className="bg-green-100 h-[450px] mt-7 rounded-xl p-4 mx-2 overflow-y-auto">
          {loading ? (
            <p className="text-center text-green-700">Loading chats...</p>
          ) : error ? (
            <p className="text-center text-red-600">{error}</p>
          ) : Array.isArray(chats) && chats.length > 0 ? (
            chats.map((chat) => {
              const chatName = getChatName(chat);

              return (
                <li
                  key={chat._id}
                  title={chat.lastMessage || "No messages yet"}
                  className={`bg-green-200 w-full rounded-lg my-4 h-16 flex justify-between items-end pb-2.5 pt-1.5 px-2 hover:cursor-pointer hover:bg-green-300 transition-colors duration-500 ${
                    selectedchat?._id === chat._id ? "bg-green-400" : ""
                  }`}
                  onClick={() => {
                    setSelectedchat(chat);
                    setMenuOpen(false);
                  }}
                >
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold">{chatName}</span>
                    <span className="text-sm">
                      {chat.lastMessage || "No messages yet"}
                    </span>
                  </div>
                </li>
              );
            })
          ) : (
            <p className="text-center text-black">No chats available</p>
          )}
        </ul>
      </div>

      {/* Chat Messages Area */}
      <div className="bg-white rounded-xl md:w-3/4 w-full p-4">
        {selectedchat ? (
          <div>
            <h2 className="text-xl font-bold mb-4">
              Chatting with: {getChatName(selectedchat)}
            </h2>
            <ChatWindow chat={selectedchat} />
          </div>
        ) : (
          <p className="text-center text-gray-600">
            Select a chat to start messaging
          </p>
        )}
      </div>

      <div className="absolute z-[100]">
        <CreateGroupChatModal />
      </div>
    </div>
  );
};

export default MenuBar;
