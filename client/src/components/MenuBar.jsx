import React, { useContext } from "react";
import NewButton from "./NewButton";
import { chats } from "../demo/chatdata";
import { ModalContext } from "../contexts/ModalContext";
import CreateGroupChatModal from "./CreateGroupChatModal";

const MenuBar = ({ children }) => {
  const { openCreateGroupChatModal } = useContext(ModalContext);
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
          {chats.map((chat) => {
            return (
              <li
                key={chat.id}
                title={chat.message}
                className="bg-green-200 w-full rounded-lg my-4 h-16 flex justify-between items-end pb-2.5 pt-1.5 px-2 hover:cursor-pointer hover:bg-green-300 transition-colors duration-500"
              >
                <div className="flex flex-col gap-1">
                  <span className="font-semibold">{chat.name}</span>
                  <span className="text-sm">
                    {chat.message.length <= 25
                      ? chat.message
                      : chat.message.substring(0, 25) + " ..."}
                  </span>
                </div>
                <p className="text-xs text-green-800">{chat.time}</p>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="bg-white rounded-xl w-3/4 p-4">{children}</div>
      {/* for dev process */}
      <CreateGroupChatModal />
    </div>
  );
};

export default MenuBar;
