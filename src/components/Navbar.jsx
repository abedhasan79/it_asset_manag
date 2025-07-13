import React, { useState } from "react";
import AuthModal from "./AuthModal";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = ({ onToggleSidebar }) => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { user, setUser, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/")
  };

  return (
    <nav className="flex justify-between items-center px-4 py-3 bg-white shadow-sm border-b">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="md:hidden text-xl text-gray-700"
        >
          ☰
        </button>
        <h1 className="text-xl font-semibold text-blue-600">IT Asset Manag</h1>
      </div>

      <div className="flex items-center gap-4">
        {loading ? (
          <span>Loading...</span>
        ) : user ? (
          <>
            <span className="text-sm text-gray-700">
              {user.name || "User"} ({user.role || "Role"})
            </span>
            <button
              onClick={handleLogout}
              className="text-red-500 hover:underline text-sm"
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={() => setAuthModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm"
          >
            Login / Register
          </button>
        )}
      </div>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={(newUser) => setUser(newUser)} // sets global user
      />
    </nav>
  );
};

export default Navbar;