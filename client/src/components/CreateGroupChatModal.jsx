import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { IoIosCloseCircle } from "react-icons/io";
import { ModalContext } from "../contexts/ModalContext";
import { ChatState } from "../contexts/ChatContext";
import axios from "axios";

const CreateGroupChatModal = () => {
  const { closeCreateGroupChatModal, isCreateGroupChatModalOpen } =
    useContext(ModalContext);
  const { user, setChats } = ChatState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const { register, handleSubmit } = useForm();

  // Handle Search
  // Handle Search
  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResult([]);
      setMessage(null);
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `https://primechat-t9vo.onrender.com/user/alluser?search=${query}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.length === 0) {
        setMessage("No users found");
      } else {
        setMessage(null);
      }

      setSearchResult(response.data);
    } catch (error) {
      setMessage("Failed to load search results");
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  // Add User to Group
  const addUserToGroup = (user) => {
    if (selectedUsers.some((u) => u._id === user._id)) {
      setMessage("User already added!");
      setTimeout(() => setMessage(null), 2000);
      return;
    }
    setSelectedUsers([...selectedUsers, user]);
  };

  // Remove User from Group
  const removeUser = (userId) => {
    setSelectedUsers(selectedUsers.filter((user) => user._id !== userId));
  };

  // Handle Form Submission
  const onSubmit = async (data) => {
    if (!data.groupName.trim() || selectedUsers.length < 2) {
      setMessage("Please provide a group name and at least 2 users");
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data: newChat } = await axios.post(
        "https://primechat-t9vo.onrender.com/chats/group",
        {
          name: data.groupName,
          users: selectedUsers.map((user) => user._id),
        },
        config
      );

      setChats((prevChats) => [newChat, ...prevChats]);
      setMessage("Group chat created successfully!");
      setTimeout(() => {
        setMessage(null);
        closeCreateGroupChatModal();
      }, 2000);
    } catch (error) {
      setMessage("Failed to create group chat");
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    isCreateGroupChatModalOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 p-2">
        <div className="bg-white p-6 rounded shadow-lg h-[500px] w-[500px] relative">
          <button
            onClick={closeCreateGroupChatModal}
            className="absolute top-5 right-5 shadow-md rounded-full h-10 w-10 flex justify-center items-center bg-gray-50 hover:bg-gray-100"
          >
            <IoIosCloseCircle className="text-3xl text-red-600" />
          </button>

          <h3 className="text-center border-b border-green-500 text-2xl pb-3">
            Create Group Chat
          </h3>

          {message && (
            <div className="text-center text-sm bg-red-100 text-red-600 p-2 rounded-md my-3">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Group Name Input */}
            <div className="mt-2">
              <label htmlFor="groupName" className="block font-semibold">
                Group Name:
              </label>
              <input
                {...register("groupName")}
                type="text"
                placeholder="Enter chat name"
                className="block w-full h-10 outline-none hover:border-green-300 focus:outline-green-400 focus:border-green-300 rounded-xl px-2.5 capitalize"
              />
            </div>

            {/* Search Users */}
            <div>
              <label htmlFor="searchUsers" className="block font-semibold">
                Add Users:
              </label>
              <input
                type="text"
                placeholder="Search users..."
                onChange={(e) => handleSearch(e.target.value)}
                className="block w-full h-10 border outline-none hover:border-green-300 focus:outline-green-400 focus:border-green-300 rounded-xl px-2.5"
              />
            </div>

            {/* Search Results */}
            <div className="max-h-36 overflow-y-auto border border-gray-300 rounded-md p-2">
              {loading ? (
                <p className="text-center">Loading...</p>
              ) : searchResult.length > 0 ? (
                searchResult.map((user) => (
                  <div
                    key={user._id}
                    className="flex justify-between items-center p-2 border-b cursor-pointer hover:bg-gray-100"
                    onClick={() => addUserToGroup(user)}
                  >
                    <span>{user.fullname}</span>
                  </div>
                ))
              ) : (
                <p className="text-center text-black">{message}</p>
              )}
            </div>

            {/* Selected Users */}
            <div className="flex flex-wrap gap-2 mt-3">
              {selectedUsers.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center bg-green-100 px-2 py-1 rounded-full text-sm"
                >
                  <span>{user.fullname}</span>
                  <button
                    onClick={() => removeUser(user._id)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    <IoIosCloseCircle/>
                  </button>
                </div>
              ))}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 mt-4 rounded-md hover:bg-green-700 transition"
            >
              Create Chat
            </button>
          </form>
        </div>
      </div>
    )
  );
};

export default CreateGroupChatModal;
