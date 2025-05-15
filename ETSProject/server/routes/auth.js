import express from 'express';
import { login,verify,changePassword,adminchangePassword } from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js'


const router = express.Router();

router.post('/login',login)
router.get('/verify',authMiddleware,verify)
router.post("/change-password", authMiddleware, changePassword);
router.post("/admin-change-password", authMiddleware, adminchangePassword); // Change password route

 
export default router;