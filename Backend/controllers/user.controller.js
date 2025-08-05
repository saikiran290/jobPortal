import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';


// REGISTER CONTROLLER
export const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password, role } = req.body;

    if (!fullname || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({
        message: "Some field is missing",
        success: false,
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullname,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
    });

    // Create token for the new user
    const tokenData = {
      userId: newUser._id,
    };

    const token = jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

    const userData = {
      _id: newUser._id,
      fullname: newUser.fullname,
      email: newUser.email,
      phoneNumber: newUser.phoneNumber,
      role: newUser.role,
      profile: newUser.profile || null,
    };

    // Set cookie and return success response
    return res
      .status(201)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
        httpOnly: true,
        sameSite: 'strict',
      })
      .json({
        message: "User registered successfully",
        success: true,
        user: userData,
      });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      message: "Something went wrong",
      success: false,
    });
  }
};

// LOGIN CONTROLLER
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        message: "Some field is missing",
        success: false,
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Incorrect password",
        success: false,
      });
    }

    // More flexible role validation - allow login if user exists regardless of role selection
    // This prevents issues where users accidentally select wrong role during login
    if (role !== user.role) {
      return res.status(400).json({
        message: `Account exists but you selected ${role} role. Please select ${user.role} role to login.`,
        success: false,
        actualRole: user.role
      });
    }

    const tokenData = {
      userId: user._id,
    };

    const token = jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

    const userData = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile || null,
    };

    // Set cookie and return success response
    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
        httpOnly: true,
        sameSite: 'strict',
      })
      .json({
        message: `Welcome back, ${user.fullname}`,
        user: userData,
        success: true,
      });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      message: "Something went wrong during login",
      success: false,
    });
  }
};
export const logout = async (req, res) => {
  try {
    return res
      .status(200)
      .cookie("token", "", {
        maxAge: 0,
        httpOnly: true,
        sameSite: 'strict',
      })
      .json({
        message: "Logged out successfully",
        success: true,
      });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      message: "Something went wrong during logout",
      success: false,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, bio, skills, resume } = req.body;
    const userId = req.id; // Make sure auth middleware sets this

    let user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // Initialize profile if not exists
    if (!user.profile) {
      user.profile = {};
    }

    // Update basic fields
    if (fullname) user.fullname = fullname;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    
    // Update profile fields
    if (bio) user.profile.bio = bio;
    if (resume) user.profile.resume = resume;
    
    // Handle skills array
    if (skills && Array.isArray(skills)) {
      user.profile.skills = skills;
    }

    await user.save();

    const userData = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile
    };

    return res.status(200).json({
      message: "Profile updated successfully",
      user: userData,
      success: true,
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return res.status(500).json({
      message: "Something went wrong during profile update",
      success: false,
    });
  }
};
