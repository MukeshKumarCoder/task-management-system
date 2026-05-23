import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchActivityLogs } from "../Services/Operations/AdminAPI";
import { FaSearch, FaSpinner, FaCalendarAlt } from "react-icons/fa";

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

  const filteredLogs = activityLogs.filter((log) => {
    const action = log?.action?.toLowerCase() || "";
    const name = log?.userId?.name?.toLowerCase() || "";
    const email = log?.userId?.email?.toLowerCase() || "";

    return (
      action.includes(searchTerm.toLowerCase()) ||
      name.includes(searchTerm.toLowerCase()) ||
      email.includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-8 w-full pb-12 text-slate-800 dark:text-slate-200">
      {/* Header */}

      <div>
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
          Platform Activity Logs
        </h1>

        <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
          Track all authentication, task creation, updates and deletion events.
        </p>
      </div>

      {/* Search */}

      <div className="relative max-w-md">
        <FaSearch className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400" />

        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name, email or action..."
          className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Content */}

      {loading ? (
        <div className="flex flex-col items-center py-20 gap-4">
          <FaSpinner className="animate-spin text-3xl text-indigo-500" />

          <span className="text-sm text-slate-500">
            Loading activity logs...
          </span>
        </div>
      ) : filteredLogs.length === 0 ? (
        <div className="rounded-2xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-10 text-center">
          <p className="text-slate-500">No activity logs found</p>
        </div>
      ) : (
        <div className="relative ml-4 border-l-2 border-slate-200 dark:border-slate-800 pl-8 space-y-6">
          {filteredLogs.map((log, index) => {
            const user = log.userId;

            const formattedTime = new Date(log.timeStamp).toLocaleString(
              undefined,
              {
                dateStyle: "medium",
                timeStyle: "short",
              },
            );

            let badgeStyle =
              "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300";

            const action = log.action?.toLowerCase();

            if (action?.includes("login")) {
              badgeStyle = "bg-indigo-500/10 text-indigo-500";
            } else if (action?.includes("create")) {
              badgeStyle = "bg-emerald-500/10 text-emerald-500";
            } else if (action?.includes("update")) {
              badgeStyle = "bg-amber-500/10 text-amber-500";
            } else if (action?.includes("delete")) {
              badgeStyle = "bg-rose-500/10 text-rose-500";
            }

            return (
              <div key={log._id || index} className="relative">
                <div className="absolute -left-[38px] top-8 w-4 h-4 rounded-full bg-indigo-500 border-4 border-white dark:border-slate-950" />

                {/* Card */}
                <div className="rounded-2xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition">
                  <div className="flex flex-col md:flex-row justify-between gap-5">
                    <div className="flex gap-4">
                      <img
                        src={
                          user?.image ||
                          `https://api.dicebear.com/7.x/initials/svg?seed=${
                            user?.name || "User"
                          }`
                        }
                        alt=""
                        className="w-12 h-12 rounded-xl object-cover"
                      />

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold">
                            {user?.name || "Deleted User"}
                          </h3>

                          {user?.email && (
                            <span className="text-xs text-slate-500">
                              {user.email}
                            </span>
                          )}
                        </div>

                        <div className="mt-3">
                          <span
                            className={`text-[10px] px-3 py-1 rounded-full uppercase font-bold ${badgeStyle}`}
                          >
                            {log.action}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <FaCalendarAlt />

                      <span>{formattedTime}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ActivityLogs;
