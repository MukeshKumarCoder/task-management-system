import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import PrivateRoute from "./Components/PrivateRoute";
import AdminRoute from "./Components/AdminRoute";
import DashboardLayout from "./Components/DashboardLayout";

import Auth from "./Pages/Auth";
import TasksBoard from "./Pages/TasksBoard";
import UserManagement from "./Pages/UserManagement";
import TaskMonitoring from "./Pages/TaskMonitoring";
import ActivityLogs from "./Pages/ActivityLogs";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Public Auth Route */}
          <Route path="/login" element={<Auth />} />

          {/* Protected Dashboard Layout and Sub-Routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardLayout />
              </PrivateRoute>
            }
          >
            {/* Common Route: My Tasks */}
            <Route path="tasks" element={<TasksBoard />} />

            {/* Admin-only Routes */}
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

            {/* Fallback under dashboard */}
            <Route path="" element={<Navigate to="tasks" replace />} />
          </Route>

          {/* Root paths redirect to tasks (which redirects to login if unauthenticated) */}
          <Route path="/" element={<Navigate to="/dashboard/tasks" replace />} />
          <Route path="*" element={<Navigate to="/dashboard/tasks" replace />} />
        </Routes>
      </BrowserRouter>

      {/* Modern Delightful Toast Alert Manager */}
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
        theme="dark"
      />
    </>
  );
};

export default App;
