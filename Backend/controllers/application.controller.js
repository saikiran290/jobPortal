import Application from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import { User } from "../models/user.model.js";
import Profile from "../models/profile.model.js";
import mongoose from "mongoose";

// Apply for a job
export const applyJob = async (req, res) => {
  try {
    const userId = req.id;
    const jobId = req.params.id;

    console.log('Applying for job:', { userId, jobId });

    if (!jobId) {
      return res.status(400).json({ message: "Job ID is required", success: false });
    }

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated", success: false });
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ message: "Invalid job ID format", success: false });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format", success: false });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({ job: jobId, applicant: userId });
    if (existingApplication) {
      return res.status(400).json({ message: "Already applied for this job", success: false });
    }

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found", success: false });
    }

    console.log('Creating application for job:', job.title);

    // Get user's profile for resume link
    const userProfile = await Profile.findOne({ user: userId });
    const resumeLink = req.body?.resumeLink || userProfile?.resumeLink || null;

    // Create the application
    const newApplication = await Application.create({
      job: jobId,
      applicant: userId,
      resumeLink: resumeLink,
      status: 'pending' // Set default status
    });

    console.log('Application created:', newApplication._id);

    // Add application to job
    if (!job.applications) {
      job.applications = [];
    }
    job.applications.push(newApplication._id);
    await job.save();

    console.log('Job updated with application');

    return res.status(201).json({
      message: "Job applied successfully.",
      success: true,
      application: newApplication,
    });
  } catch (error) {
    console.error("Apply Job Error:", error);
    console.error("Error stack:", error.stack);
    return res.status(500).json({ 
      message: "Server Error", 
      error: error.message,
      stack: error.stack,
      success: false 
    });
  }
};

// Get all jobs applied by the user
export const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.id;

    const applications = await Application.find({ applicant: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "job",
        populate: { path: "company" },
      });

    return res.status(200).json({
      message: "Applied jobs fetched successfully",
      success: true,
      applications,
    });
  } catch (error) {
    console.error("Get Applied Jobs Error:", error);
    return res.status(500).json({ message: "Server Error", success: false });
  }
};

// Get all applicants for a specific job
export const getApplicants = async (req, res) => {
  try {
    const jobId = req.params.id;

    if (!jobId) {
      return res.status(400).json({ message: "Job ID is required", success: false });
    }

    const job = await Job.findById(jobId).populate({
      path: "applications",
      options: { sort: { createdAt: -1 } },
      populate: {
        path: "applicant",
        select: "-password",
      },
    });

    if (!job) {
      return res.status(404).json({ message: "Job not found", success: false });
    }

    return res.status(200).json({
      message: "Applicants fetched successfully",
      success: true,
      applications: job.applications,
    });
  } catch (error) {
    console.error("Get Applicants Error:", error);
    return res.status(500).json({ message: "Server Error", success: false });
  }
};

// Get all applications for recruiter's jobs
export const getRecruiterApplications = async (req, res) => {
  try {
    const recruiterId = req.id;

    // First get all jobs posted by this recruiter
    const recruiterJobs = await Job.find({ userId: recruiterId }).select('_id');
    const jobIds = recruiterJobs.map(job => job._id);

    if (jobIds.length === 0) {
      return res.status(200).json({
        message: "No applications found",
        success: true,
        applications: [],
      });
    }

    // Get all applications for these jobs
    const applications = await Application.find({ job: { $in: jobIds } })
      .sort({ createdAt: -1 })
      .populate({
        path: "job",
        populate: { path: "company" },
      })
      .populate({
        path: "applicant",
        select: "-password",
      });

    return res.status(200).json({
      message: "Recruiter applications fetched successfully",
      success: true,
      applications,
    });
  } catch (error) {
    console.error("Get Recruiter Applications Error:", error);
    return res.status(500).json({ message: "Server Error", success: false });
  }
};

// Update application status
export const updateStatus = async (req, res) => {
  try {
    const applicationId = req.params.id;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required", success: false });
    }

    const allowedStatuses = ["applied", "shortlisted", "rejected", "pending"];
    if (!allowedStatuses.includes(status.toLowerCase())) {
      return res.status(400).json({ message: "Invalid status value", success: false });
    }

    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({ message: "Application not found", success: false });
    }

    application.status = status.toLowerCase();
    await application.save();

    return res.status(200).json({
      message: "Application status updated successfully",
      success: true,
      application,
    });
  } catch (error) {
    console.error("Update Status Error:", error);
    return res.status(500).json({ message: "Server Error", success: false });
  }
};
