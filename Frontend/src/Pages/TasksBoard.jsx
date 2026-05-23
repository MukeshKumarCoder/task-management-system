import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  fetchUserTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../Services/Operations/TaskAPI";
import {
  FaPlus,
  FaEdit,
  FaTrashAlt,
  FaCheckCircle,
  FaRegCircle,
  FaSpinner,
  FaTimes,
  FaClipboardCheck,
  FaHourglassHalf,
  FaListUl,
} from "react-icons/fa";

const TasksBoard = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { tasks, loading, filterStatus } = useSelector((state) => state.task);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "Pending",
  });

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
    setFormData({
      title: task.title,
      description: task.description || "",
      status: task.status,
    });
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
      dispatch(
        createTask(
          formData.title,
          formData.description,
          formData.status,
          token,
        ),
      );
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
  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Filter logical display
  const filteredTasks = tasks.filter((t) => {
    if (filterStatus === "Completed") return t.status === "Completed";
    if (filterStatus === "Pending") return t.status === "Pending";
    return true;
  });

  return (
    <div className="space-y-8 w-full text-gray-800 dark:text-gray-100 transition-all duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
            My Workspace Dashboard
          </h1>

          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Track, execute and monitor your items
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleOpenCreate}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white font-semibold shadow-lg shadow-indigo-600/20 cursor-pointer"
        >
          <FaPlus />
          New Task
        </motion.button>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#161B22] border border-gray-200 dark:border-[#1F2937]">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-500 uppercase">Total Tasks</p>

              <h2 className="text-3xl font-bold mt-2">{totalTasks}</h2>
            </div>

            <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-[#0D1117] flex items-center justify-center">
              <FaListUl />
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#161B22] border border-gray-200 dark:border-[#1F2937]">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-500 uppercase">Completed</p>

              <h2 className="text-3xl font-bold text-emerald-500 mt-2">
                {completedTasks}
              </h2>
            </div>

            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <FaClipboardCheck />
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#161B22] border border-gray-200 dark:border-[#1F2937]">
          <div className="flex justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase">Pending</p>

              <h2 className="text-3xl font-bold text-amber-500 mt-2">
                {pendingTasks}
              </h2>
            </div>

            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <FaHourglassHalf />
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#161B22] border border-gray-200 dark:border-[#1F2937]">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-500 uppercase">Completion</p>

              <h2 className="text-3xl text-indigo-500 font-bold mt-2">
                {completionRate}%
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-3">
        {["All", "Pending", "Completed"].map((status) => (
          <button
            key={status}
            onClick={() =>
              dispatch({
                type: "task/setFilterStatus",
                payload: status,
              })
            }
            className={`px-4 py-2 rounded-xl text-sm transition ${
              filterStatus === status
                ? "bg-indigo-600 text-white"
                : "bg-white dark:bg-[#161B22] border border-gray-200 dark:border-[#1F2937]"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Task Grid */}

      {loading ? (
        <div className="flex flex-col items-center py-20 gap-4">
          <FaSpinner className="animate-spin text-4xl text-indigo-500" />
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="p-10 rounded-3xl bg-white dark:bg-[#161B22] border border-gray-200 dark:border-[#1F2937] text-center">
          <p className="text-gray-500">No tasks found</p>
        </div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredTasks.map((task) => {
              const isCompleted = task.status === "Completed";

              return (
                <motion.div
                  key={task._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="p-6 rounded-2xl bg-white dark:bg-[#161B22] border border-gray-200 dark:border-[#1F2937] hover:border-indigo-500/40 transition-all"
                >
                  <div className="flex justify-between gap-3">
                    <h2
                      className={`font-semibold text-base break-words ${
                        isCompleted ? "line-through text-gray-400" : ""
                      }`}
                    >
                      {task.title}
                    </h2>

                    <button
                      onClick={() => handleToggleStatus(task)}
                      className="text-indigo-500 cursor-pointer"
                    >
                      {isCompleted ? <FaCheckCircle /> : <FaRegCircle />}
                    </button>
                  </div>

                  <p className="text-sm text-gray-500 mt-3 break-words">
                    {task.description || "No description"}
                  </p>

                  <div className="flex justify-between items-center mt-5 pt-4 border-t border-gray-200 dark:border-[#30363D]">
                    <span
                      className={`text-xs px-3 py-1 rounded-full ${
                        isCompleted
                          ? "bg-emerald-500/10 text-emerald-500"
                          : "bg-amber-500/10 text-amber-500"
                      }`}
                    >
                      {task.status}
                    </span>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOpenEdit(task)}
                        className="p-2 rounded-lg bg-gray-100 dark:bg-[#0D1117] cursor-pointer"
                      >
                        <FaEdit />
                      </button>

                      <button
                        onClick={() => handleDelete(task._id)}
                        className="p-2 rounded-lg bg-rose-500/10 text-rose-500 cursor-pointer"
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

      {/* Modal */}

      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="fixed left-1/2 top-1/2 w-[95%] sm:w-full max-w-md -translate-x-1/2 -translate-y-1/2 z-50 p-6 rounded-3xl bg-white dark:bg-[#161B22] border border-gray-200 dark:border-[#1F2937]"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-bold text-xl">
                  {isEditMode ? "Edit Task" : "Create Task"}
                </h2>

                <button
                  onClick={handleCloseModal}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#0D1117]"
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Task title"
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#0D1117] border border-gray-200 dark:border-[#30363D]"
                />

                <textarea
                  rows="4"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Description"
                  className="w-full px-4 py-3 rounded-xl resize-none bg-gray-50 dark:bg-[#0D1117] border border-gray-200 dark:border-[#30363D]"
                />

                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, status: e.target.value }))
                  }
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#0D1117] border border-gray-200 dark:border-[#30363D]"
                >
                  <option value="Pending">Pending</option>

                  <option value="Completed">Completed</option>
                </select>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 py-3 rounded-xl bg-gray-100 dark:bg-[#0D1117] cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-indigo-600 text-white cursor-pointer"
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
