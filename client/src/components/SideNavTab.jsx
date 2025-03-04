import { useState } from "react";
import { IoIosNotifications } from "react-icons/io";
import { ChatState } from "../contexts/ChatContext";

const UserDetails = ({ user, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-2">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-lg font-semibold mb-4">My Profile</h2>
        <div className="flex flex-col items-center">
          <img
            src={user?.pic || "https://via.placeholder.com/150"}
            alt="User"
            className="rounded-full h-16 w-16 object-cover mb-4"
          />
          <p className="text-black text-base">{user?.fullname || "No Name"}</p>
          <p className="text-black text-sm">{user?.email || "No Email"}</p>
        </div>
        <button
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md w-full hover:bg-red-600 text-sm"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

const SideTab = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const { user, Logout } = ChatState() || {}; // Ensure safe destructuring

  if (!user || !user.isVerified) return null; // Prevents rendering if user is not available or unverified

  return (
    <div className="relative text-lg flex justify-between items-center p-2 gap-3">
      <IoIosNotifications size={30} className="cursor-pointer" />
      <div className="relative">
        <div
          className="border-2 border-green-400 rounded-full h-9 w-9 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <img
            src={user?.pic}
            alt="Profile"
            className="rounded-full h-8 w-8 object-cover"
          />
        </div>

        {/* Dropdown menu */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-36 bg-white border rounded-lg shadow-lg text-sm">
            <ul className="py-2 text-black">
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  setShowProfile(true);
                  setIsOpen(false);
                }}
              >
                Profile
              </li>
              <li
                onClick={() => {
                  setIsOpen(false);
                  Logout();
                }}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                Logout
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {showProfile && (
        <UserDetails user={user} onClose={() => setShowProfile(false)} />
      )}
    </div>
  );
};

export default SideTab;
