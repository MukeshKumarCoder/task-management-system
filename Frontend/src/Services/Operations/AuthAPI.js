import { toast } from "react-toastify";
import { authEndPoints } from "../apis";
import { apiConnector } from "../apiConnector";
import { setToken, setUser, setLoading, logout } from "../../Slices/authSlice";

const { SIGNUP_API, LOGIN_API } = authEndPoints;

export const signUp = (name, email, password, role, status, navigate) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", SIGNUP_API, {
        name,
        email,
        password,
        role,
        status,
      });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Registration Successful! Please log in.");
      navigate("/login", { state: { tab: "login" }, replace: true });
    } catch (error) {
      // console.error("SIGNUP API ERROR:", error);
      toast.error(error.response?.data?.message || "Could Not Sign Up. Please try again.");
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const login = (email, password, navigate) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", LOGIN_API, {
        email,
        password,
      });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Logged In Successfully!");
      dispatch(setToken(response.data.token));
      dispatch(setUser(response.data.user));
      navigate("/dashboard/tasks");
    } catch (error) {
      const message =
        error.response?.data?.message || "Login Failed. Please try again.";

      if (message.toLowerCase().includes("deactivated")) {
        dispatch(logout());
      }
      toast.error(message);
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const logoutUser = (navigate) => {
  return (dispatch) => {
    dispatch(logout());
    toast.success("Logged Out!");
    navigate("/login");
  };
};