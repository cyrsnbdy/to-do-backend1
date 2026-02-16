// models/task.model.ts
import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    task: {
      type: String,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account", // or whatever your user model is called
      required: true,
      index: true, // Add index for better query performance
    },
  },
  {
    timestamps: true,
  },
);

// Create a compound index for userId and task description to ensure
// task descriptions are unique per user, not globally
taskSchema.index({ userId: 1, task: 1 }, { unique: true });

export const Task = mongoose.model("Task", taskSchema);
