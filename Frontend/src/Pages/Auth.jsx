import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { login, signUp } from "../Services/Operations/AuthAPI";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaUserShield,
  FaArrowRight,
  FaSignInAlt,
  FaUserPlus,
} from "react-icons/fa";

const Auth = () => {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, token } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "User",
  });

  useEffect(() => {
    if (location.state?.tab === "signup") {
      setIsLogin(false);
    } else if (location.state?.tab === "login") {
      setIsLogin(true);
      setFormData((prev) => ({
        name: "",
        email: prev.email,
        password: "",
        role: "User",
      }));
    }
  }, [location.state]);

  useEffect(() => {
    // If user is already logged in redirect to dashboard
    if (token) {
      navigate("/dashboard/tasks");
    }
  }, [token, navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      dispatch(login(formData.email, formData.password, navigate));
    } else {
      dispatch(
        signUp(
          formData.name,
          formData.email,
          formData.password,
          formData.role,
          "Active",
          navigate,
        ),
      );
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950 overflow-hidden text-slate-800 dark:text-slate-100 font-sans transition-colors duration-300">
      {/* Animated Glowing Background */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 dark:bg-indigo-600/20 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 dark:bg-purple-600/20 rounded-full blur-[100px] animate-pulse delay-700" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md mx-4 p-8 rounded-3xl bg-white/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl shadow-xl dark:shadow-[0_0_50px_-12px_rgba(99,102,241,0.25)] transition-colors duration-300"
      >
        {/* Toggle Controls */}
        <div className="flex bg-slate-100 dark:bg-slate-950/80 p-1.5 rounded-2xl border border-slate-200/60 dark:border-slate-800/50 mb-8 relative">
          <div className="grid grid-cols-2 w-full relative z-10">
            <button
              onClick={() => {
                setIsLogin(true);
                setFormData((prev) => ({ ...prev, name: "" }));
              }}
              className={`flex items-center justify-center cursor-pointer gap-2 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
                isLogin
                  ? "text-indigo-600 dark:text-indigo-400 font-bold"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              <FaSignInAlt className="text-base" /> Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex items-center justify-center cursor-pointer gap-2 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
                !isLogin
                  ? "text-indigo-600 dark:text-indigo-400 font-bold"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              <FaUserPlus className="text-base" /> Register
            </button>
          </div>
          {/* Animated Sliding Background Toggle Tab */}
          <motion.div
            layout
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute top-1.5 bottom-1.5 left-1.5 w-[calc(50%-6px)] bg-white dark:bg-slate-900 border border-slate-200 dark:border-indigo-500/30 rounded-xl shadow-sm"
            style={{
              x: isLogin ? 0 : "100%",
            }}
          />
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold tracking-tight bg-linear-to-r from-indigo-600 via-purple-605 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
            {isLogin
              ? "Access your dashboard and manage tasks."
              : "Register to organize your daily activities."}
          </p>
        </div>

        {/* Form with Sliding Animation */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? "login" : "signup"}
              initial={{ opacity: 0, x: isLogin ? -15 : 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isLogin ? 15 : -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-5"
            >
              {/* Name Field (Sign Up Only) */}
              {!isLogin && (
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-405 group-focus-within:text-indigo-605 dark:group-focus-within:text-indigo-400 transition-colors">
                    <FaUser className="text-sm" />
                  </span>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Full Name"
                    className="w-full pl-11 pr-4 py-3 bg-slate-50/50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600 hover:border-slate-300 dark:hover:border-slate-700 text-slate-800 dark:text-slate-100"
                  />
                </div>
              )}

              {/* Email Field */}
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-405 group-focus-within:text-indigo-650 dark:group-focus-within:text-indigo-400 transition-colors">
                  <FaEnvelope className="text-sm" />
                </span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Email Address"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50/50 dark:bg-slate-955/60 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600 hover:border-slate-300 dark:hover:border-slate-700 text-slate-800 dark:text-slate-100"
                />
              </div>

              {/* Password Field */}
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-405 group-focus-within:text-indigo-650 dark:group-focus-within:text-indigo-400 transition-colors">
                  <FaLock className="text-sm" />
                </span>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Password"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50/50 dark:bg-slate-955/60 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600 hover:border-slate-300 dark:hover:border-slate-700 text-slate-800 dark:text-slate-100"
                />
              </div>

              {/* Role Picker (Sign Up Only) */}
              {!isLogin && (
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-405 group-focus-within:text-indigo-650 dark:group-focus-within:text-indigo-400 transition-colors">
                    <FaUserShield className="text-sm" />
                  </span>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50/50 dark:bg-slate-955/60 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:border-indigo-505 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all hover:border-slate-300 cursor-pointer dark:hover:border-slate-700 text-slate-700 dark:text-slate-300"
                  >
                    <option
                      value="User"
                      className="bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100"
                    >
                      User
                    </option>
                    <option
                      value="Admin"
                      className="bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100"
                    >
                      Admin
                    </option>
                  </select>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3 bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-500 dark:via-purple-500 dark:to-pink-500 text-white rounded-xl text-sm font-semibold tracking-wide shadow-lg shadow-indigo-600/20 dark:shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 mt-6 cursor-pointer"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-slate-100 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                {isLogin ? "Sign In" : "Register"}{" "}
                <FaArrowRight className="text-xs" />
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default Auth;
