import Company from "../models/company.model.js"; // ✅ Works now



// Register a company
export const registerCompany = async (req, res) => {
  try {
    const { companyName, description, website, location } = req.body;

    if (!companyName) {
      return res.status(400).json({
        message: "Company name is required",
        success: false,
      });
    }

    const existingCompany = await Company.findOne({ name: companyName });
    if (existingCompany) {
      return res.status(400).json({
        message: "Company already exists",
        success: false,
      });
    }

    const newCompany = await Company.create({
      name: companyName,
      description: description || '',
      website: website || '',
      location: location || '',
      userId: req.id,
    });

    return res.status(201).json({
      message: "Company registered successfully",
      company: newCompany,
      success: true,
    });
  } catch (error) {
    console.error("Register Company Error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// Get all companies by logged-in user
export const getCompany = async (req, res) => {
  try {
    const userId = req.id;
    const companies = await Company.find({ userId });

    if (!companies || companies.length === 0) {
      return res.status(404).json({
        message: "No companies found",
        success: false,
      });
    }

    return res.status(200).json({
      companies,
      success: true,
    });
  } catch (error) {
    console.error("Get Companies Error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// Get company by ID
export const getCompanyById = async (req, res) => {
  try {
    const companyId = req.params.id;
    const company = await Company.findById(companyId);

    if (!company) {
      return res.status(404).json({
        message: "Company not found",
        success: false,
      });
    }

    return res.status(200).json({
      company,
      success: true,
    });
  } catch (error) {
    console.error("Get Company By ID Error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// Update company
export const updateCompany = async (req, res) => {
  try {
    const { name, description, website, location } = req.body;

    const updatedCompany = await Company.findByIdAndUpdate(
      req.params.id,
      { name, description, website, location },
      { new: true }
    );

    if (!updatedCompany) {
      return res.status(404).json({
        message: "Company not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Company information updated",
      company: updatedCompany,
      success: true,
    });
  } catch (error) {
    console.error("Update Company Error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
