import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "../Components/Navbar";
import { motion } from "framer-motion";
import {
  FaTasks,
  FaShieldAlt,
  FaChartPie,
  FaHistory,
  FaArrowRight,
  FaCheckCircle,
  FaLaptopCode,
  FaMobileAlt,
} from "react-icons/fa";
import Footer from "../Components/Footer";

const cardData = [
  {
    icon: <FaTasks />,
    title: "Tasks Board",
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
    desc: "Interactive boards for user task flows and completion tracking.",
  },
  {
    icon: <FaShieldAlt />,
    title: "Access Controls",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    desc: "Role-based permission handling for secure access.",
  },
  {
    icon: <FaChartPie />,
    title: "Live Analytics",
    color: "text-pink-500",
    bg: "bg-pink-500/10",
    desc: "Monitor activity, progress and system metrics.",
  },
  {
    icon: <FaHistory />,
    title: "Activity Audits",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    desc: "Track task creation, updates and history logs.",
  },
];

const Home = () => {
  const { token } = useSelector((state) => state.auth);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const cardStyle =
    "p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#161B22] border border-gray-200 dark:border-[#1F2937] hover:border-indigo-500/40 transition-all duration-300 shadow-sm hover:shadow-xl h-full group";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0D1117] text-gray-800 dark:text-gray-100 transition-all duration-300">
      <Navbar />
      {/* Hero */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] sm:w-[550px] sm:h-[550px] bg-indigo-500/10 rounded-full blur-3xl -z-10" />

        <div className="absolute top-1/3 left-1/3 w-[250px] h-[250px] sm:w-[350px] sm:h-[350px] bg-purple-500/10 rounded-full blur-3xl -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6 sm:space-y-8 max-w-4xl mx-auto"
          >
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-xs font-semibold uppercase tracking-wider"
            >
              <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
              Next-Gen Workflow Control
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-3xl sm:text-5xl lg:text-6xl font-extrabold leading-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent"
            >
              Collaborate and manage your tasks in a stunning, secure
              environment
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed px-2"
            >
              Organize, track, and monitor operations dynamically. Build
              workspace lists, view live status logs, and configure user scopes
              with role-based access controls.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full"
            >
              {token ? (
                <Link
                  to="/dashboard/tasks"
                  className="w-full sm:w-auto justify-center flex items-center gap-2 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-base font-semibold shadow-xl shadow-indigo-600/30 transition-all duration-300"
                >
                  Enter Workspace
                  <FaArrowRight />
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    state={{ tab: "signup" }}
                    className="w-full sm:w-auto justify-center flex items-center gap-2 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-base font-semibold shadow-xl shadow-indigo-600/30 transition-all duration-300"
                  >
                    Get Started Free
                    <FaArrowRight />
                  </Link>

                  <Link
                    to="/login"
                    state={{ tab: "login" }}
                    className="w-full sm:w-auto px-8 py-3.5 bg-gray-100 hover:bg-gray-200 dark:bg-[#161B22] dark:hover:bg-[#21262D] text-gray-700 dark:text-gray-300 rounded-2xl text-base font-semibold border border-gray-200 dark:border-[#1F2937] transition-all duration-300"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 sm:py-20 bg-gray-100/50 dark:bg-[#11161d] border-y border-gray-200 dark:border-[#1F2937]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
              Engineered for Admins & Teams
            </h2>

            <p className="text-gray-600 dark:text-gray-400">
              Role-based control flows divide workspace duties seamlessly.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {cardData.map((item, i) => (
              <div key={i} className={cardStyle}>
                <div className="space-y-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center ${item.bg} ${item.color} text-xl group-hover:scale-110 transition`}
                  >
                    {item.icon}
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {item.title}
                  </h3>

                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
