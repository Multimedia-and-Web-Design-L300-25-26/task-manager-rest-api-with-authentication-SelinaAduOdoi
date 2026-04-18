import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

// Load environment variables when app is imported (tests + server runtime).
dotenv.config({ path: process.env.NODE_ENV === "test" ? ".env.test" : ".env" });

const app = express();

// Parse JSON request bodies for API endpoints.
app.use(express.json());

// Mount API route groups.
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

export default app;