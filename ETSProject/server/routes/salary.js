import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { addSalary ,getSalaryByEmployeeId,getSalaryHistoryByEmployeeId,getSalaryHistoryByUserId} from "../controllers/salaryController.js";

const router = express.Router();

router.get("/", authMiddleware, getSalaryHistoryByUserId);
router.post("/add", authMiddleware, addSalary);
router.get("/:employeeId", authMiddleware, getSalaryByEmployeeId);
router.get("/history/:employeeId", authMiddleware, getSalaryHistoryByEmployeeId);

export default router;