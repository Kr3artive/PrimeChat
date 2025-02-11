import { useState } from "react";
import { CiMenuKebab } from "react-icons/ci";
import { IoIosCloseCircle } from "react-icons/io";
import SearchBar from "./SearchBar";
import SideNavTab from "./SideNavTab";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="flex justify-between items-center px-6 py-3 bg-white shadow-md sticky top-0 w-full z-50">
      <h1 className="text-black text-2xl font-mono">PrimeChat</h1>

      {/* Desktop View (Hidden on small screens) */}
      <div className="hidden md:flex items-center gap-6">
        <SearchBar />
        <SideNavTab />
      </div>

      {/* Hamburger Menu for Small Screens */}
      <div className="md:hidden">
        <button onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? (
            <IoIosCloseCircle className="text-red-600" size={28} />
          ) : (
            <CiMenuKebab size={28} />
          )}
        </button>
      </div>

      {/* Mobile Menu (Appears when open) */}
      <div
        className={`fixed top-0 right-0 w-64 h-full bg-white shadow-lg p-4 flex flex-col gap-4 transition-transform duration-300 ease-in-out md:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Close Button Inside Menu */}
        <button
          className="self-end text-red-600"
          onClick={() => setMenuOpen(false)}
        >
          <IoIosCloseCircle size={28} />
        </button>

        {/* Mobile Navigation */}
        <SearchBar />
        <SideNavTab />
      </div>
    </nav>
  );
};

export default Navbar;
