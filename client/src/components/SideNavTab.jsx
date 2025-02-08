import { useState } from "react";
import { IoIosNotifications } from "react-icons/io";

const UserDetails = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-lg font-semibold mb-4">User Profile</h2>
        <div className="flex flex-col items-center">
          <img
            src="https://tse2.mm.bing.net/th?id=OIP.O8vv9O4Ku4HvFQyep-NXMAHaLG&pid=Api"
            alt="User"
            className="rounded-full h-16 w-16 object-cover mb-4"
          />
          <p className="text-gray-700 text-base">John Doe</p>
          <p className="text-gray-500 text-sm">johndoe@example.com</p>
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

  return (
    <div className="relative text-lg flex justify-between items-center p-2 gap-3">
      <IoIosNotifications className="cursor-pointer" />
      <div className="relative">
        <div
          className="border-2 border-green-400 rounded-full h-9 w-9 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <img
            src="https://tse2.mm.bing.net/th?id=OIP.O8vv9O4Ku4HvFQyep-NXMAHaLG&pid=Api"
            alt="Profile"
            className="rounded-full h-8 w-8 object-cover"
          />
        </div>

        {/* Dropdown menu */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-36 bg-white border rounded-lg shadow-lg text-sm">
            <ul className="py-2 text-gray-700">
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  setShowProfile(true);
                  setIsOpen(false);
                }}
              >
                Profile
              </li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                Logout
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {showProfile && <UserDetails onClose={() => setShowProfile(false)} />}
    </div>
  );
};

export default SideTab;
