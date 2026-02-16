// routes/auth/auth.route.ts
import { login, logout, register } from "@/controllers/auth/auth.controller";
import { basicAuth } from "@/middlewares/basicAuth.middleware";
import { Router } from "express";

export const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", basicAuth, logout); // Add basicAuth middleware here
