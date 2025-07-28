import Application from "../models/application.model.js";
import { Job } from "../models/job.model.js";

// Apply for a job
export const applyJob = async (req, res) => {
  try {
    const userId = req.id;
    const jobId = req.params.id;

    if (!jobId) {
      return res.status(400).json({ message: "Job ID is required", success: false });
    }

    const existingApplication = await Application.findOne({ job: jobId, applicant: userId });
    if (existingApplication) {
      return res.status(400).json({ message: "Already applied for this job", success: false });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found", success: false });
    }

    const newApplication = await Application.create({
      job: jobId,
      applicant: userId,
      resumeLink: req.body.resumeLink || null, // Optional
    });

    job.applications.push(newApplication._id);
    await job.save();

    return res.status(201).json({
      message: "Job applied successfully.",
      success: true,
      application: newApplication,
    });
  } catch (error) {
    console.error("Apply Job Error:", error);
    return res.status(500).json({ message: "Server Error", success: false });
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
