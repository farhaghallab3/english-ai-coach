import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaMicrophone, FaRobot, FaComments, FaBookOpen } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { MdDashboard } from "react-icons/md";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [userName, setUserName] = useState(null);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
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

  // Handle scroll behavior
  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < 10) {
        // Always show navbar at the top
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        // Scrolling down - hide navbar
        setIsVisible(false);
      } else {
        // Scrolling up - show navbar
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", controlNavbar);
    return () => window.removeEventListener("scroll", controlNavbar);
  }, [lastScrollY]);

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
    <nav 
      className={`bg-slate-900 shadow-lg fixed top-0 left-0 right-0 z-50 border-b border-slate-800 transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 group">
          <img src="/logo.png" alt="Logo" className="w-10 h-10 float-animation" />
          <span className="text-2xl font-bold text-gradient group-hover:scale-105 transition-transform duration-300">Own Language</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 text-gray-300 font-medium items-center">
          <Link to="/tts" className="flex items-center space-x-1 hover:text-cyan-400 transition-all duration-300 hover:scale-105">
            <FaMicrophone size={16} />
            <span>TTS</span>
          </Link>
          <Link to="/stt" className="flex items-center space-x-1 hover:text-cyan-400 transition-all duration-300 hover:scale-105">
            <FaMicrophone size={16} />
            <span>STT</span>
          </Link>
          <Link to="/chat" className="flex items-center space-x-1 hover:text-cyan-400 transition-all duration-300 hover:scale-105">
            <FaComments size={16} />
            <span>Chat</span>
          </Link>
          <Link to="/practice" className="flex items-center space-x-1 hover:text-cyan-400 transition-all duration-300 hover:scale-105">
            <FaBookOpen size={16} />
            <span>Practice</span>
          </Link>

          {userName ? (
            <div className="flex items-center gap-3">
              <button
                onClick={goToDashboard}
                className="btn-primary flex items-center gap-2"
                title="Go to your dashboard"
              >
                <MdDashboard size={18} />
                <span>{userName.split(" ")[0]}'s Dashboard</span>
              </button>
              {/* Logout Icon */}
              <button
                onClick={handleLogout}
                className="text-gray-400 hover:text-red-400 transition-all duration-300 hover:scale-110 p-2 rounded-lg hover:bg-red-500/10"
                title="Logout"
              >
                <FiLogOut size={22} />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="btn-primary"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Icon */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-gray-300 text-2xl focus:outline-none hover:text-blue-400 transition-colors"
        >
          {open ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-slate-900 shadow-inner flex flex-col space-y-4 px-6 py-4 border-t border-slate-700">
          <Link onClick={toggleMenu} to="/tts" className="flex items-center space-x-2 text-gray-300 hover:text-cyan-400 transition-all duration-300 hover:translate-x-2">
            <FaMicrophone size={16} />
            <span>TTS</span>
          </Link>
          <Link onClick={toggleMenu} to="/stt" className="flex items-center space-x-2 text-gray-300 hover:text-cyan-400 transition-all duration-300 hover:translate-x-2">
            <FaMicrophone size={16} />
            <span>STT</span>
          </Link>
          <Link onClick={toggleMenu} to="/chat" className="flex items-center space-x-2 text-gray-300 hover:text-cyan-400 transition-all duration-300 hover:translate-x-2">
            <FaComments size={16} />
            <span>Chat</span>
          </Link>
          <Link onClick={toggleMenu} to="/practice" className="flex items-center space-x-2 text-gray-300 hover:text-cyan-400 transition-all duration-300 hover:translate-x-2">
            <FaBookOpen size={16} />
            <span>Practice</span>
          </Link>

          {userName ? (
            <>
              <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                <button
                  onClick={goToDashboard}
                  className="btn-primary flex items-center gap-2 text-sm"
                  title="Go to your dashboard"
                >
                  <MdDashboard size={16} />
                  <span>{userName.split(" ")[0]}'s Dashboard</span>
                </button>
                <button
                  onClick={() => {
                    handleLogout();
                    toggleMenu();
                  }}
                  className="text-gray-400 hover:text-red-400 transition-all duration-300 hover:scale-110 p-2 rounded-lg hover:bg-red-500/10"
                  title="Logout"
                >
                  <FiLogOut size={20} />
                </button>
              </div>
            </>
          ) : (
            <Link
              onClick={toggleMenu}
              to="/login"
              className="btn-primary text-center"
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