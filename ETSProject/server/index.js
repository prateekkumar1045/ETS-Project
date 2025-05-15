import express from 'express';
import dotenv from 'dotenv';
dotenv.config(); // <-- Move this to the very top

import cors from 'cors';
import authRouter from './routes/auth.js';
import departmentRouter from './routes/department.js';
import connectToDatabase from './db/db.js';
import employeeRouter from './routes/employee.js';
import salaryRouter from './routes/salary.js';
import leaveRouter from './routes/leave.js';
import adminLeaveRouter from './routes/adminLeave.js';
import adminSummary from './routes/adminSummary.js';

import path from 'path';
import { fileURLToPath } from 'url';

// Connect to database AFTER .env is loaded
connectToDatabase();

const app = express();

app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API routes
app.use('/api/auth', authRouter);
app.use('/api/department', departmentRouter);
app.use('/api/employee', employeeRouter);
app.use('/api/salary', salaryRouter);
app.use('/api/leave', leaveRouter);
app.use('/api/adminLeave', adminLeaveRouter);
app.use('/api/adminSummary', adminSummary);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
