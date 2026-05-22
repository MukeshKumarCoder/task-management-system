import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../Slices/authSlice";
import taskReducer from "../Slices/taskSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  task: taskReducer,
});

export default rootReducer;
