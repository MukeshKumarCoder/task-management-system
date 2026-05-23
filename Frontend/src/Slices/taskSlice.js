import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  tasks: [],
  adminUsers: [],
  adminTasks: [],
  activityLogs: [],
  filterStatus: "All",
};

const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setTasks(state, action) {
      state.tasks = action.payload;
    },
    addTask(state, action) {
      state.tasks.unshift(action.payload);
    },
    updateTaskInState(state, action) {
      const index = state.tasks.findIndex((t) => t._id === action.payload._id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
    deleteTaskFromState(state, action) {
      state.tasks = state.tasks.filter((t) => t._id !== action.payload);
    },
    setAdminUsers(state, action) {
      state.adminUsers = action.payload;
    },
    updateUserStatusInState(state, action) {
      const { id, status } = action.payload;
      const index = state.adminUsers.findIndex((u) => u._id === id);
      if (index !== -1) {
        state.adminUsers[index].status = status;
      }
    },
    deleteUserFromState(state, action) {
      state.adminUsers = state.adminUsers.filter((u) => u._id !== action.payload);
      state.adminTasks = state.adminTasks.filter((t) => t.createdBy?._id !== action.payload);
    },
    setAdminTasks(state, action) {
      state.adminTasks = action.payload;
    },
    deleteAdminTaskFromState(state, action) {
      state.adminTasks = state.adminTasks.filter((t) => t._id !== action.payload);
    },
    setActivityLogs(state, action) {
      state.activityLogs = action.payload;
    },
    setFilterStatus(state, action) {
      state.filterStatus = action.payload;
    },
  },
});

export const {
  setLoading,
  setTasks,
  addTask,
  updateTaskInState,
  deleteTaskFromState,
  setAdminUsers,
  updateUserStatusInState,
  deleteUserFromState,
  setAdminTasks,
  deleteAdminTaskFromState,
  setActivityLogs,
  setFilterStatus,
} = taskSlice.actions;

export default taskSlice.reducer;
