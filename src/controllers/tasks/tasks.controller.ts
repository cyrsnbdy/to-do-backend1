// controllers/tasks/task.controller.ts
import {
  createTask,
  deleteUserTaskById,
  findUserTaskByDescription,
  getUserTaskById,
  getUserTasks,
  updateUserTaskById,
} from "@/services/tasks/task.service";
import { AppError } from "@/utils/error/app-error.util";
import { Request, Response } from "express";

// Get authenticated user from request
interface AuthRequest extends Request {
  account?: any; // Your user type
}

export const addTask = async (req: AuthRequest, res: Response) => {
  const { task } = req.body;
  const userId = req.account?._id; // Get user ID from authenticated account

  if (!userId) {
    throw new AppError("User not authenticated", 401);
  }

  if (!task) {
    throw new AppError("Task description is required", 400);
  }

  // Check if task with same description already exists for THIS user
  const existingTask = await findUserTaskByDescription(task, userId);

  if (existingTask) {
    throw new AppError("You already have a task with this description", 400);
  }

  // Create the task with userId
  const newTask = await createTask({
    task,
    completed: false,
    userId,
  });

  res.status(201).json({
    message: "Task added successfully",
    task: newTask,
  });
};

export const getTasks = async (req: AuthRequest, res: Response) => {
  const userId = req.account?._id;
  console.log("test");
  if (!userId) {
    throw new AppError("User not authenticated", 401);
  }

  const tasks = await getUserTasks(userId);

  res.status(200).json({
    message: "Tasks retrieved successfully",
    count: tasks.length,
    tasks,
  });
};

export const getTask = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.account?._id;

  if (!userId) {
    throw new AppError("User not authenticated", 401);
  }

  const task = await getUserTaskById(id.toString(), userId);

  if (!task) {
    throw new AppError("Task not found", 404);
  }

  res.status(200).json({
    message: "Task retrieved successfully",
    task,
  });
};

export const updateTask = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;
  const userId = req.account?._id;

  if (!userId) {
    throw new AppError("User not authenticated", 401);
  }

  // Validate if trying to update task description and it already exists for this user
  if (updateData.task) {
    const existingTask = await findUserTaskByDescription(
      updateData.task,
      userId,
    );
    if (existingTask && existingTask._id.toString() !== id) {
      throw new AppError("You already have a task with this description", 400);
    }
  }

  const task = await updateUserTaskById(id.toString(), userId, updateData);

  if (!task) {
    throw new AppError("Task not found", 404);
  }

  res.status(200).json({
    message: "Task updated successfully",
    task,
  });
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.account?._id;

  if (!userId) {
    throw new AppError("User not authenticated", 401);
  }

  const task = await deleteUserTaskById(id.toString(), userId);

  if (!task) {
    throw new AppError("Task not found", 404);
  }

  res.status(200).json({
    message: "Task deleted successfully",
  });
};

export const toggleTaskStatus = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.account?._id;

  if (!userId) {
    throw new AppError("User not authenticated", 401);
  }

  const task = await getUserTaskById(id.toString(), userId);

  if (!task) {
    throw new AppError("Task not found", 404);
  }

  const updatedTask = await updateUserTaskById(id.toString(), userId, {
    completed: !task.completed,
  });

  res.status(200).json({
    message: `Task marked as ${updatedTask?.completed ? "completed" : "incomplete"}`,
    task: updatedTask,
  });
};
