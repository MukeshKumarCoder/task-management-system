import { toast } from "react-toastify";
import { adminEndPoints } from "../apis";
import { apiConnector } from "../apiConnector";
import {
  setLoading,
  setAdminUsers,
  updateUserStatusInState,
  deleteUserFromState,
  setAdminTasks,
  deleteAdminTaskFromState,
  setActivityLogs,
} from "../../Slices/taskSlice";

const {
  GET_USERS_API,
  DELETE_USER_API,
  UPDATE_USER_STATUS_API,
  GET_ALL_TASKS_API,
  DELETE_TASK_API,
  GET_ACTIVITIES_API,
} = adminEndPoints;

export const fetchUsers = (token) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("GET", GET_USERS_API, null, {
        Authorization: `Bearer ${token}`,
      });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      dispatch(setAdminUsers(response.data.users));
    } catch (error) {
      // console.error("ADMIN GET USERS ERROR:", error);
      toast.error(error.response?.data?.message || "Failed to fetch users.");
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const removeUser = (id, token) => {
  return async (dispatch) => {
    try {
      const response = await apiConnector("DELETE", `${DELETE_USER_API}/${id}`, null, {
        Authorization: `Bearer ${token}`,
      });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      dispatch(deleteUserFromState(id));
      toast.success("User and all their tasks deleted!");
    } catch (error) {
      // console.error("ADMIN DELETE USER ERROR:", error);
      toast.error(error.response?.data?.message || "Failed to delete user.");
    }
  };
};

export const toggleUserStatus = (id, status, token) => {
  return async (dispatch) => {
    try {
      const response = await apiConnector(
        "PUT",
        `${UPDATE_USER_STATUS_API}/${id}/status`,
        { status },
        {
          Authorization: `Bearer ${token}`,
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      dispatch(updateUserStatusInState({ id, status }));
      toast.success(`User is now ${status}!`);
    } catch (error) {
      // console.error("ADMIN UPDATE STATUS ERROR:", error);
      toast.error(error.response?.data?.message || "Failed to update user status.");
    }
  };
};

export const fetchAllTasks = (token) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("GET", GET_ALL_TASKS_API, null, {
        Authorization: `Bearer ${token}`,
      });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      dispatch(setAdminTasks(response.data.tasks));
    } catch (error) {
      // console.error("ADMIN GET ALL TASKS ERROR:", error);
      toast.error(error.response?.data?.message || "Failed to fetch tasks.");
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const removeAdminTask = (id, token) => {
  return async (dispatch) => {
    try {
      const response = await apiConnector("DELETE", `${DELETE_TASK_API}/${id}`, null, {
        Authorization: `Bearer ${token}`,
      });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      dispatch(deleteAdminTaskFromState(id));
      toast.success("Task deleted by admin!");
    } catch (error) {
      // console.error("ADMIN DELETE TASK ERROR:", error);
      toast.error(error.response?.data?.message || "Failed to delete task.");
    }
  };
};

export const fetchActivityLogs = (token) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("GET", GET_ACTIVITIES_API, null, {
        Authorization: `Bearer ${token}`,
      });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      dispatch(setActivityLogs(response.data.logs));
    } catch (error) {
      // console.error("ADMIN GET ACTIVITIES ERROR:", error);
      toast.error(error.response?.data?.message || "Failed to fetch activity logs.");
    } finally {
      dispatch(setLoading(false));
    }
  };
};
