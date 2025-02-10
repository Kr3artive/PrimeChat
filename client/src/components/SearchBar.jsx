import { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { chats } from "../demo/chatdata";

const SearchBar = () => {
  const [search, setSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handle search input
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (value.trim() === "") {
      setFilteredUsers([]);
      setIsModalOpen(false); 
    } else {
      const filtered = chats.filter((user) =>
        user.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredUsers(filtered);
      setIsModalOpen(true);
    }
  };

  // Close modal function
  const closeModal = () => {
    setIsModalOpen(false);
    setSearch("");
  };

  return (
    <div className="relative">
      {/* Search Input */}
      <div className="flex items-center gap-2 h-10 px-2 border border-black rounded-full">
        <CiSearch className="text-lg" />
        <input
          type="text"
          placeholder="Search User"
          value={search}
          onChange={handleSearch}
          className="outline-none w-full"
        />
      </div>

      {/* Modal for Search Results */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-96 rounded-lg shadow-lg p-4 relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-black"
            >
              ✖
            </button>

            <h2 className="text-lg font-semibold mb-2">Search Results</h2>

            <div className="max-h-60 overflow-y-auto">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex justify-between items-center p-3 border-b hover:bg-gray-100 cursor-pointer"
                  >
                    <div>
                      <h3 className="text-sm font-semibold">{user.name}</h3>
                      <p className="text-xs text-black">{user.message}</p>
                    </div>
                    <span className="text-xs text-black">{user.time}</span>
                  </div>
                ))
              ) : (
                <p className="text-center p-2 text-black">No users found</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
