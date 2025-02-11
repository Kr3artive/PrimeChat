import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { CiSearch } from "react-icons/ci";
import { IoIosCloseCircle } from "react-icons/io";

const SearchBar = () => {
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, setValue } = useForm();

  const onSubmit = async (data) => {
    if (!data.search.trim()) {
      setFilteredUsers([]);
      setIsModalOpen(false);
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:9000/user/alluser?search=${data.search}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFilteredUsers(response.data);
    } catch (error) {
      console.error("ERROR FETCHING USERS:", error);
      setFilteredUsers([]);
    } finally {
      setLoading(false);
      setIsModalOpen(true);
      setValue("search", ""); 
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };


  return (
    <div className="relative">
      {/* Search Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex items-center gap-2 h-10 px-2 border border-black rounded-full"
      >
        <CiSearch className="text-2xl" />
        <input
          type="text"
          placeholder="Search User"
          {...register("search")}
          className="outline-none w-full"
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-1 rounded-full hover:bg-gray-800 transition"
        >
          Search
        </button>
      </form>

      {/* Modal for Search Results */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-2 z-50">
          <div className="bg-white w-96 rounded-lg shadow-lg p-4 relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-red-600"
            >
              <IoIosCloseCircle size={25} />
            </button>

            <h2 className="text-lg font-semibold mb-2">Search Results</h2>

            <div className="max-h-60 overflow-y-auto">
              {loading ? (
                <p className="text-center p-2">Loading...</p>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <div
                    key={user._id}
                    className="flex justify-between items-center p-3 border-b hover:bg-gray-100 cursor-pointer"
                  >
                    <div>
                      <h3 className="text-sm font-semibold">{user.fullname}</h3>
                      <p className="text-xs text-black">{user.email}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center p-2 text-black font-semibold">
                  No users found
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
