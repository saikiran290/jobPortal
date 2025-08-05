import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import {
  registerCompany,
  getCompany,
  getCompanyById,
  updateCompany,
} from "../controllers/company.controller.js";
import Company from "../models/company.model.js";

const router = express.Router();

router.post("/register", isAuthenticated, registerCompany);
router.get("/get", isAuthenticated, getCompany);
// Public route to get all companies (for job posting)
router.get("/all", async (req, res) => {
  try {
    const companies = await Company.find({});
    res.status(200).json({ success: true, companies });
  } catch (error) {
    res.status(500).json({ message: "Server Error", success: false });
  }
});
router.get("/get/:id", isAuthenticated, getCompanyById);
router.put("/update/:id", isAuthenticated, updateCompany);

export default router;
