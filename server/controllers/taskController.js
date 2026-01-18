import { Task } from "../models/Task.js";

export const createTask = async (req, res) => {
  try {
    const { title, description } = req.body;

    const task = await Task.create({
      title,
      description,
      userId: req.user.id,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.find({ _id: id, userId: req.user.id });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, completed } = req.body;

    const updatedTask = {};
    if (title !== undefined) updatedTask.title = title;
    if (description !== undefined) updatedTask.description = description;
    if (typeof completed === "boolean") updatedTask.completed = completed;

    const task = await Task.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      { $set: updatedTask },
      { new: true, runValidators: true }
    );

    if (!task)
      return res
        .status(404)
        .json({ message: "Task not found || UnAuthorized" });
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findOneAndDelete({ _id: id, userId: req.user.id });
    if (!task)
      return res
        .status(404)
        .json({ message: "Task not found || UnAuthorized" });
    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server message" });
  }
};
