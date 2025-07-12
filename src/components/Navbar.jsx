import React, { useEffect, useState } from "react";
import AuthModal from "./AuthModal";
import { getCurrentUser } from "../services/api";

const Navbar = ({ onToggleSidebar }) => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoadingUser(false);
      return;
    }

    getCurrentUser()
      .then((data) => setUser(data))
      .catch(() => {
        localStorage.removeItem("token");
        setUser(null);
      })
      .finally(() => setLoadingUser(false));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
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
        {loadingUser ? (
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
        onAuthSuccess={(newUser) => setUser(newUser)}
      />
    </nav>
  );
};

export default Navbar;