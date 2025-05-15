import Employee from "../models/Employee.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";
import fs from 'fs';
import mongoose from 'mongoose';
import cloudinary from "cloudinary";

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Ensure uploads folder exists
const folderPath = 'public/uploads';
if (!fs.existsSync(folderPath)) {
  fs.mkdirSync(folderPath, { recursive: true });
}

// Set up multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, folderPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif/;
  const isValid = allowed.test(path.extname(file.originalname).toLowerCase()) &&
                  allowed.test(file.mimetype);
  cb(null, isValid);
};

const upload = multer({ storage, fileFilter });

const addEmployee = async (req, res) => {
  try {
    const {
      name,
      email,
      employeeId,
      dob,
      gender,
      maritalStatus,
      designation,
      department,
      salary,
      password,
      role,
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(department)) {
      return res.status(400).json({ success: false, error: "Invalid department ID." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, error: "User already registered." });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    // Upload image to Cloudinary
    let profileImageUrl = "";
    if (req.file) {
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "employee_profiles",
      });
      profileImageUrl = result.secure_url; // Get the secure URL of the uploaded image
    }

    const newUser = new User({
      name,
      email,
      password: hashPassword,
      role,
      profileImage: profileImageUrl, // Save Cloudinary URL
    });
    const savedUser = await newUser.save();

    const newEmployee = new Employee({
      userId: savedUser._id,
      employeeId,
      dob: new Date(dob),
      gender,
      maritalStatus,
      designation,
      department: new mongoose.Types.ObjectId(department),
      salary: parseFloat(salary),
    });

    console.log("Saving employee:", newEmployee); // Final check

    const savedEmployee = await newEmployee.save();

    return res.status(201).json({
      success: true,
      message: "Employee added successfully",
      employee: savedEmployee,
    });
  } catch (error) {
    console.error("Error adding employee:", error);
    return res.status(500).json({
      success: false,
      error: error?.message || "Internal server error",
    });
  }
};

// Fetch all employees
const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find()
      .populate('userId', 'name email profileImage') // Populate user details
      .populate('department', 'dep_name'); // Populate department name

    return res.status(200).json({ success: true, employees });
  } catch (error) {
    console.error("Error fetching employees:", error);
    return res.status(500).json({ success: false, error: error?.message || "Internal server error" });
  }
};


// Fetch employee by ID 
const getEmployeeById = async (req, res) => {
  const { id } = req.params;

  try {
    const employee = await Employee.findById(id)
      .populate('userId', 'name email profileImage role') // Populate user details
      .populate('department', 'dep_name'); // Populate department name
      console.log("Fetching employee with ID:", id); // Log the ID being fetched
    
    const employeeFound = await Employee.findOne({ userId: id }) // Fetch by userId
      .populate('userId', 'name email profileImage role') // Populate user details  
      .populate('department', 'dep_name'); // Populate department namelo
      console.log("Fetching employee with ID:", employeeFound); // Log the ID being fetch
      
    if (!employee && !employeeFound) {
      return res.status(404).json({ success: false, error: "Employee not found" });
    }
    else if(!employee) {
      return res.status(200).json({ success: true, employee: employeeFound });
    }

    console.log("Employee found:", employee); // Log the found employee
    return res.status(200).json({ success: true, employee });
  } catch (error) {
    console.error("Error fetching employee:", error);
    return res.status(500).json({ success: false, error: error?.message || "Internal server error" });
  }
};

//Update Employee By ID
const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    // Ensure the employee exists
    const employee = await Employee.findById(id).populate("userId");
    if (!employee) {
      return res.status(404).json({ success: false, error: "Employee not found" });
    }
    const validRoles = ['admin', 'employee']; // Define valid roles
      if (req.body.role && !validRoles.includes(req.body.role.toLowerCase())) {
      return res.status(400).json({ success: false, error: "Invalid role value" });
    }

    const user = await User.findById(employee.userId._id);

    // Update profile image if a new file is uploaded
    let profileImageUrl = user.profileImage; // Keep the existing image by default
    if (req.file) {
      // Delete the old image from Cloudinary (optional)
      if (user.profileImage) {
        const publicId = user.profileImage.split("/").pop().split(".")[0]; // Extract public ID
        await cloudinary.v2.uploader.destroy(`employee_profiles/${publicId}`);
      }

      // Upload the new image to Cloudinary
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "employee_profiles",
      });
      profileImageUrl = result.secure_url; // Get the secure URL of the uploaded image
    }

    // Update user details
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.role = req.body.role || user.role;
    user.profileImage = profileImageUrl; // Update the profile image URL
    await user.save();

    // Update employee details
    employee.dob = req.body.dob ? new Date(req.body.dob) : employee.dob;
    employee.gender = req.body.gender || employee.gender;
    employee.maritalStatus = req.body.maritalStatus || employee.maritalStatus;
    employee.designation = req.body.designation || employee.designation;
    employee.department = req.body.department ? new mongoose.Types.ObjectId(req.body.department) : employee.department;
    employee.salary = req.body.salary ? parseFloat(req.body.salary) : employee.salary;
    await employee.save();

    return res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      employee,
    });
  } catch (error) {
    console.error("Error updating employee:", error);
    return res.status(500).json({
      success: false,
      error: error?.message || "Internal server error",
    });
  }
};


// Fetch employees by department ID
const fetchEmployeesByDepId = async (req, res) => {
  const { id } = req.params;

  try {
    const employees = await Employee.find({ department: id })
      .populate('userId', 'name email profileImage') // Populate user details
      .populate('department', 'dep_name'); // Populate department name

    if (!employees || employees.length === 0) {
      return res.status(404).json({ success: false, error: "No employees found for this department" });
    }

    return res.status(200).json({ success: true, employees });
  } catch (error) {
    console.error("Error fetching employees by department ID:", error);
    return res.status(500).json({ success: false, error: error?.message || "Internal server error" });
  }
};


export { addEmployee, upload , getAllEmployees , getEmployeeById , updateEmployee ,fetchEmployeesByDepId};
