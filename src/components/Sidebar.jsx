import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = ({ isOpen, onClose }) => {
  const linkClass = ({ isActive }) =>
    `block px-4 py-2 rounded hover:bg-blue-600 hover:text-white ${
      isActive ? "bg-blue-700 text-white" : "text-gray-300"
    }`;

  return (
    <>
      {/* Overlay for mobile when sidebar open */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden transition-opacity ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      ></div>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-gray-800 p-6 z-40 transform transition-transform
          md:relative md:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <h2 className="text-white text-2xl font-bold mb-8">IT Asset Manag</h2>
        <nav className="flex flex-col space-y-3">
          <NavLink to="/" className={linkClass} end onClick={onClose}>
            Dashboard
          </NavLink>
          <NavLink to="/assets" className={linkClass} onClick={onClose}>
            Assets
          </NavLink>
          <NavLink to="/licenses" className={linkClass} onClick={onClose}>
            Licenses
          </NavLink>
          <NavLink to="/tickets" className={linkClass} onClick={onClose}>
            Tickets
          </NavLink>
          <NavLink to="/settings" className={linkClass} onClick={onClose}>
            Settings
          </NavLink>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;