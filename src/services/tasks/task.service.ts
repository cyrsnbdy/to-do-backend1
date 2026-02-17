// services/tasks/task.service.ts
import { Task } from "@/models/tasks/task.model";

// Create a task for a specific user
export const createTask = async (taskData: {
  task: string;
  completed: boolean;
  userId: string;
}) => {
  const task = new Task(taskData);
  return await task.save();
};

// Get all tasks for a specific user
export const getUserTasks = async (userId: string) => {
  return Task.find({ userId }).sort({ completed: 1, createdAt: -1 });
};

// Find task by description for a specific user
export const findUserTaskByDescription = async (
  description: string,
  userId: string,
) => {
  return await Task.findOne({ task: description, userId });
};

// Get task by ID (and verify ownership)
export const getUserTaskById = async (taskId: string, userId: string) => {
  return await Task.findOne({ _id: taskId, userId });
};

// Update task by ID (with ownership verification)
export const updateUserTaskById = async (
  taskId: string,
  userId: string,
  updateData: Partial<{ task: string; completed: boolean }>,
) => {
  return await Task.findOneAndUpdate(
    { _id: taskId, userId },
    { ...updateData, updatedAt: new Date() },
    { new: true },
  );
};

// Delete task by ID (with ownership verification)
export const deleteUserTaskById = async (taskId: string, userId: string) => {
  return await Task.findOneAndDelete({ _id: taskId, userId });
};
