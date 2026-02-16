import { findAccountS, registerS } from "@/services/auth/auth.service";
import { compareHashed, hashValue } from "@/utils/bycript/bycript";
import { AppError } from "@/utils/error/app-error.util";
import { Request, Response } from "express";

/**
 * @description Register a new user account
 * @route POST /api/auth/register
 * @access Public
 */
export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  // Validate that all required fields are provided
  if (!name || !email || !password)
    throw new AppError("All fields are required.", 400);

  // Check if an account with the same email already exists
  if (await findAccountS({ email })) {
    throw new AppError("Email already exists.", 409);
  }

  // Hash the user's password before storing in database
  const hashedPassword = await hashValue(password);

  // Create and store the new account in the database
  const account = await registerS({
    name,
    email,
    password: hashedPassword,
    status: false, // default status: logged out
  });

  // Return success response with the created account data
  res
    .status(200)
    .json({ message: "Account registered successfully.", account });
};

/**
 * @description Authenticate a user and log them in
 * @route POST /api/auth/login
 * @access Public
 */
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Validate that both email and password are provided
  if (!email || !password) {
    throw new AppError("Fill all contents. Email/Password", 400);
  }

  // Find the account using the provided email
  const account = await findAccountS({ email });

  // Throw error if account does not exist
  if (!account) {
    throw new AppError("Account not found", 400);
  }

  // Compare provided password with the stored hashed password
  const passwordCheck = await compareHashed(password, account.password);
  if (!passwordCheck) {
    throw new AppError("Incorrect Password.", 400);
  }

  // Remove status check - we don't care about status anymore
  // Just return success - client will store the token

  // Return success response with account data (excluding password)
  const { password: _, ...accountWithoutPassword } = account.toObject();
  res.status(200).json({
    message: "Login successfully.",
    account: accountWithoutPassword,
    // Optionally return a token if you want to implement token-based auth later
  });
};

/**
 * @description Log out a user by updating their account status
 * @route POST /api/auth/logout
 * @access Public
 */
// controllers/auth/auth.controller.ts
export const logout = async (req: Request, res: Response) => {
  // Return success response
  res.status(200).json({ message: "User has successfully logged out." });
};
