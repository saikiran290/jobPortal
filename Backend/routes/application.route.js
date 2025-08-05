import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import {
  applyJob,
  getAppliedJobs,
  getApplicants,
  updateStatus,
  getRecruiterApplications,
} from "../controllers/application.controller.js";

const router = express.Router();

router.get("/apply/:id", isAuthenticated, applyJob);
router.get("/get", isAuthenticated, getAppliedJobs);
router.get("/recruiter", isAuthenticated, getRecruiterApplications);
router.get("/applicants/:id", isAuthenticated, getApplicants);
router.put("/status/:id", isAuthenticated, updateStatus);

export default router;
