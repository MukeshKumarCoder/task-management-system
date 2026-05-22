const Task = require("../Models/Task");
const { logActivity } = require("../Utils/activityLogger");

// Create Task
exports.CreateTask = async (req, res) => {
  try {
    const { title, description, status } = req.body;
    const userId = req.user.id;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    const task = await Task.create({
      title,
      description,
      status: status || "Pending",
      createdBy: userId,
    });

    // Log Activity
    await logActivity(userId, "Task creation");

    return res.status(201).json({
      success: true,
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    console.error("CreateTask Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create Task",
      error: error.message,
    });
  }
};

// Get Tasks (Regular user: own tasks only; Admin: all tasks)
exports.GetTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.userDetails?.role || req.user?.role || req.user?.accountType;

    let query = {};
    if (role !== "Admin") {
      query.createdBy = userId;
    }

    const tasks = await Task.find(query)
      .populate("createdBy", "name email role status")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      tasks,
    });
  } catch (error) {
    console.error("GetTasks Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve Tasks",
      error: error.message,
    });
  }
};

// Update Task
exports.UpdateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;
    const userId = req.user.id;
    const role = req.userDetails?.role || req.user?.role || req.user?.accountType;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Check permissions: regular user can only update their own tasks
    if (role !== "Admin" && task.createdBy.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied: You can only update your own tasks",
      });
    }

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;

    await task.save();

    // Log Activity
    await logActivity(userId, "Task update");

    return res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    console.error("UpdateTask Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update Task",
      error: error.message,
    });
  }
};

// Delete Task
exports.DeleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const role = req.userDetails?.role || req.user?.role || req.user?.accountType;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Check permissions: regular user can only delete their own tasks, Admin can delete any
    if (role !== "Admin" && task.createdBy.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied: You can only delete your own tasks",
      });
    }

    await Task.findByIdAndDelete(id);

    // Log Activity
    await logActivity(userId, "Task deletion");

    return res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("DeleteTask Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete Task",
      error: error.message,
    });
  }
};


