import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchActivityLogs } from "../Services/Operations/AdminAPI";
import { FaHistory, FaSearch, FaSpinner, FaCalendarAlt, FaUserClock } from "react-icons/fa";

const ActivityLogs = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { activityLogs, loading } = useSelector((state) => state.task);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (token) {
      dispatch(fetchActivityLogs(token));
    }
  }, [dispatch, token]);

  const filteredLogs = activityLogs.filter(
    (log) =>
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userId?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userId?.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 w-full pb-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          Platform Activity Logs
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Chronological record of user authentication events, task edits, creation, and deletion events.
        </p>
      </div>

      {/* Control Actions & Timeline List */}
      <div className="space-y-6">
        {/* Search */}
        <div className="relative w-full max-w-md group">
          <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors">
            <FaSearch className="text-sm" />
          </span>
          <input
            type="text"
            placeholder="Search activities by user name, email, or action..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-slate-900/60 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none rounded-xl text-sm transition placeholder:text-slate-600 hover:border-slate-700"
          />
        </div>

        {/* Timeline View */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <FaSpinner className="text-3xl text-indigo-500 animate-spin" />
            <span className="text-sm text-slate-500 font-medium">Retrieving platform security logs...</span>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-slate-900/20 border border-slate-900/40">
            <p className="text-slate-500 text-sm font-medium">No activity log entries found.</p>
          </div>
        ) : (
          <div className="relative border-l border-slate-800 pl-6 ml-4 space-y-6">
            {filteredLogs.map((log, index) => {
              const user = log.userId;
              const formattedTime = new Date(log.timeStamp).toLocaleString(undefined, {
                dateStyle: "medium",
                timeStyle: "short",
              });

              // Action color badges
              let badgeColor = "bg-slate-800 text-slate-300 border-slate-700/60";
              if (log.action.toLowerCase().includes("login")) {
                badgeColor = "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
              } else if (log.action.toLowerCase().includes("creation")) {
                badgeColor = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
              } else if (log.action.toLowerCase().includes("update")) {
                badgeColor = "bg-amber-500/10 text-amber-400 border-amber-500/20";
              } else if (log.action.toLowerCase().includes("deletion")) {
                badgeColor = "bg-rose-500/10 text-rose-400 border-rose-500/20";
              }

              return (
                <div key={log._id || index} className="relative group">
                  {/* Timeline node */}
                  <span className="absolute -left-[31px] top-1.5 flex items-center justify-center w-2.5 h-2.5 rounded-full bg-slate-850 border-2 border-indigo-500 group-hover:bg-indigo-400 transition" />

                  {/* Log details card */}
                  <div className="p-5 rounded-2xl bg-slate-900/30 border border-slate-800/80 hover:border-slate-800 transition backdrop-blur-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <img
                        src={user?.image || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || "User"}`}
                        alt="Avatar"
                        className="w-10 h-10 rounded-xl border border-slate-800 bg-slate-950 p-0.5 object-cover"
                      />
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-slate-100">{user?.name || "Deleted User"}</span>
                          <span className="text-[10px] text-slate-500 font-semibold">{user?.email}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-[10px] px-2 py-0.5 rounded-md border font-semibold tracking-wide uppercase ${badgeColor}`}>
                            {log.action}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium sm:self-center">
                      <FaCalendarAlt className="text-[10px]" />
                      <span>{formattedTime}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityLogs;
