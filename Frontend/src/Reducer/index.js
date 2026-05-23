import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../Slices/authSlice";
import taskReducer from "../Slices/taskSlice";
import themeReducer from "../Slices/themeSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  task: taskReducer,
  theme: themeReducer,
});

export default rootReducer;
