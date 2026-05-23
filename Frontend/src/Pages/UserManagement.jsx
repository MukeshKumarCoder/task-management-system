import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUsers,
  removeUser,
  toggleUserStatus,
} from "../Services/Operations/AdminAPI";
import { motion } from "framer-motion";
import {
  FaUserCircle,
  FaTrashAlt,
  FaSearch,
  FaEnvelope,
  FaUserTag,
  FaCircle,
  FaSpinner,
} from "react-icons/fa";

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
        "Are you sure you want to delete this user? This will also permanently delete all tasks created by this user.",
      )
    ) {
      dispatch(removeUser(userId, token));
    }
  };

  const filteredUsers = adminUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalUsers = adminUsers.length;
  const activeUsers = adminUsers.filter((u) => u.status === "Active").length;
  const inactiveUsers = adminUsers.filter(
    (u) => u.status === "Inactive",
  ).length;

  return (
    <div className="space-y-8 w-full pb-12 text-gray-800 dark:text-gray-200">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
          User Management Dashboard
        </h1>

        <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
          Review, activate, deactivate or manage platform users
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        <div className="p-6 rounded-2xl bg-white dark:bg-[#161B22] border border-gray-200 dark:border-[#1F2937]">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs uppercase text-gray-500">
                Registered Users
              </p>

              <h2 className="text-3xl font-bold mt-2">{totalUsers}</h2>
            </div>

            <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-[#0D1117] flex items-center justify-center">
              <FaUserCircle className="text-lg" />
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-[#161B22] border border-gray-200 dark:border-[#1F2937]">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs uppercase text-gray-500">Active Accounts</p>

              <h2 className="text-3xl font-bold text-emerald-500 mt-2">
                {activeUsers}
              </h2>
            </div>

            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <FaCircle className="animate-pulse text-xs" />
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-[#161B22] border border-gray-200 dark:border-[#1F2937]">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs uppercase text-gray-500">
                Inactive Accounts
              </p>

              <h2 className="text-3xl font-bold text-amber-500 mt-2">
                {inactiveUsers}
              </h2>
            </div>

            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
              <FaCircle className="text-xs" />
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md w-full group">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500">
          <FaSearch />
        </span>

        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-xl bg-white dark:bg-[#161B22] border border-gray-200 dark:border-[#1F2937] focus:border-indigo-500 outline-none"
        />
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex flex-col items-center py-20 gap-4">
          <FaSpinner className="animate-spin text-4xl text-indigo-500" />

          <p className="text-sm text-gray-500">Loading users...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="p-10 rounded-3xl text-center bg-white dark:bg-[#161B22] border border-gray-200 dark:border-[#1F2937]">
          <p className="text-gray-500">No users found</p>
        </div>
      ) : (
        <>
          {/* Desktop */}
          <div className="hidden lg:block overflow-x-auto rounded-2xl bg-white dark:bg-[#161B22] border border-gray-200 dark:border-[#1F2937]">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-[#30363D] text-left text-xs uppercase text-gray-500">
                  <th className="px-6 py-4">User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th className="text-right px-6">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="border-b border-gray-200 dark:border-[#30363D] hover:bg-gray-50 dark:hover:bg-[#0D1117]"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            user.image ||
                            `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`
                          }
                          className="w-10 h-10 rounded-xl"
                        />

                        <div>
                          <h3 className="font-semibold">{user.name}</h3>

                          <p className="text-xs text-gray-500">
                            {user._id.slice(-6)}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="flex items-center gap-2 text-gray-500">
                        <FaEnvelope />
                        {user.email}
                      </div>
                    </td>
                    <td>
                      <div className="flex gap-2 items-center">
                        <FaUserTag className="text-indigo-500" />
                        {user.role}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            handleToggleStatus(user._id, user.status)
                          }
                          className={`w-11 h-6 rounded-full p-1 flex transition cursor-pointer ${
                            user.status === "Active"
                              ? "bg-indigo-600 justify-end"
                              : "bg-gray-300 dark:bg-[#30363D]"
                          }`}
                        >
                          <motion.div
                            layout
                            className="w-4 h-4 rounded-full bg-white"
                          />
                        </button>

                        <span
                          className={`text-xs ${
                            user.status === "Active"
                              ? "text-emerald-500"
                              : "text-amber-500"
                          }`}
                        >
                          {user.status}
                        </span>
                      </div>
                    </td>

                    <td className="text-right px-6">
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="p-2 rounded-lg bg-rose-500/10 cursor-pointer text-rose-500 hover:bg-rose-500 hover:text-white"
                      >
                        <FaTrashAlt />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="grid lg:hidden gap-4">
            {filteredUsers.map((user) => (
              <div
                key={user._id}
                className="p-5 rounded-2xl bg-white dark:bg-[#161B22] border border-gray-200 dark:border-[#1F2937]"
              >
                <div className="flex gap-3">
                  <img
                    src={
                      user.image ||
                      `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`
                    }
                    className="w-12 h-12 rounded-xl"
                  />

                  <div className="flex-1">
                    <h2 className="font-semibold">{user.name}</h2>
                    <p className="text-sm text-gray-500 break-all">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Role</p>
                    <span>{user.role}</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Status</p>
                    <span
                      className={`text-sm ${
                        user.status === "Active"
                          ? "text-emerald-500"
                          : "text-amber-500"
                      }`}
                    >
                      {user.status}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between mt-5">
                  <button
                    onClick={() => handleToggleStatus(user._id, user.status)}
                    className="px-4 py-2 rounded-xl cursor-pointer bg-indigo-600 text-white text-sm"
                  >
                    Toggle
                  </button>

                  <button
                    onClick={() => handleDelete(user._id)}
                    className="px-4 py-2 rounded-xl bg-rose-500 cursor-pointer text-white text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default UserManagement;
