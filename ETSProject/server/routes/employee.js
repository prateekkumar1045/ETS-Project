import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { addEmployee,getAllEmployees,upload,getEmployeeById,updateEmployee,fetchEmployeesByDepId} from '../controllers/employeeController.js';

const router = express.Router();

router.get('/', authMiddleware, getAllEmployees); // Ensure this route is protected by authMiddleware
router.post('/add', authMiddleware,upload.single('image'), addEmployee); // Ensure this route is protected by authMiddleware
router.get("/:id", authMiddleware, getEmployeeById); // Ensure this route is protected by authMiddleware
router.put("/:id", authMiddleware, upload.single('image'), updateEmployee); // Ensure multer middleware is applied // Ensure this route is protected by authMiddleware
// router.delete("/:id", authMiddleware, deleteDepartment); // Ensure this route is protected by authMiddleware
router.get('/department/:id', authMiddleware, fetchEmployeesByDepId); // Ensure this route is protected by authMiddleware
export default router;
 