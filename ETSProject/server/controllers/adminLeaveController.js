import Leave from "../models/Leave.js";
import Employee from "../models/Employee.js";
import User from "../models/User.js";
import Salary from "../models/Salary.js";
import Department from "../models/Department.js";

// Get leave details by ID
export const getLeaveAdminById = async (req, res) => {
  try {
    const employeeId = req.params.id; // Extract employee ID from request parameters
    console.log("Employee ID:", employeeId);

    // Step 1: Find the userId from the Employee collection using the employeeId
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ success: false, error: "Employee not found" });
    }
    const userId = employee.userId; // Extract userId from the employee document
    console.log("User ID:", userId);

    // Step 2: Find the leave details using the userId
    const leaves = await Leave.find({ userId }).populate("userId", "name email");
    if (!leaves || leaves.length === 0) {
      return res.status(404).json({ success: false, error: "No leave records found for this employee" });
    }

    // Step 3: Format the response
    const formattedLeaves = leaves.map((leave) => ({
      _id: leave._id,
      leaveType: leave.leaveType,
      description: leave.description,
      fromDate: leave.fromDate,
      toDate: leave.toDate,
      status: leave.status,
      appliedDate: leave.appliedDate,
      employee: {
        name: leave.userId.name,
        email: leave.userId.email,
      },
    }));

    return res.status(200).json({ success: true, leaves: formattedLeaves });
  } catch (error) {
    console.error("Error fetching leave details:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

 
// Get leave details by leave ID
export const getLeaveDetailsById = async (req, res) => {
  try {
    const leaveId = req.params.id;

    // Fetch leave details
    const leave = await Leave.findById(leaveId).populate("userId", "name email profileImage");
    if (!leave) {
      return res.status(404).json({ success: false, error: "Leave not found" });
    }

    // Fetch employee details
    const employee = await Employee.findOne({ userId: leave.userId._id }).populate("department", "dep_name");
    if (!employee) {
      return res.status(404).json({ success: false, error: "Employee not found" });
    }

    // Calculate total days of leave
    const fromDates = new Date(leave.fromDate);
    const toDates = new Date(leave.toDate);
    const totalDate = Math.ceil((toDates - fromDates) / (1000 * 60 * 60 * 24)) + 1;

    // Combine leave and employee details
    const leaveDetails = {
      leaveType: leave.leaveType,
      description: leave.description,
      fromDate: leave.fromDate,
      toDate: leave.toDate,
      status: leave.status,
      appliedDate: leave.appliedDate,
      totalDate: totalDate,
      employee: {
        id: employee.employeeId,
        name: leave.userId.name,
        email: leave.userId.email,
        profileImage: leave.userId.profileImage,
        department: employee.department?.dep_name || "N/A",
      },
    };

    res.status(200).json({ success: true, leaveDetails });
  } catch (error) {
    console.error("Error fetching leave details:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update leave status (Approve/Reject)
export const updateLeaveStatus = async (req, res) => {
  try {
    const leaveId = req.params.id;
    const { status } = req.body;

    // Update leave status
    const leave = await Leave.findByIdAndUpdate(leaveId, { status }, { new: true });
    if (!leave) {
      return res.status(404).json({ success: false, error: "Leave not found" });
    }

    res.status(200).json({ success: true, message: `Leave ${status.toLowerCase()} successfully`, leave });
  } catch (error) {
    console.error("Error updating leave status:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};






