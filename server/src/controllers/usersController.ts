import { Response } from "express";
import { getUserProfile, updateUserProfile } from "../services/usersService.js";
import { AuthenticatedRequest } from "../middleware/auth.js";

export const getProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    const profile = await getUserProfile(req.user.id);

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    res.json({ success: true, data: profile });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
    });
  }
};

export const updateProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    const { name, school, major, graduation_year, gpa } = req.body;

    const hasGpa = gpa !== undefined;
    const hasGradYear = graduation_year !== undefined;
    if (!name && !school && !major && !hasGpa && !hasGradYear) {
      return res.status(400).json({
        success: false,
        message: "At least one field must be provided",
      });
    }

    if (hasGpa && gpa !== null && (typeof gpa !== "number" || gpa < 0 || gpa > 4)) {
      return res.status(400).json({
        success: false,
        message: "GPA must be a number between 0 and 4",
      });
    }

    const updates: {
      name?: string;
      school?: string;
      major?: string;
      graduation_year?: number | null;
      gpa?: number | null;
    } = {};
    if (name) updates.name = name;
    if (school) updates.school = school;
    if (major) updates.major = major;
    if (hasGradYear) updates.graduation_year = graduation_year;
    if (hasGpa) updates.gpa = gpa;

    const updatedProfile = await updateUserProfile(req.user.id, updates);

    res.json({ success: true, data: updatedProfile });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};
