
import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getAdminSummary } from "../controllers/adminSummaryController.js";

const router = express.Router();

// summary 
router.get("/", authMiddleware, getAdminSummary); // New route for admin summary


export default router; 