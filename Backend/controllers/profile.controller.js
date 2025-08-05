import Profile from "../models/profile.model.js";
import { User } from "../models/user.model.js";

// Create or update profile
export const createOrUpdateProfile = async (req, res) => {
  try {
    const userId = req.id;
    
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated", success: false });
    }

    const {
      fullName,
      email,
      phoneNumber,
      skills,
      experience,
      education,
      resumeLink,
      bio,
      location,
      linkedin,
      github,
      portfolio
    } = req.body;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    // Check if profile already exists
    let profile = await Profile.findOne({ user: userId });

    if (profile) {
      // Update existing profile
      profile.fullName = fullName || profile.fullName;
      profile.email = email || profile.email;
      profile.phoneNumber = phoneNumber || profile.phoneNumber;
      profile.skills = skills || profile.skills;
      profile.experience = experience || profile.experience;
      profile.education = education || profile.education;
      profile.resumeLink = resumeLink || profile.resumeLink;
      profile.bio = bio || profile.bio;
      profile.location = location || profile.location;
      profile.linkedin = linkedin || profile.linkedin;
      profile.github = github || profile.github;
      profile.portfolio = portfolio || profile.portfolio;

      await profile.save();
    } else {
      // Create new profile
      profile = await Profile.create({
        user: userId,
        fullName: fullName || user.fullname,
        email: email || user.email,
        phoneNumber: phoneNumber || user.phoneNumber,
        skills: skills || [],
        experience: experience || "0 years",
        education: education || "",
        resumeLink: resumeLink || "",
        bio: bio || "",
        location: location || "",
        linkedin: linkedin || "",
        github: github || "",
        portfolio: portfolio || ""
      });
    }

    return res.status(200).json({
      message: "Profile updated successfully",
      success: true,
      profile,
    });
  } catch (error) {
    console.error("Profile Update Error:", error);
    return res.status(500).json({ 
      message: "Server Error", 
      error: error.message,
      success: false 
    });
  }
};

// Get user profile
export const getProfile = async (req, res) => {
  try {
    const userId = req.id;
    
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated", success: false });
    }

    const profile = await Profile.findOne({ user: userId });

    if (!profile) {
      return res.status(404).json({ 
        message: "Profile not found", 
        success: false 
      });
    }

    return res.status(200).json({
      message: "Profile fetched successfully",
      success: true,
      profile,
    });
  } catch (error) {
    console.error("Get Profile Error:", error);
    return res.status(500).json({ message: "Server Error", success: false });
  }
};

// Get profile by user ID (for recruiters to view applicant profiles)
export const getProfileById = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ message: "User ID is required", success: false });
    }

    const profile = await Profile.findOne({ user: userId });

    if (!profile) {
      return res.status(404).json({ 
        message: "Profile not found", 
        success: false 
      });
    }

    return res.status(200).json({
      message: "Profile fetched successfully",
      success: true,
      profile,
    });
  } catch (error) {
    console.error("Get Profile By ID Error:", error);
    return res.status(500).json({ message: "Server Error", success: false });
  }
};

// Delete profile
export const deleteProfile = async (req, res) => {
  try {
    const userId = req.id;
    
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated", success: false });
    }

    const profile = await Profile.findOneAndDelete({ user: userId });

    if (!profile) {
      return res.status(404).json({ 
        message: "Profile not found", 
        success: false 
      });
    }

    return res.status(200).json({
      message: "Profile deleted successfully",
      success: true,
    });
  } catch (error) {
    console.error("Delete Profile Error:", error);
    return res.status(500).json({ message: "Server Error", success: false });
  }
}; 