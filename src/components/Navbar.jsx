import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi"; 
import { MdDashboard } from "react-icons/md";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [userName, setUserName] = useState(null);
  const navigate = useNavigate();

  const toggleMenu = () => setOpen(!open);

  useEffect(() => {
  
    const getStoredName = () => {
      const candidates = [
        localStorage.getItem("user_name"),
        localStorage.getItem("name"),
        localStorage.getItem("userName"),
      ];
  
      return candidates.find((c) => c && c !== "undefined") || null;
    };

    setUserName(getStoredName());


    const handleUserUpdate = () => {
      setUserName(getStoredName());
    };
    window.addEventListener("userUpdated", handleUserUpdate);

    return () => window.removeEventListener("userUpdated", handleUserUpdate);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_id");
    setUserName(null);
    window.dispatchEvent(new Event("userUpdated"));
    navigate("/login");
  };

  const goToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img src="/logo.png" alt="Logo" className="w-10 h-10" />
          <span className="text-2xl font-bold text-blue-600">Own Language</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 text-gray-700 font-medium items-center">
          <Link to="/tts" className="hover:text-blue-600">TTS</Link>
          <Link to="/stt" className="hover:text-blue-600">STT</Link>
          <Link to="/chat" className="hover:text-blue-600">Chat with AI</Link>
          <Link to="/practice" className="hover:text-blue-600">Practice</Link>

          {userName ? (
            <div className="flex items-center gap-3">
              <button
  onClick={goToDashboard}
  className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
  title="Go to your dashboard"
>
  <MdDashboard size={18} />
  <span>{userName.split(" ")[0]}'s Dashboard</span>
</button>
              {/* Logout Icon */}
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-red-600 transition"
                title="Logout"
              >
                <FiLogOut size={22} />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Icon */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-gray-700 text-2xl focus:outline-none"
        >
          {open ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white shadow-inner flex flex-col space-y-4 px-6 py-4">
          <Link onClick={toggleMenu} to="/tts" className="hover:text-blue-600">TTS</Link>
          <Link onClick={toggleMenu} to="/stt" className="hover:text-blue-600">STT</Link>
          <Link onClick={toggleMenu} to="/chat" className="hover:text-blue-600">Chat with AI</Link>
          <Link onClick={toggleMenu} to="/practice" className="hover:text-blue-600">Practice</Link>

          {userName ? (
            <>
              <div className="flex items-center justify-between">
              <button
  onClick={goToDashboard}
  className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
  title="Go to your dashboard"
>
  <MdDashboard size={18} />
  <span>{userName.split(" ")[0]}'s Dashboard</span>
</button>
                <FiLogOut
                  onClick={() => {
                    handleLogout();
                    toggleMenu();
                  }}
                  size={20}
                  className="text-gray-600 hover:text-red-600 cursor-pointer"
                  title="Logout"
                />
              </div>
            </>
          ) : (
            <Link
              onClick={toggleMenu}
              to="/login"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-center hover:bg-blue-700"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
