import axios from "axios";
import store from "../Store/store";
import { logout } from "../Slices/authSlice";

export const axiosInstance = axios.create({});

// Intercept responses to handle account deactivation for logged-in sessions only.
// Login attempts for inactive users also return 403 — those are handled in AuthAPI.
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      const message = error.response.data?.message || "";
      const isDeactivated = message.toLowerCase().includes("deactivated");
      const isLoginRequest = error.config?.url?.includes("/auth/login");
      const { token } = store.getState().auth;

      if (isDeactivated && token && !isLoginRequest) {
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
