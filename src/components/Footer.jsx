import React from "react";
import { FaFacebook, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-blue-600 text-white mt-16">
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center">
        {/* Left - Logo and Text */}
        <div className="text-center md:text-left mb-4 md:mb-0">
          <h2 className="text-2xl font-semibold">Own Language</h2>
          <p className="text-sm text-blue-100 mt-2">
            Learn English pronunciation with AI 💬
          </p>
        </div>

        {/* Center - Social Icons */}
        <div className="flex space-x-6 text-2xl">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-200"
          >
            <FaFacebook />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-200"
          >
            <FaInstagram />
          </a>
        </div>

        {/* Right - Copyright */}
        <div className="text-sm text-blue-100 text-center md:text-right mt-4 md:mt-0">
          © {new Date().getFullYear()} Own Language. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
