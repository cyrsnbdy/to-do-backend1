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

taskRouter.post("/", addTask); //
taskRouter.get("/", getTasks); //
taskRouter.get("/:id", getTask); //
taskRouter.put("/:id", updateTask); //
taskRouter.delete("/:id", deleteTask);
taskRouter.patch("/:id/toggle", toggleTaskStatus);
