import React from "react";

const Navbar = ({ onToggleSidebar }) => {
  return (
    <header className="bg-white shadow px-4 py-3 flex items-center justify-between">
      {/* Hamburger button - visible only on mobile */}
      <button
        onClick={onToggleSidebar}
        aria-label="Toggle sidebar"
        className="text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded md:hidden"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Title */}
      <div className="text-lg font-semibold text-gray-700">IT Asset Manag</div>

      {/* Placeholder for user menu */}
      <div className=" md:block text-gray-600">User Menu</div>
    </header>
  );
};

export default Navbar;