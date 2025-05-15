import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {  addLeave, getLeavesAll ,getLeavesByUserId} from "../controllers/leaveController.js";

const router = express.Router();

router.get("/", authMiddleware, getLeavesAll); // Get all leaves for the logged-in user
router.post("/add", authMiddleware, addLeave); // Apply for a new leave
//router.get("/:id", authMiddleware, getLeaveById); // Get leave details by ID
// router.put("/:id", authMiddleware, updateLeaveStatus);
router.get("/employee", authMiddleware, getLeavesByUserId); // Get leaves by user ID


export default router;