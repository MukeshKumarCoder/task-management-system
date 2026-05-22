import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, removeUser, toggleUserStatus } from "../Services/Operations/AdminAPI";
import { motion } from "framer-motion";
import { FaUserCircle, FaTrashAlt, FaSearch, FaEnvelope, FaUserTag, FaCircle, FaSpinner } from "react-icons/fa";

const UserManagement = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { adminUsers, loading } = useSelector((state) => state.task);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (token) {
      dispatch(fetchUsers(token));
    }
  }, [dispatch, token]);

  const handleToggleStatus = (userId, currentStatus) => {
    const nextStatus = currentStatus === "Active" ? "Inactive" : "Active";
    dispatch(toggleUserStatus(userId, nextStatus, token));
  };

  const handleDelete = (userId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this user? This will also permanently delete all tasks created by this user."
      )
    ) {
      dispatch(removeUser(userId, token));
    }
  };

  const filteredUsers = adminUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalUsers = adminUsers.length;
  const activeUsers = adminUsers.filter((u) => u.status === "Active").length;
  const inactiveUsers = adminUsers.filter((u) => u.status === "Inactive").length;

  return (
    <div className="space-y-8 w-full pb-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          User Management Dashboard
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Review, activate, deactivate, or delete registered platform users.
        </p>
      </div>

      {/* User Status Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-slate-900/40 border border-slate-800/80 rounded-2xl flex items-center justify-between backdrop-blur-md">
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Registered Users</span>
            <div className="text-3xl font-bold text-slate-100">{totalUsers}</div>
          </div>
          <div className="w-12 h-12 bg-slate-800/50 border border-slate-700/30 rounded-xl flex items-center justify-center text-slate-400 text-lg">
            <FaUserCircle />
          </div>
        </div>

        <div className="p-6 bg-slate-900/40 border border-slate-800/80 rounded-2xl flex items-center justify-between backdrop-blur-md">
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Active Accounts</span>
            <div className="text-3xl font-bold text-emerald-400">{activeUsers}</div>
          </div>
          <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 text-lg">
            <FaCircle className="text-xs animate-ping" />
          </div>
        </div>

        <div className="p-6 bg-slate-900/40 border border-slate-800/80 rounded-2xl flex items-center justify-between backdrop-blur-md">
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Inactive Accounts</span>
            <div className="text-3xl font-bold text-amber-400">{inactiveUsers}</div>
          </div>
          <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center text-amber-400 text-lg">
            <FaCircle className="text-xs" />
          </div>
        </div>
      </div>

      {/* Control Actions & User List Table */}
      <div className="space-y-5">
        {/* Search */}
        <div className="relative w-full max-w-md group">
          <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors">
            <FaSearch className="text-sm" />
          </span>
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-slate-900/60 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none rounded-xl text-sm transition placeholder:text-slate-600 hover:border-slate-700"
          />
        </div>

        {/* User Table Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <FaSpinner className="text-3xl text-indigo-500 animate-spin" />
            <span className="text-sm text-slate-500 font-medium">Loading platform user directory...</span>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-slate-900/20 border border-slate-900/40">
            <p className="text-slate-500 text-sm font-medium">No users match the search terms.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-800/80 bg-slate-900/25 shadow-lg backdrop-blur-sm">
            <table className="min-w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/60 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <th className="py-4 px-6">User Profile</th>
                  <th className="py-4 px-6">Email Address</th>
                  <th className="py-4 px-6">Access Role</th>
                  <th className="py-4 px-6">Account Status</th>
                  <th className="py-4 px-6 text-right">Administrative Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm text-slate-300">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-slate-800/20 transition duration-150">
                    <td className="py-4 px-6 flex items-center gap-3">
                      <img
                        src={user.image || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                        alt="Avatar"
                        className="w-10 h-10 rounded-xl border border-slate-700 bg-slate-950 p-0.5 object-cover"
                      />
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-100">{user.name}</span>
                        <span className="text-[10px] text-slate-500 font-semibold uppercase">ID: {user._id.slice(-6)}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-400">
                      <div className="flex items-center gap-2">
                        <FaEnvelope className="text-xs text-slate-600" />
                        <span>{user.email}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <FaUserTag className="text-xs text-indigo-400" />
                        <span className="font-medium text-slate-200 capitalize">{user.role}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {/* iOS-Style Toggle Switch */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleToggleStatus(user._id, user.status)}
                          className={`relative w-11 h-6 rounded-full p-0.5 transition duration-300 focus:outline-none cursor-pointer ${
                            user.status === "Active" ? "bg-indigo-600" : "bg-slate-800 border border-slate-750"
                          }`}
                        >
                          <motion.div
                            layout
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            className="w-5 h-5 bg-white rounded-full shadow-md"
                            style={{
                              x: user.status === "Active" ? "20px" : "0px",
                            }}
                          />
                        </button>
                        <span
                          className={`text-xs font-semibold ${
                            user.status === "Active" ? "text-indigo-400" : "text-slate-500"
                          }`}
                        >
                          {user.status}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="p-2.5 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500 hover:text-white hover:border-transparent text-rose-400 rounded-xl transition duration-200 cursor-pointer text-xs"
                      >
                        <FaTrashAlt />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
