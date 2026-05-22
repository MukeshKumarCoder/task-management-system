import { toast } from "react-toastify";
import { taskEndPoints } from "../apis";
import { apiConnector } from "../apiConnector";
import {
  setLoading,
  setTasks,
  addTask,
  updateTaskInState,
  deleteTaskFromState,
} from "../../Slices/taskSlice";

const { CREATE_TASK_API, GET_TASKS_API, UPDATE_TASK_API, DELETE_TASK_API } = taskEndPoints;

export const fetchUserTasks = (token) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await apiConnector(
        "GET",
        GET_TASKS_API,
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      dispatch(setTasks(response.data.tasks));
    } catch (error) {
      console.error("GET TASKS API ERROR:", error);
      toast.error(error.response?.data?.message || "Failed to retrieve tasks.");
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const createTask = (title, description, status, token) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await apiConnector(
        "POST",
        CREATE_TASK_API,
        { title, description, status },
        {
          Authorization: `Bearer ${token}`,
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Task Created Successfully!");
      dispatch(addTask(response.data.task));
    } catch (error) {
      console.error("CREATE TASK API ERROR:", error);
      toast.error(error.response?.data?.message || "Failed to create task.");
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const updateTask = (id, updatedFields, token) => {
  return async (dispatch) => {
    try {
      const response = await apiConnector(
        "PUT",
        `${UPDATE_TASK_API}/${id}`,
        updatedFields,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      dispatch(updateTaskInState(response.data.task));
      toast.success("Task Updated!");
    } catch (error) {
      console.error("UPDATE TASK API ERROR:", error);
      toast.error(error.response?.data?.message || "Failed to update task.");
    }
  };
};

export const deleteTask = (id, token) => {
  return async (dispatch) => {
    try {
      const response = await apiConnector(
        "DELETE",
        `${DELETE_TASK_API}/${id}`,
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      dispatch(deleteTaskFromState(id));
      toast.success("Task Deleted!");
    } catch (error) {
      console.error("DELETE TASK API ERROR:", error);
      toast.error(error.response?.data?.message || "Failed to delete task.");
    }
  };
};
