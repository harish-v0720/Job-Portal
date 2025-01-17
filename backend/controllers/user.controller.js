import { User } from "../models/usermodel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const register = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, password, role } = req.body;
    if (!fullName || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({
        message: "All Fields are required",
        success: false,
      });
    }

    const file = req.file;
    if (!file) {
      return res.status(400).json({
        message: "Upload Profile Photo",
        success: false,
      });
    }
    const fileUri = getDataUri(file);
    const profileUploadResponse = await cloudinary.uploader.upload(
      fileUri.content
    );

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "User already exists",
        success: false,
      });
    }

    // Handle student-specific logic

    let resumeUrl = null;
    if (role === "student") {
      const resumeFile = req.files?.resume; // Assuming `resume` is uploaded as a separate field
      if (!resumeFile) {
        return res.status(400).json({
          message: "Students must upload a resume",
          success: false,
        });
      }

      // Upload resume
      const resumeUri = getDataUri(resumeFile);
      const resumeUploadResponse = await cloudinary.uploader.upload(
        resumeUri.content,
        {
          resource_type: "raw", // For files like PDFs
        }
      );
      resumeUrl = resumeUploadResponse.secure_url;
    }

    const hashPassword = await bcrypt.hash(password, 10);

    await User.create({
      fullName,
      email,
      phoneNumber,
      password: hashPassword,
      role,
      profile: {
        profilePhoto: cloudResponse.secure_url,
        resume: resumeUrl,
      },
    });

    return res.status(200).json({
      message: "Account created succesfully",
      success: true,
    });
  } catch (error) {
    console.error("Error in register endpoint:", error); // Log the error
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
      error: error.message, // Send error details for debugging
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Incorrect email or password",
        success: false,
      });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Incorrect email or password",
        success: false,
      });
    }
    // check role is correct or not

    if (role !== user.role) {
      return res.status(400).json({
        message: "Account doesnot exist with correct role",
        success: false,
      });
    }

    const tokenData = {
      userId: user._id,
    };
    const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    user = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpsOnly: true,
        sameSite: "strict",
      })
      .json({
        message: `Welcome back ${user.fullName}`,
        user,
        success: true,
      });
  } catch (error) {
    console.log(error);
  }
};

export const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out sucessfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, bio, skills } = req.body;
    const file = req.file;
    // cloudinary come here --------

    let cloudResponse = "";

    if (file) {
      const fileUri = getDataUri(file);

      cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
        resource_type: "raw", // Explicitly set for non-image files like PDFs
      });
    }

    let skillsArray;
    if (skills) {
      skillsArray = skills.split(",");
    }
    const userId = req.id; // middleware authentication
    let user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        messag: "User not found",
        success: false,
      });
    }
    // updating data
    if (fullName) user.fullName = fullName;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (bio) user.profile.bio = bio;
    if (skills) user.profile.skills = skillsArray;

    // resume comes later here------
    if (cloudResponse) {
      user.profile.resume = cloudResponse.secure_url + ".pdf"; // save the cloudinary url
      user.profile.resumeOriginalName = file.originalname; // save the original file name
    }

    await user.save();

    user = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    return res.status(200).json({
      message: "Profile Updated succesfully",
      user,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
