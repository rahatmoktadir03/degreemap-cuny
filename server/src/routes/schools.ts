import { Router } from "express";
import { getAllSchools, getSchool } from "../controllers/schoolsController.js";

const router = Router();

// GET all schools
router.get("/", getAllSchools);

// GET school by ID
router.get("/:id", getSchool);

export default router;
