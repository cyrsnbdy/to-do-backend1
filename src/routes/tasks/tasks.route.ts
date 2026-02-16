// routes/task.routes.ts
import {
  addTask,
  deleteTask,
  getTask,
  getTasks,
  toggleTaskStatus,
  updateTask,
} from "@/controllers/tasks/tasks.controller";

import { Router } from "express";

export const taskRouter = Router();

// Apply Basic Auth to all task routes

taskRouter.post("/tasks", addTask); //
taskRouter.get("/tasks", getTasks); //
taskRouter.get("/tasks/:id", getTask); //
taskRouter.put("/tasks/:id", updateTask); //
taskRouter.delete("/tasks/:id", deleteTask);
taskRouter.patch("/tasks/:id/toggle", toggleTaskStatus);
