import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../Slices/themeSlice";
import { logoutUser } from "../Services/Operations/AuthAPI";
import { FaTasks, FaSun, FaMoon, FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);
  const { theme } = useSelector((state) => state.theme);

  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logoutUser(navigate));
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/80 dark:bg-[#0D1117]/90 border-b border-gray-200 dark:border-[#1F2937] text-gray-800 dark:text-gray-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-600/30 transition-all duration-300 group-hover:scale-105">
              <FaTasks className="text-lg" />
            </div>

            <span className="text-xl font-extrabold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              Tasks
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6">
            <Link
              to="/"
              className="text-sm font-semibold hover:text-indigo-500 transition-all"
            >
              Home
            </Link>

            {token && (
              <Link
                to="/dashboard/tasks"
                className="text-sm font-semibold hover:text-indigo-500 transition-all"
              >
                Dashboard
              </Link>
            )}

            {/* Theme */}
            <button
              onClick={() => dispatch(toggleTheme())}
              className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-[#161B22] dark:hover:bg-[#21262D] text-gray-600 dark:text-gray-300 hover:text-indigo-500 transition-all duration-300 cursor-pointer"
            >
              {theme === "dark" ? (
                <FaSun className="text-sm" />
              ) : (
                <FaMoon className="text-sm" />
              )}
            </button>

            {token ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <img
                    src={
                      user?.image ||
                      `https://api.dicebear.com/7.x/initials/svg?seed=${
                        user?.name || "User"
                      }`
                    }
                    alt="profile"
                    className="w-9 h-9 rounded-xl border border-gray-200 dark:border-[#21262D] p-0.5 object-cover"
                  />

                  <span className="hidden lg:block text-xs font-semibold text-gray-600 dark:text-gray-300 max-w-[100px] truncate">
                    {user?.name}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500 hover:text-white text-rose-600 dark:text-rose-400 rounded-xl text-xs font-semibold border border-rose-500/20 transition-all duration-300 cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                state={{ tab: "login" }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-600/25 transition-all"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Buttons */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => dispatch(toggleTheme())}
              className="p-2 rounded-xl bg-gray-100 dark:bg-[#161B22] text-gray-600 dark:text-gray-300 transition-all"
            >
              {theme === "dark" ? <FaSun /> : <FaMoon />}
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl bg-gray-100 dark:bg-[#161B22] text-gray-600 dark:text-gray-300 transition-all cursor-pointer"
            >
              {isOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-[#1F2937] bg-white dark:bg-[#0D1117] px-4 py-5 space-y-3 shadow-2xl">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-3 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#161B22] hover:text-indigo-500 transition-all"
          >
            Home
          </Link>

          {token && (
            <Link
              to="/dashboard/tasks"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-3 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#161B22] hover:text-indigo-500 transition-all"
            >
              Dashboard
            </Link>
          )}

          {token ? (
            <div className="border-t border-gray-200 dark:border-[#1F2937] pt-4 flex flex-col gap-3">
              <div className="flex items-center gap-3 px-2">
                <img
                  src={
                    user?.image ||
                    `https://api.dicebear.com/7.x/initials/svg?seed=${
                      user?.name || "User"
                    }`
                  }
                  alt="profile"
                  className="w-9 h-9 rounded-xl border border-gray-200 dark:border-[#21262D] object-cover"
                />

                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 truncate">
                  {user?.name}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="w-full py-3 bg-rose-500/10 hover:bg-rose-500 hover:text-white text-rose-600 dark:text-rose-400 rounded-xl text-sm font-semibold border border-rose-500/20 transition-all duration-300 cursor-pointer"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="border-t border-gray-200 dark:border-[#1F2937] pt-4 flex flex-col gap-3">
              <Link
                to="/login"
                state={{ tab: "login" }}
                onClick={() => setIsOpen(false)}
                className="text-center py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold shadow-lg transition-all"
              >
                Login
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
