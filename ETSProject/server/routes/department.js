import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { addDepartment, updateDepartment, getDepartmentById, getDepartments ,deleteDepartment} from '../controllers/departmentController.js';

const router = express.Router();

router.get('/', authMiddleware, getDepartments); // Ensure this route is protected by authMiddleware
router.post('/add', authMiddleware, addDepartment); // Ensure this route is protected by authMiddleware
router.get("/:id", authMiddleware, getDepartmentById); // Ensure this route is protected by authMiddleware
router.put("/:id", authMiddleware, updateDepartment); // Ensure this route is protected by authMiddleware
router.delete("/:id", authMiddleware, deleteDepartment); // Ensure this route is protected by authMiddleware

export default router; 
