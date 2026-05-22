import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserTasks, createTask, updateTask, deleteTask } from "../Services/Operations/TaskAPI";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPlus,
  FaEdit,
  FaTrashAlt,
  FaCheckCircle,
  FaRegCircle,
  FaFilter,
  FaSpinner,
  FaTimes,
  FaClipboardCheck,
  FaHourglassHalf,
  FaListUl
} from "react-icons/fa";

const TasksBoard = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { tasks, loading, filterStatus } = useSelector((state) => state.task);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [formData, setFormData] = useState({ title: "", description: "", status: "Pending" });

  useEffect(() => {
    if (token) {
      dispatch(fetchUserTasks(token));
    }
  }, [dispatch, token]);

  const handleOpenCreate = () => {
    setIsEditMode(false);
    setFormData({ title: "", description: "", status: "Pending" });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (task) => {
    setIsEditMode(true);
    setCurrentTask(task);
    setFormData({ title: task.title, description: task.description || "", status: task.status });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentTask(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditMode && currentTask) {
      dispatch(updateTask(currentTask._id, formData, token));
    } else {
      dispatch(createTask(formData.title, formData.description, formData.status, token));
    }
    handleCloseModal();
  };

  const handleToggleStatus = (task) => {
    const nextStatus = task.status === "Completed" ? "Pending" : "Completed";
    dispatch(updateTask(task._id, { status: nextStatus }, token));
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      dispatch(deleteTask(id, token));
    }
  };

  // Filter calculations
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "Completed").length;
  const pendingTasks = tasks.filter((t) => t.status === "Pending").length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Filter logical display
  const filteredTasks = tasks.filter((t) => {
    if (filterStatus === "Completed") return t.status === "Completed";
    if (filterStatus === "Pending") return t.status === "Pending";
    return true;
  });

  // SVG Gauge calculations
  const strokeDashoffset = 251.2 - (251.2 * completionRate) / 100;

  return (
    <div className="space-y-8 w-full pb-12">
      {/* Banner / Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            My Workspace Dashboard
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Track, execute, and monitor your items with beautiful interactive features.
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleOpenCreate}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold tracking-wide shadow-lg shadow-indigo-600/30 transition duration-300 self-start md:self-auto cursor-pointer"
        >
          <FaPlus className="text-xs" /> New Task
        </motion.button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Stat Card 1: Total */}
        <div className="p-6 bg-slate-900/40 border border-slate-800/80 rounded-2xl flex items-center justify-between backdrop-blur-md shadow-sm">
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Tasks</span>
            <div className="text-3xl font-bold text-slate-100">{totalTasks}</div>
          </div>
          <div className="w-12 h-12 bg-slate-800/50 border border-slate-700/30 rounded-xl flex items-center justify-center text-slate-400">
            <FaListUl className="text-lg" />
          </div>
        </div>

        {/* Stat Card 2: Completed */}
        <div className="p-6 bg-slate-900/40 border border-slate-800/80 rounded-2xl flex items-center justify-between backdrop-blur-md shadow-sm">
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Completed</span>
            <div className="text-3xl font-bold text-emerald-400">{completedTasks}</div>
          </div>
          <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400">
            <FaClipboardCheck className="text-lg" />
          </div>
        </div>

        {/* Stat Card 3: Pending */}
        <div className="p-6 bg-slate-900/40 border border-slate-800/80 rounded-2xl flex items-center justify-between backdrop-blur-md shadow-sm">
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Pending</span>
            <div className="text-3xl font-bold text-amber-400">{pendingTasks}</div>
          </div>
          <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center text-amber-400">
            <FaHourglassHalf className="text-md animate-pulse" />
          </div>
        </div>

        {/* Donut Progress Gauge */}
        <div className="p-6 bg-slate-900/40 border border-slate-800/80 rounded-2xl flex items-center justify-between backdrop-blur-md shadow-sm">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Completion</span>
            <div className="text-2xl font-bold text-indigo-400">{completionRate}%</div>
            <span className="text-[10px] text-slate-500 font-medium">Finished Ratio</span>
          </div>

          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="28"
                className="stroke-slate-800 fill-transparent"
                strokeWidth="4"
              />
              <motion.circle
                cx="32"
                cy="32"
                r="28"
                className="stroke-indigo-500 fill-transparent"
                strokeWidth="4"
                strokeDasharray="175.9"
                initial={{ strokeDashoffset: 175.9 }}
                animate={{ strokeDashoffset: 175.9 - (175.9 * completionRate) / 100 }}
                transition={{ duration: 1 }}
              />
            </svg>
            <span className="absolute text-[11px] font-bold text-slate-200">{completionRate}%</span>
          </div>
        </div>
      </div>

      {/* Filters & Grid View */}
      <div className="space-y-6">
        {/* Filters */}
        <div className="flex bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800/60 w-fit">
          {["All", "Pending", "Completed"].map((status) => (
            <button
              key={status}
              onClick={() => dispatch({ type: "task/setFilterStatus", payload: status })}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all duration-300 ${
                filterStatus === status
                  ? "bg-slate-850 text-indigo-400 font-semibold border border-indigo-500/20"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Task Cards Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <FaSpinner className="text-3xl text-indigo-500 animate-spin" />
            <span className="text-sm text-slate-500 font-medium">Retrieving workspace items...</span>
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
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <h3 className={`text-base font-semibold transition-all ${
                          isCompleted ? "text-slate-500 line-through decoration-indigo-500/50" : "text-slate-100"
                        }`}>
                          {task.title}
                        </h3>

                        <button
                          onClick={() => handleToggleStatus(task)}
                          className={`text-lg transition duration-200 cursor-pointer ${
                            isCompleted ? "text-indigo-400 hover:text-indigo-300" : "text-slate-600 hover:text-indigo-400"
                          }`}
                        >
                          {isCompleted ? <FaCheckCircle /> : <FaRegCircle />}
                        </button>
                      </div>

                      <p className={`text-xs leading-relaxed ${isCompleted ? "text-slate-600" : "text-slate-400"}`}>
                        {task.description || "No description provided."}
                      </p>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between border-t border-slate-800/60 pt-4 mt-5">
                      <span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold ${
                        isCompleted ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
                      }`}>
                        {task.status}
                      </span>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleOpenEdit(task)}
                          className="p-2 bg-slate-850 hover:bg-slate-800 border border-slate-800/60 hover:border-slate-700/50 text-slate-400 hover:text-slate-200 rounded-lg transition duration-200 cursor-pointer text-xs"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(task._id)}
                          className="p-2 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500 hover:text-white hover:border-transparent text-rose-400 rounded-lg transition duration-200 cursor-pointer text-xs"
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

      {/* Pop-up Edit/Create Modal (AnimatePresence allows graceful exit animations) */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center"
            />
            {/* Modal Dialog Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md p-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col gap-6"
            >
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  {isEditMode ? "Modify Task" : "Create New Task"}
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-200 transition duration-200 cursor-pointer"
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter task title"
                    className="w-full px-4 py-3 bg-slate-950/60 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none rounded-xl text-sm transition placeholder:text-slate-600 hover:border-slate-700"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Description</label>
                  <textarea
                    rows="3"
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Optional description detailing task details..."
                    className="w-full px-4 py-3 bg-slate-950/60 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none rounded-xl text-sm transition placeholder:text-slate-600 hover:border-slate-700 resize-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-950/60 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none rounded-xl text-sm transition hover:border-slate-700 text-slate-300"
                  >
                    <option value="Pending" className="bg-slate-950 text-slate-100">Pending</option>
                    <option value="Completed" className="bg-slate-950 text-slate-100">Completed</option>
                  </select>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 py-3 bg-slate-850 hover:bg-slate-800 border border-slate-850 text-slate-300 hover:text-slate-100 rounded-xl text-sm font-semibold transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition shadow-lg shadow-indigo-600/30 cursor-pointer"
                  >
                    {isEditMode ? "Save Changes" : "Create Task"}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TasksBoard;
