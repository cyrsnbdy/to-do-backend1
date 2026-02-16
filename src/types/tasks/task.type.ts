import { Document } from "mongoose";

export type TaskType = {
  task: string;
  completed: boolean;
  userId: string; // Add this field
  createdAt?: Date;
  updatedAt?: Date;
};

export type TaskDocumentType = TaskType & Document;
