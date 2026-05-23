import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { logoutUser } from "../Services/Operations/AuthAPI";
import { toggleTheme } from "../Slices/themeSlice";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTasks,
  FaUsers,
  FaClipboardList,
  FaHistory,
  FaSignOutAlt,
  FaChevronLeft,
  FaChevronRight,
  FaBars,
  FaTimes,
  FaUserCircle,
  FaChartPie,
  FaSun,
  FaMoon,
} from "react-icons/fa";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { theme } = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logoutUser(navigate));
  };

  const navItems = [
    {
      name: "My Tasks",
      path: "/dashboard/tasks",
      icon: FaTasks,
      roles: ["User", "Admin"],
    },
    {
      name: "Analytics",
      path: "/dashboard/analytics",
      icon: FaChartPie,
      roles: ["Admin"],
    },
    {
      name: "User Management",
      path: "/dashboard/users",
      icon: FaUsers,
      roles: ["Admin"],
    },
    {
      name: "Task Monitoring",
      path: "/dashboard/monitoring",
      icon: FaClipboardList,
      roles: ["Admin"],
    },
    {
      name: "Activity Logs",
      path: "/dashboard/logs",
      icon: FaHistory,
      roles: ["Admin"],
    },
  ];

  const activeItem =
    navItems.find((item) => item.path === location.pathname) || navItems[0];
  const userRole = user?.role || "User";

  const visibleNavItems = navItems.filter((item) =>
    item.roles.includes(userRole),
  );

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800/80 text-slate-650 dark:text-slate-300 select-none transition-colors duration-300">
      {/* Header */}
      <div
        className={`flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800/80 ${isCollapsed ? "justify-center" : ""}`}
      >
        {!isCollapsed && (
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xl font-bold bg-linear-to-r from-indigo-650 via-purple-650 to-pink-650 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent flex items-center gap-2"
          >
            <span>Tasks</span>
          </motion.h1>
        )}
        {isCollapsed && (
          <FaTasks className="text-xl text-indigo-600 dark:text-indigo-400" />
        )}
      </div>

      {/* Profile Section */}
      <div
        className={`p-6 border-b border-slate-100 dark:border-slate-800/80 flex items-center gap-4 ${isCollapsed ? "justify-center" : ""}`}
      >
        <img
          src={
            user?.image ||
            `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || "User"}`
          }
          alt="Avatar"
          className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-0.5 object-cover"
        />
        {!isCollapsed && (
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
              {user?.name}
            </span>
            <span className="text-xs text-indigo-605 dark:text-indigo-400 font-medium capitalize flex items-center gap-1">
              <FaUserCircle className="text-[10px]" /> {userRole}
            </span>
          </div>
        )}
      </div>

      {/* Navigation List */}
      <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
        {visibleNavItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                setIsMobileOpen(false);
              }}
              className={`relative w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all group duration-300 ${
                isActive
                  ? "text-indigo-600 dark:text-indigo-400 font-semibold"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-905 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/40"
              } ${isCollapsed ? "justify-center" : ""}`}
            >
              {/* Active Highlight Tab */}
              {isActive && (
                <motion.div
                  layoutId="activeNavBackground"
                  className="absolute inset-0 bg-indigo-50/60 dark:bg-slate-800/80 border border-indigo-100/50 dark:border-slate-700/60 rounded-xl z-0"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}

              <span className="relative z-10 flex items-center justify-center">
                <Icon
                  className={`text-lg transition-transform duration-300 group-hover:scale-110 ${isActive ? "text-indigo-600 dark:text-indigo-400" : ""}`}
                />
              </span>

              {!isCollapsed && (
                <span className="relative z-10 truncate">{item.name}</span>
              )}

              {/* Tooltip for Collapsed Sidebar */}
              {isCollapsed && (
                <div className="absolute left-16 hidden group-hover:block bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 text-xs px-2.5 py-1.5 rounded-lg shadow-xl whitespace-nowrap z-50">
                  {item.name}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
        {/* Theme Toggle Button */}
        <button
          onClick={() => dispatch(toggleTheme())}
          className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
            theme === "dark"
              ? "text-amber-400 hover:bg-amber-500/10"
              : "text-indigo-600 hover:bg-indigo-500/10"
          } ${isCollapsed ? "justify-center" : ""}`}
        >
          {theme === "dark" ? (
            <FaSun className="text-lg" />
          ) : (
            <FaMoon className="text-lg" />
          )}
          {!isCollapsed && (
            <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
          )}
          {isCollapsed && (
            <div className="absolute left-16 hidden group-hover:block bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 text-xs px-2.5 py-1.5 rounded-lg shadow-xl whitespace-nowrap z-50">
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </div>
          )}
        </button>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 dark:hover:bg-rose-500/10 transition-all duration-300 ${
            isCollapsed ? "justify-center" : ""
          }`}
        >
          <FaSignOutAlt className="text-lg" />
          {!isCollapsed && <span>Logout</span>}
          {isCollapsed && (
            <div className="absolute left-16 hidden group-hover:block bg-white dark:bg-slate-950 text-rose-500 border border-slate-250 dark:border-slate-800 text-xs px-2.5 py-1.5 rounded-lg shadow-xl whitespace-nowrap z-50">
              Logout
            </div>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-805 text-slate-700 dark:text-slate-100 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition shadow-lg shadow-black/10 dark:shadow-black/40"
        >
          {isMobileOpen ? (
            <FaTimes className="text-lg" />
          ) : (
            <FaBars className="text-lg" />
          )}
        </button>
      </div>

      {/* Collapsed/Expanded Sidebar for Large Screens */}
      <div className="hidden lg:block relative h-screen">
        <motion.div
          animate={{ width: isCollapsed ? "80px" : "260px" }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="h-full flex flex-col"
        >
          <SidebarContent />
        </motion.div>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3.5 top-8 p-1.5 bg-white dark:bg-slate-955 border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-indigo-650 dark:hover:text-indigo-400 rounded-full cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors z-40 shadow-md"
        >
          {isCollapsed ? (
            <FaChevronRight className="text-xs" />
          ) : (
            <FaChevronLeft className="text-xs" />
          )}
        </button>
      </div>

      {/* Mobile Sidebar Overlay Drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm z-40"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="lg:hidden fixed top-0 bottom-0 left-0 w-65 z-50 shadow-2xl"
            >
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
