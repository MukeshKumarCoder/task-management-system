import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  fetchAllTasks,
  removeAdminTask,
} from "../Services/Operations/AdminAPI";
import {
  FaTrashAlt,
  FaSearch,
  FaClipboardList,
  FaSpinner,
  FaCheckCircle,
  FaHourglassHalf,
} from "react-icons/fa";

const TaskMonitoring = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { adminTasks, loading } = useSelector((state) => state.task);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (token) dispatch(fetchAllTasks(token));
  }, [dispatch, token]);

  const handleDelete = (taskId) => {
    if (window.confirm("Delete this task?")) {
      dispatch(removeAdminTask(taskId, token));
    }
  };

  const filteredTasks = adminTasks.filter((task) => {
    const title = task?.title?.toLowerCase() || "";
    const creator = task?.createdBy?.name?.toLowerCase() || "";

    return (
      title.includes(searchTerm.toLowerCase()) ||
      creator.includes(searchTerm.toLowerCase())
    );
  });

  const totalTasks = adminTasks.length;
  const completedTasks = adminTasks.filter(
    (t) => t.status === "Completed",
  ).length;

  const pendingTasks = adminTasks.filter((t) => t.status === "Pending").length;

  return (
    <div className="space-y-8 w-full pb-12 text-slate-800 dark:text-slate-200">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
          Task Monitoring Overview
        </h1>

        <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
          Monitor tasks created by all users across the system.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border dark:border-slate-800 shadow-sm flex justify-between">
          <div>
            <p className="text-xs uppercase text-slate-500 font-semibold">
              Total Tasks
            </p>

            <h2 className="text-3xl mt-2 font-bold">{totalTasks}</h2>
          </div>

          <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex justify-center items-center">
            <FaClipboardList />
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border dark:border-slate-800 shadow-sm flex justify-between">
          <div>
            <p className="text-xs uppercase text-slate-500 font-semibold">
              Completed
            </p>

            <h2 className="text-3xl mt-2 font-bold text-emerald-500">
              {completedTasks}
            </h2>
          </div>

          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex justify-center items-center">
            <FaCheckCircle />
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border dark:border-slate-800 shadow-sm flex justify-between">
          <div>
            <p className="text-xs uppercase text-slate-500 font-semibold">
              Pending
            </p>

            <h2 className="text-3xl mt-2 font-bold text-amber-500">
              {pendingTasks}
            </h2>
          </div>

          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex justify-center items-center">
            <FaHourglassHalf className="animate-pulse" />
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by task or creator..."
          className="w-full pl-11 pr-4 py-3 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
        />
      </div>

      {/* Tasks */}
      {loading ? (
        <div className="flex flex-col justify-center items-center py-20 gap-4">
          <FaSpinner className="animate-spin text-3xl text-indigo-500" />

          <p className="text-sm text-slate-500">Loading tasks...</p>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="rounded-2xl p-10 bg-white dark:bg-slate-900 border dark:border-slate-800 text-center">
          <p className="text-slate-500">No tasks found</p>
        </div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredTasks.map((task) => {
              const creator = task.createdBy;

              return (
                <motion.div
                  key={task._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-lg transition"
                >
                  <div className="space-y-5">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          creator?.image ||
                          `https://api.dicebear.com/7.x/initials/svg?seed=${
                            creator?.name || "User"
                          }`
                        }
                        alt=""
                        className="w-10 h-10 rounded-xl"
                      />

                      <div>
                        <h4 className="font-semibold">
                          {creator?.name || "Deleted User"}
                        </h4>

                        <p className="text-xs text-slate-500 capitalize">
                          {creator?.role || "User"}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-lg">{task.title}</h3>

                      <p className="text-sm text-slate-500 mt-2">
                        {task.description || "No description"}
                      </p>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t dark:border-slate-800">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          task.status === "Completed"
                            ? "bg-emerald-500/10 text-emerald-500"
                            : "bg-amber-500/10 text-amber-500"
                        }`}
                      >
                        {task.status}
                      </span>

                      <button
                        onClick={() => handleDelete(task._id)}
                        className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white transition"
                      >
                        <FaTrashAlt />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default TaskMonitoring;
