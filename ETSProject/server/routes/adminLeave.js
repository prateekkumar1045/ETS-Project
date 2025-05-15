import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getLeaveAdminById ,getLeaveDetailsById,updateLeaveStatus} from "../controllers/adminLeaveController.js";

const router = express.Router();
router.get("/:id", authMiddleware, getLeaveAdminById); // Get leave details by ID

// Get leave details by leave ID
router.get("/details/:id", authMiddleware, getLeaveDetailsById);

// Update leave status (Approve/Reject)
router.put("/status/:id", authMiddleware, updateLeaveStatus);




export default router;