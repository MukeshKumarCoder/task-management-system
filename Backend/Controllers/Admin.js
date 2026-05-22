const User = require("../Models/User");
const Task = require("../Models/Task");
const Activity = require("../Models/Activity");

// View all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password").sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("getAllUsers Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};

// Delete user (and their tasks)
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Delete user
    await User.findByIdAndDelete(id);

    // Clean up user's tasks
    await Task.deleteMany({ createdBy: id });

    return res.status(200).json({
      success: true,
      message: "User and all their tasks deleted successfully",
    });
  } catch (error) {
    console.error("deleteUser Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete user",
      error: error.message,
    });
  }
};

// Update user status (Active/Inactive)
exports.updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !["Active", "Inactive"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Valid status ('Active' or 'Inactive') is required",
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.status = status;
    await user.save();

    return res.status(200).json({
      success: true,
      message: `User status updated to ${status} successfully`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    console.error("updateUserStatus Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update user status",
      error: error.message,
    });
  }
};

// View all tasks created by all users
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("createdBy", "name email role status")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      tasks,
    });
  } catch (error) {
    console.error("getAllTasks Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch all tasks",
      error: error.message,
    });
  }
};

// View all activity logs
exports.getActivityLogs = async (req, res) => {
  try {
    const logs = await Activity.find()
      .populate("userId", "name email role status")
      .sort({ timeStamp: -1 });

    return res.status(200).json({
      success: true,
      logs,
    });
  } catch (error) {
    console.error("getActivityLogs Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch activity logs",
      error: error.message,
    });
  }
};
