const BASE_URL = import.meta.env.VITE_BASE_URL;

// Auth
export const authEndPoints = {
  SIGNUP_API: BASE_URL + "/auth/signup",
  LOGIN_API: BASE_URL + "/auth/login",
};

// Tasks
export const taskEndPoints = {
  CREATE_TASK_API: BASE_URL + "/tasks/create",
  GET_TASKS_API: BASE_URL + "/tasks",
  UPDATE_TASK_API: BASE_URL + "/tasks",
  DELETE_TASK_API: BASE_URL + "/tasks",
};

// Admin
export const adminEndPoints = {
  GET_USERS_API: BASE_URL + "/admin/users",
  DELETE_USER_API: BASE_URL + "/admin/users",
  UPDATE_USER_STATUS_API: BASE_URL + "/admin/users",
  GET_ALL_TASKS_API: BASE_URL + "/admin/tasks",
  DELETE_TASK_API: BASE_URL + "/admin/tasks",
  GET_ACTIVITIES_API: BASE_URL + "/admin/activities",
};
