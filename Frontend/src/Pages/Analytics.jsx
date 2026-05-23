import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, fetchAllTasks } from "../Services/Operations/AdminAPI";
import { motion } from "framer-motion";
import {
  FaUsers,
  FaClipboardList,
  FaCheckCircle,
  FaHourglassHalf,
  FaSpinner,
  FaUserCheck,
  FaUserTimes,
  FaChartPie,
  FaPercentage,
} from "react-icons/fa";

const Analytics = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { adminUsers, adminTasks, loading } = useSelector(
    (state) => state.task,
  );

  useEffect(() => {
    if (token) {
      dispatch(fetchUsers(token));
      dispatch(fetchAllTasks(token));
    }
  }, [dispatch, token]);

  const totalUsers = adminUsers.length;
  const activeUsers = adminUsers.filter((u) => u.status === "Active").length;
  const inactiveUsers = adminUsers.filter(
    (u) => u.status === "Inactive",
  ).length;

  const totalTasks = adminTasks.length;
  const completedTasks = adminTasks.filter(
    (t) => t.status === "Completed",
  ).length;
  const pendingTasks = adminTasks.filter((t) => t.status === "Pending").length;

  const taskCompletionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const activeUserRate =
    totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0;

  // Group tasks by user for detail section
  const userStats = adminUsers.map((user) => {
    const userTasks = adminTasks.filter((t) => t.createdBy?._id === user._id);
    const uTotal = userTasks.length;
    const uCompleted = userTasks.filter((t) => t.status === "Completed").length;
    const uPending = userTasks.filter((t) => t.status === "Pending").length;
    return {
      ...user,
      total: uTotal,
      completed: uCompleted,
      pending: uPending,
      completionRate: uTotal > 0 ? Math.round((uCompleted / uTotal) * 100) : 0,
    };
  });

  return (
    <div className="space-y-8 w-full pb-12 text-slate-800 dark:text-slate-200 transition-colors duration-300">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight bg-linear-to-l from-indigo-650 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent ">
          System Analytics
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Unified administration reporting overview of user scopes, platform
          tasks, and completion metrics.
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-3">
          <FaSpinner className="text-3xl text-indigo-500 animate-spin" />
          <span className="text-sm text-slate-500 font-medium">
            Aggregating platform metrics...
          </span>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Stat Card 1: Total Users */}
            <div className="p-6 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 rounded-2xl flex items-center justify-between shadow-sm backdrop-blur-md">
              <div className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-550 dark:text-slate-500">
                  Total Users
                </span>
                <div className="text-3xl font-bold text-slate-800 dark:text-slate-100">
                  {totalUsers}
                </div>
              </div>
              <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-lg">
                <FaUsers />
              </div>
            </div>

            {/* Stat Card 2: Total Tasks */}
            <div className="p-6 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 rounded-2xl flex items-center justify-between shadow-sm backdrop-blur-md">
              <div className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-550 dark:text-slate-500">
                  Total Tasks
                </span>
                <div className="text-3xl font-bold text-slate-800 dark:text-slate-100">
                  {totalTasks}
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400 text-lg">
                <FaClipboardList />
              </div>
            </div>

            {/* Stat Card 3: Completed Tasks */}
            <div className="p-6 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 rounded-2xl flex items-center justify-between shadow-sm backdrop-blur-md">
              <div className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-550 dark:text-slate-500">
                  Completed Tasks
                </span>
                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                  {completedTasks}
                </div>
              </div>
              <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-lg">
                <FaCheckCircle />
              </div>
            </div>

            {/* Stat Card 4: Pending Tasks */}
            <div className="p-6 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 rounded-2xl flex items-center justify-between shadow-sm backdrop-blur-md">
              <div className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-550 dark:text-slate-500">
                  Pending Tasks
                </span>
                <div className="text-3xl font-bold text-amber-605 dark:text-amber-400">
                  {pendingTasks}
                </div>
              </div>
              <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center text-amber-600 dark:text-amber-400 text-lg">
                <FaHourglassHalf className="animate-pulse" />
              </div>
            </div>
          </div>

          {/* Visual Indicators */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Task Ratio */}
            <div className="p-6 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 rounded-2xl space-y-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-650 dark:text-indigo-400">
                  <FaChartPie className="text-sm" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Task Progress Rates
                </h3>
              </div>

              <div className="space-y-4">
                {/* Completion Rate Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-500">Completion rate</span>
                    <span className="text-indigo-600 dark:text-indigo-400">
                      {taskCompletionRate}%
                    </span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 dark:bg-slate-805 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${taskCompletionRate}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-linear-to-r from-indigo-505 to-indigo-600 rounded-full"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs text-slate-550 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800/50">
                  <span>
                    Completed tasks:{" "}
                    <b className="text-slate-800 dark:text-slate-200">
                      {completedTasks}
                    </b>
                  </span>
                  <span>
                    Pending tasks:{" "}
                    <b className="text-slate-800 dark:text-slate-200">
                      {pendingTasks}
                    </b>
                  </span>
                </div>
              </div>
            </div>

            {/* User Account */}
            <div className="p-6 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 rounded-2xl space-y-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/10 rounded-lg text-purple-650 dark:text-purple-400">
                  <FaPercentage className="text-sm" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  User Account Standing
                </h3>
              </div>

              <div className="space-y-4">
                {/* Active Accounts Rate Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-500">Active User Ratio</span>
                    <span className="text-purple-600 dark:text-purple-400">
                      {activeUserRate}%
                    </span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 dark:bg-slate-805 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${activeUserRate}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-linear-to-r from-purple-505 to-purple-600 rounded-full"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs text-slate-550 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800/50">
                  <span className="flex items-center gap-1.5">
                    <FaUserCheck className="text-emerald-500" /> Active:{" "}
                    <b className="text-slate-800 dark:text-slate-200">
                      {activeUsers}
                    </b>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <FaUserTimes className="text-amber-500" /> Inactive:{" "}
                    <b className="text-slate-800 dark:text-slate-200">
                      {inactiveUsers}
                    </b>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* User Task Distribution Table */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Workspace Task Load Distribution
            </h3>
            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/25 shadow-sm">
              <table className="min-w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    <th className="py-4 px-6">User</th>
                    <th className="py-4 px-6">Role</th>
                    <th className="py-4 px-6 text-center">Total Tasks</th>
                    <th className="py-4 px-6 text-center text-emerald-600 dark:text-emerald-400">
                      Completed
                    </th>
                    <th className="py-4 px-6 text-center text-amber-605 dark:text-amber-400">
                      Pending
                    </th>
                    <th className="py-4 px-6 text-right">Completion Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm text-slate-600 dark:text-slate-300">
                  {userStats.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition duration-150"
                    >
                      <td className="py-4 px-6 flex items-center gap-3">
                        <img
                          src={
                            user.image ||
                            `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`
                          }
                          alt="Avatar"
                          className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-950 p-0.5 object-cover"
                        />
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-800 dark:text-slate-100">
                            {user.name}
                          </span>
                          <span className="text-[10px] text-slate-400 dark:text-slate-550 truncate max-w-37.5">
                            {user.email}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-medium capitalize text-xs">
                        {user.role}
                      </td>
                      <td className="py-4 px-6 text-center font-semibold text-slate-800 dark:text-slate-100">
                        {user.total}
                      </td>
                      <td className="py-4 px-6 text-center text-emerald-600 dark:text-emerald-400 font-semibold">
                        {user.completed}
                      </td>
                      <td className="py-4 px-6 text-center text-amber-605 dark:text-amber-400 font-semibold">
                        {user.pending}
                      </td>
                      <td className="py-4 px-6 text-right font-bold text-indigo-600 dark:text-indigo-400">
                        {user.completionRate}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
