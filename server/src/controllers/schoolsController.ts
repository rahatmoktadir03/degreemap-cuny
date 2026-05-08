import { Request, Response } from "express";
import { getSchools, getSchoolById } from "../services/schoolsService.js";

export const getAllSchools = async (_req: Request, res: Response) => {
  try {
    const schools = await getSchools();
    res.json({ success: true, data: schools });
  } catch (error) {
    console.error("Error fetching schools:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch schools",
    });
  }
};

export const getSchool = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "School ID is required",
      });
    }

    const school = await getSchoolById(id);

    if (!school) {
      return res.status(404).json({
        success: false,
        message: "School not found",
      });
    }

    res.json({ success: true, data: school });
  } catch (error) {
    console.error("Error fetching school:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch school",
    });
  }
};
