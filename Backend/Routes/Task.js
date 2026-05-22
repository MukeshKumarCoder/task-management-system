const express = require("express");
const router = express.Router();

const { CreateTask, GetTasks, UpdateTask, DeleteTask } = require("../Controllers/Task");
const { auth } = require("../Middlewares/Auth");

// User Task Routes
router.post("/", auth, CreateTask);
router.get("/", auth, GetTasks);
router.put("/:id", auth, UpdateTask);
router.delete("/:id", auth, DeleteTask);

module.exports = router;
