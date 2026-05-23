import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";

import PrivateRoute from "./Components/PrivateRoute";
import AdminRoute from "./Components/AdminRoute";
import DashboardLayout from "./Components/DashboardLayout";

import Home from "./Pages/Home";
import Auth from "./Pages/Auth";
import TasksBoard from "./Pages/TasksBoard";
import UserManagement from "./Pages/UserManagement";
import TaskMonitoring from "./Pages/TaskMonitoring";
import ActivityLogs from "./Pages/ActivityLogs";
import Analytics from "./Pages/Analytics";

const App = () => {
  const { theme } = useSelector((state) => state.theme);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Auth />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardLayout />
              </PrivateRoute>
            }
          >
            <Route path="tasks" element={<TasksBoard />} />
            <Route
              path="users"
              element={
                <AdminRoute>
                  <UserManagement />
                </AdminRoute>
              }
            />
            <Route
              path="monitoring"
              element={
                <AdminRoute>
                  <TaskMonitoring />
                </AdminRoute>
              }
            />
            <Route
              path="logs"
              element={
                <AdminRoute>
                  <ActivityLogs />
                </AdminRoute>
              }
            />
            <Route
              path="analytics"
              element={
                <AdminRoute>
                  <Analytics />
                </AdminRoute>
              }
            />
            <Route path="" element={<Navigate to="tasks" replace />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard/tasks" replace />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={3500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme === "dark" ? "dark" : "light"}
      />
    </>
  );
};

export default App;
