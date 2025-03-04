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
    if (!chat || !Array.isArray(chat.users) || chat.users.length < 2) {
      console.error(
        "getChatName Error: chat.users is missing or incomplete",
        chat
      );
      return "Unknown User";
    }

    return chat.isGroupChat ? chat.chatName : getSender(loggedUser, chat.users);
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

        {/* Header with Title and New Button */}
        <div className="flex flex-wrap items-center justify-center gap-4 mx-4 mt-4">
          <h3 className="text-xl sm:text-2xl md:text-3xl">My Chats</h3>
          <NewButton
            content={
              <span className="text-sm sm:text-base md:text-lg whitespace-nowrap">
                New Group Chat
              </span>
            }
            className="px-4 py-2 sm:px-6 sm:py-3 min-w-[140px] md:min-w-[160px] text-center"
            onclick={() => {
              openCreateGroupChatModal();
              setMenuOpen(false);
            }}
          />
        </div>

        {/* Chat List */}
        <ul className="bg-green-100 h-[500px] mt-7 rounded-xl p-4 mx-2 overflow-y-auto">
          {loading ? (
            <p className="text-center text-green-700">Loading chats...</p>
          ) : error ? (
            <p className="text-center text-red-600">{error}</p>
          ) : Array.isArray(chats) && chats.length > 0 ? (
            chats.map((chat) => {
              console.log("Chat Users:", chat.users);
              console.log("Chat Object:", chat);
              console.log("Logged User:", loggedUser);

              const chatName = getChatName(chat);
              const lastMessage =
                chat.latestMessage?.content || "No messages yet";

              return (
                <li
                  key={chat._id}
                  title={lastMessage}
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
                    <span className="text-sm text-gray-700 truncate w-40">
                      {chat.lastMessage?.sender?.fullname
                        ? `${chat.lastMessage.sender.fullname}: ${lastMessage}`
                        : lastMessage}
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
