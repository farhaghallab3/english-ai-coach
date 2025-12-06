import React from "react";
import { FaFacebook, FaInstagram, FaHeart, FaRocket } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-slate-800 t-16 border-t border-slate-700">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Left - Logo and Text */}
          <div className="text-center md:text-left mb-8 md:mb-0">
            <div className="flex items-center justify-center md:justify-start space-x-2 mb-4">
              <img src="/logo.png" alt="Logo" className="w-8 h-8 float-animation" />
              <h2 className="text-2xl font-bold text-gradient">Own Language</h2>
            </div>
            <p className="text-gray-400 mt-2 flex items-center justify-center md:justify-start space-x-2">
              <FaRocket className="text-cyan-400" />
              <span>Master English with AI-powered learning</span>
            </p>
          </div>

          {/* Center - Social Icons */}
          <div className="flex space-x-6 text-2xl mb-8 md:mb-0">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-400 transition-all duration-300 hover:scale-110 p-3 rounded-full hover:bg-blue-500/10"
            >
              <FaFacebook />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-pink-400 transition-all duration-300 hover:scale-110 p-3 rounded-full hover:bg-pink-500/10"
            >
              <FaInstagram />
            </a>
          </div>

          {/* Right - Copyright */}
          <div className="text-sm text-gray-400 text-center md:text-right">
            <div className="flex items-center justify-center md:justify-end space-x-2 mb-2">
              <span>© {new Date().getFullYear()} Own Language</span>
            </div>
            <div className="flex items-center justify-center md:justify-end space-x-1 text-xs">
              <span>Made with</span>
              <FaHeart className="text-red-400 animate-pulse" />
              <span>for language learners</span>
            </div>
          </div>
        </div>

        {/* Bottom decorative line */}
        <div className="mt-8 pt-8 border-t border-slate-700">
          <div className="flex justify-center">
            <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-violet-500 rounded-full"></div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;