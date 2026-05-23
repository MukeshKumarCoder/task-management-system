const Activity = require("../Models/Activity");

exports.logActivity = async (userId, action) => {
  try {
    if (!userId) {
      console.warn("activityLogger: userId is missing for action: " + action);
      return;
    }
    await Activity.create({
      userId,
      action,
      timeStamp: new Date(),
    });
    // console.log(`Activity Logged: User ${userId} performed '${action}'`);
  } catch (error) {
    console.error("Failed to log activity:", error);
  }
};
