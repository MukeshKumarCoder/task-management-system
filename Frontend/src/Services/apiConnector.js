import axios from "axios";
import store from "../Store/store";
import { logout } from "../Slices/authSlice";

export const axiosInstance = axios.create({});

// Intercept responses to handle account deactivation
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 403) {
      const message = error.response.data?.message || "";
      if (message.toLowerCase().includes("deactivated")) {
        store.dispatch(logout());
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export const apiConnector = (method, url, bodyData, headers, params) => {
  return axiosInstance({
    method: `${method}`,
    url: `${url}`,
    data: bodyData ? bodyData : null,
    headers: headers ? headers : null,
    params: params ? params : null,
  });
};
