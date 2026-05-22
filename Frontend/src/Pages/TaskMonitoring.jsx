import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllTasks, removeAdminTask } from "../Services/Operations/AdminAPI";
import { motion, AnimatePresence } from "framer-motion";
import { FaTrashAlt, FaSearch, FaClipboardList, FaSpinner, FaUserAlt, FaCheckCircle, FaHourglassHalf } from "react-icons/fa";

const TaskMonitoring = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { adminTasks, loading } = useSelector((state) => state.task);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (token) {
      dispatch(fetchAllTasks(token));
    }
  }, [dispatch, token]);

  const handleDelete = (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      dispatch(removeAdminTask(taskId, token));
    }
  };

  const filteredTasks = adminTasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.createdBy?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalTasks = adminTasks.length;
  const completedTasks = adminTasks.filter((t) => t.status === "Completed").length;
  const pendingTasks = adminTasks.filter((t) => t.status === "Pending").length;

  return (
    <div className="space-y-8 w-full pb-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          Task Monitoring Overview
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Monitor system-wide tasks and operations created by all platform users.
        </p>
      </div>

      {/* Stats Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-slate-900/40 border border-slate-800/80 rounded-2xl flex items-center justify-between backdrop-blur-md">
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">System-wide Tasks</span>
            <div className="text-3xl font-bold text-slate-100">{totalTasks}</div>
          </div>
          <div className="w-12 h-12 bg-slate-800/50 border border-slate-700/30 rounded-xl flex items-center justify-center text-slate-400 text-lg">
            <FaClipboardList />
          </div>
        </div>

        <div className="p-6 bg-slate-900/40 border border-slate-800/80 rounded-2xl flex items-center justify-between backdrop-blur-md">
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Completed System-wide</span>
            <div className="text-3xl font-bold text-emerald-400">{completedTasks}</div>
          </div>
          <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 text-lg">
            <FaCheckCircle />
          </div>
        </div>

        <div className="p-6 bg-slate-900/40 border border-slate-800/80 rounded-2xl flex items-center justify-between backdrop-blur-md">
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Pending System-wide</span>
            <div className="text-3xl font-bold text-amber-400">{pendingTasks}</div>
          </div>
          <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center text-amber-400 text-lg">
            <FaHourglassHalf className="animate-pulse" />
          </div>
        </div>
      </div>

      {/* Control Actions & Task Board */}
      <div className="space-y-5">
        {/* Search */}
        <div className="relative w-full max-w-md group">
          <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors">
            <FaSearch className="text-sm" />
          </span>
          <input
            type="text"
            placeholder="Search tasks by title or creator..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-slate-900/60 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none rounded-xl text-sm transition placeholder:text-slate-600 hover:border-slate-700"
          />
        </div>

        {/* Tasks List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <FaSpinner className="text-3xl text-indigo-500 animate-spin" />
            <span className="text-sm text-slate-500 font-medium">Loading system-wide tasks data...</span>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-slate-900/20 border border-slate-900/40">
            <p className="text-slate-500 text-sm font-medium">No tasks found matching this criteria.</p>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredTasks.map((task) => {
                const isCompleted = task.status === "Completed";
                const creator = task.createdBy;

                return (
                  <motion.div
                    key={task._id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.25 }}
                    className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-slate-700/60 transition-all flex flex-col justify-between group shadow-sm"
                  >
                    {/* Header */}
                    <div className="space-y-4">
                      {/* Creator badge */}
                      <div className="flex items-center gap-2.5 bg-slate-950/60 p-2 rounded-xl border border-slate-800/50">
                        <img
                          src={creator?.image || `https://api.dicebear.com/7.x/initials/svg?seed=${creator?.name || "User"}`}
                          alt="Avatar"
                          className="w-6.5 h-6.5 rounded-lg border border-slate-800 object-cover"
                        />
                        <div className="flex flex-col overflow-hidden">
                          <span className="text-[10px] font-semibold text-slate-300 truncate leading-none">{creator?.name || "Deleted User"}</span>
                          <span className="text-[9px] text-slate-500 leading-none mt-1 capitalize">{creator?.role || "User"}</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <h3 className="text-sm font-semibold text-slate-100">{task.title}</h3>
                        <p className="text-xs text-slate-400 leading-relaxed truncate-2-lines">
                          {task.description || "No description provided."}
                        </p>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between border-t border-slate-800/60 pt-4 mt-5">
                      <span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold ${
                        isCompleted ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
                      }`}>
                        {task.status}
                      </span>

                      <button
                        onClick={() => handleDelete(task._id)}
                        className="p-2 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500 hover:text-white hover:border-transparent text-rose-400 rounded-lg transition duration-200 cursor-pointer text-xs"
                      >
                        <FaTrashAlt />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TaskMonitoring;
