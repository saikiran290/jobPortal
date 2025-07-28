import express from "express";
import {
  postJob,
  getAllJobs,
  getJobById,
  getAdminJobs,
} from "../controllers/job.controller.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";

const router = express.Router();

// Create a new job
router.route("/post").post(isAuthenticated, postJob);

// Get all jobs (with optional keyword search)
router.route("/get").get(isAuthenticated, getAllJobs);

// Get a specific job by ID
router.route("/get/:id").get(getJobById);

// Get count of jobs created by logged-in admin/user
router.route("/getadminjobs").get(isAuthenticated, getAdminJobs);

export default router;
