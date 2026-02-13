import initDB from "@/db/db.connect.js";
import { globalErrorHandler } from "@/middlewares/global-error-handler.middleware";
import { globalRateLimiter } from "@/middlewares/limiter.middleware";
import expressMongoSanitize from "@exortek/express-mongo-sanitize";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import http from "http";
import morgan from "morgan";
import { authRouter } from "./routes/auth/auth.route";
dotenv.config();
const bootstrap = async () => {
  const app = express();
  app.set("trust proxy", 1);

  const PORT = process.env.PORT || 5173;
  const allowedOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(",")
    : [];
  // CORS
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
          return callback(null, true);
        }
        // Reject everything else
        callback(new Error("CORS not allowed"), false);
      },
      credentials: true,
    }),
  );
  // Security headers
  app.use(helmet());
  // Rate limiting
  app.use(globalRateLimiter);
  // Logger
  app.use(morgan("dev"));
  // JSON parser
  app.use(express.json());
  // Prevent NoSQL Injection
  app.use(expressMongoSanitize());

  // Cookie parser
  app.use(cookieParser());
  // Root
  app.get("/api/test", (req, res) => {
    res.status(200).send("Api is running");
  });
  // Routes
  app.use("/api/auth/", authRouter);
  // app.use("api", route);
  // Error handler
  app.use(globalErrorHandler);
  const server = http.createServer(app);
  server.setTimeout(300000);
  server.listen(PORT, () => {
    initDB();
    console.log(`Server Running on port ${PORT}`);
  });
};
bootstrap().catch((e) => {
  console.error("Fatal boot error:", e);
  process.exit(1);
});
