import { Job } from "../models/job.model.js";

// POST a new job
export const postJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      experience,
      position,
      companyId,
    } = req.body;

    const userId = req.id; // From auth middleware

    if (
      !title || !description || !requirements || !salary || !location || !jobType ||
      experience === undefined || !position || !companyId
    ) {
      return res.status(400).json({
        message: "Missing job fields",
        success: false,
      });
    }

    const job = new Job({
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      experience,
      position,
      company: companyId,
      created_by: userId,
    });

    await job.save();

    res.status(201).json({
      message: "Job posted successfully",
      success: true,
      job,
    });
  } catch (error) {
    console.error("POST JOB ERROR:", error.message);
    res.status(500).json({ message: "Server Error", success: false });
  }
};

// GET all jobs
export const getAllJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const query = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    };

    const jobs = await Job.find(query)
      .populate("company")
      .populate("created_by");

    res.status(200).json({ success: true, jobs });
  } catch (error) {
    console.error("GET JOBS ERROR:", error.message);
    res.status(500).json({ message: "Server Error", success: false });
  }
};

// GET job by ID
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate("company")
      .populate("created_by")
      .populate({
        path: "applications",
        populate: { path: "userId", select: "-password" }
      });

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });
    }

    res.status(200).json({ success: true, job });
  } catch (error) {
    console.error("GET JOB BY ID ERROR:", error.message);
    res.status(500).json({ message: "Server Error", success: false });
  }
};

// GET jobs posted by admin
export const getAdminJobs = async (req, res) => {
  try {
    const adminId = req.id;
    const jobCount = await Job.countDocuments({ created_by: adminId });

    res.status(200).json({
      success: true,
      totalJobs: jobCount,
      message: "Job count fetched",
    });
  } catch (error) {
    console.error("ADMIN JOBS ERROR:", error.message);
    res.status(500).json({ message: "Server Error", success: false });
  }
};
