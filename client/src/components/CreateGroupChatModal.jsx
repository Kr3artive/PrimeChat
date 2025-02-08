import React, { useContext } from "react";
import { IoIosClose } from "react-icons/io";
import { ModalContext } from "../contexts/ModalContext";

const CreateGroupChatModal = () => {
  const { closeCreateGroupChatModal, isCreateGroupChatModalOpen } =
    useContext(ModalContext);
  return (
    isCreateGroupChatModalOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
        <div className="bg-white p-6 rounded shadow-lg h-[500px] w-[500px] relative">
          <button
            onClick={() => closeCreateGroupChatModal()}
            className="absolute top-5 right-5 shadow-md rounded-full h-10 w-10 flex justify-center items-center bg-gray-50 hover:bg-gray-100"
          >
            <IoIosClose className="text-3xl" />
          </button>
          <h3 className="text-center border-b border-green-500 text-2xl pb-3">
            Create Group Chat
          </h3>
          <form action="">
            <div className="space-y-2.5 my-5">
              <label htmlFor="groupName" className="block">
                Group Name:
              </label>
              <input
                type="text"
                name="groupName"
                id="groupName"
                className="block w-full h-8 border border-black outline-none hover:border-green-300 focus:outline-green-400 focus:border-green-300 rounded-xl px-2.5 capitalize"
              />
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default CreateGroupChatModal;
