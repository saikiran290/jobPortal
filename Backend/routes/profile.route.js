import express from "express";
import {
  createOrUpdateProfile,
  getProfile,
  getProfileById,
  deleteProfile,
} from "../controllers/profile.controller.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";

const router = express.Router();

// Create or update profile
router.route("/create").post(isAuthenticated, createOrUpdateProfile);

// Get user's own profile
router.route("/me").get(isAuthenticated, getProfile);

// Get profile by user ID (for recruiters)
router.route("/user/:userId").get(isAuthenticated, getProfileById);

// Delete profile
router.route("/delete").delete(isAuthenticated, deleteProfile);

export default router; 