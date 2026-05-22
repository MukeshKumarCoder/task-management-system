import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { motion } from "framer-motion";

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans overflow-x-hidden">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Page Area */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto pl-0 lg:pl-0 pt-16 lg:pt-0">
        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto">
          {/* Animated Outlet Route Wrapper */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full h-full"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
