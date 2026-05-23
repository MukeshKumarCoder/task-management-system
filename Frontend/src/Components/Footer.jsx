import React from "react";
import { FaTasks } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-gray-200 dark:border-[#1F2937] py-8">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-5 dark:text-gray-100 text-gray-600 text-xs font-semibold">
        <div className="flex items-center gap-2">
          <FaTasks className="text-indigo-500" />
          <span>© 2026 Tasks Project. All rights reserved.</span>
        </div>

        <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
          <Link to="/" className="hover:text-indigo-500 transition">
            Terms
          </Link>

          <Link to="/" className="hover:text-indigo-500 transition">
            Privacy
          </Link>

          <Link to="/" className="hover:text-indigo-500 transition">
            Support
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
