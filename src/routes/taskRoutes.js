import express from "express";
import Task from "../models/Task.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Apply auth middleware
router.use(authMiddleware);

// POST /api/tasks
router.post("/", async (req, res) => {
  try {
    const { title, description, completed } = req.body;

    if (!title) {
      return res.status(400).json({ message: "title is required" });
    }

    // Always enforce ownership from authenticated user context.
    const task = await Task.create({
      title,
      description,
      completed,
      owner: req.user._id,
    });

    return res.status(201).json(task);
  } catch (error) {
    return res.status(500).json({ message: "Failed to create task", error: error.message });
  }
});

// GET /api/tasks
router.get("/", async (req, res) => {
  try {
    // Scope task list to the authenticated user only.
    const tasks = await Task.find({ owner: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json(tasks);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch tasks", error: error.message });
  }
});

// DELETE /api/tasks/:id
router.delete("/:id", async (req, res) => {
  try {
    // Delete only if task id and owner both match.
    const deletedTask = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found or not authorized" });
    }

    return res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete task", error: error.message });
  }
});

export default router;