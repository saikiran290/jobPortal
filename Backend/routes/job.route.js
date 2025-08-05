import express from "express";
import {
  postJob,
  getAllJobs,
  getJobById,
  getAdminJobs,
} from "../controllers/job.controller.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { Job } from "../models/job.model.js";

const router = express.Router();

// Create a new job
router.route("/post").post(isAuthenticated, postJob);

// Get all jobs (with optional keyword search) - public access
router.route("/get").get(getAllJobs);

// Get a specific job by ID
router.route("/get/:id").get(getJobById);

// Test route to check if job exists
router.route("/test/:id").get(async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (job) {
      res.json({ 
        success: true, 
        job: {
          id: job._id,
          title: job.title,
          company: job.company,
          applications: job.applications ? job.applications.length : 0
        }
      });
    } else {
      res.status(404).json({ success: false, message: "Job not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get count of jobs created by logged-in admin/user
router.route("/getadminjobs").get(isAuthenticated, getAdminJobs);

export default router;
