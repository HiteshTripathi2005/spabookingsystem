import express from "express";
import auth from "../middleware/auth.js";
import {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
} from "../controllers/authController.js";

const router = express.Router();

// Register a new user
router.post("/register", register);

// Login user
router.post("/login", login);

// Get user profile
router.get("/profile", auth, getProfile);

// Update user profile
router.put("/profile", auth, updateProfile);

// Change password
router.post("/change-password", auth, changePassword);

export default router;
