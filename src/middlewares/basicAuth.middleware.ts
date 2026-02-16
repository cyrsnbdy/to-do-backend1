// middleware/basicAuth.middleware.ts
import { findAccountS } from "@/services/auth/auth.service";
import { compareHashed } from "@/utils/bycript/bycript";
import { AppError } from "@/utils/error/app-error.util";
import { NextFunction, Request, Response } from "express";

/**
 * Basic Auth Middleware
 * Protects routes by checking for Authorization header
 * and validating user credentials
 */
export const basicAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Basic ")) {
      throw new AppError("Authorization header missing or invalid", 401);
    }

    // Decode Base64 encoded "username:password"
    const base64Credentials = authHeader.split(" ")[1];
    const credentials = Buffer.from(base64Credentials, "base64").toString(
      "utf-8",
    );
    const [email, password] = credentials.split(":");

    if (!email || !password) {
      throw new AppError("Invalid authentication credentials", 401);
    }

    // Find the user by email
    const account = await findAccountS({ email });
    if (!account) {
      throw new AppError("Account not found", 401);
    }

    // Verify password
    const passwordValid = await compareHashed(password, account.password);
    if (!passwordValid) {
      throw new AppError("Invalid password", 401);
    }

    // Attach account to request for downstream handlers
    (req as any).account = account;

    next();
  } catch (err) {
    next(err);
  }
};
