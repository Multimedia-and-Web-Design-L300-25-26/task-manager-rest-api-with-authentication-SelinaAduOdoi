import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Basic payload validation prevents invalid documents and clearer client errors.
    if (!name || !email || !password) {
      return res.status(400).json({ message: "name, email and password are required" });
    }

    // Ensure the user email is unique.
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use" });
    }

    // Hash password before persisting.
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
    });

    // Return safe user payload without password hash.
    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to register user", error: error.message });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "email and password are required" });
    }

    // Find user by normalized email.
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare incoming password with stored hash.
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Issue JWT to authenticate protected route requests.
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "test_jwt_secret",
      { expiresIn: "1d" }
    );

    return res.status(200).json({ token });
  } catch (error) {
    return res.status(500).json({ message: "Failed to login", error: error.message });
  }
});

export default router;