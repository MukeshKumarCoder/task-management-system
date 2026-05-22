import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const { token, user } = useSelector((state) => state.auth);

  if (token && user?.role === "Admin") {
    return children;
  }
  
  return <Navigate to="/dashboard/tasks" />;
};

export default AdminRoute;
