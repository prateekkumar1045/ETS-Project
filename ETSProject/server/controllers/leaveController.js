import Leave from "../models/Leave.js";

import User from "../models/User.js";
import Employee from "../models/Employee.js";

// Get all leaves for a specific user
export const getLeavesAll = async (req, res) => {

  try {
    const leaves = await Leave.aggregate([
      {
        $lookup: {
          from: "employees",
          localField: "userId",
          foreignField: "userId",
          as: "employeeData",
        },
      },
      { $unwind: { path: "$employeeData", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userData",
        },
      },
      { $unwind: { path: "$userData", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "departments",
          localField: "employeeData.department",
          foreignField: "_id",
          as: "departmentData",
        },
      },
      { $unwind: { path: "$departmentData", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: { $toString: "$_id" },
          employeeName: "$userData.name",
          employeeId: "$employeeData.employeeId",
          leaveType: 1,
          department: "$departmentData.dep_name",
          description: 1,
          fromDate: {
            $dateToString: { format: "%Y-%m-%d", date: "$fromDate" },
          },
          toDate: {
            $dateToString: { format: "%Y-%m-%d", date: "$toDate" },
          },
          status: 1,
          appliedDate: {
            $dateToString: { format: "%Y-%m-%d", date: "$appliedDate" },
          },
        },
      },
    ]);

    console.log("Fetched leaves:", leaves);

    // Wrap the response in the expected format
    res.status(200).json({ success: true, leaves });
  } catch (err) {
    console.error("Error fetching leave records:", err);
    res.status(500).json({ success: false, message: "Server error while fetching leave records" });
  }
};


// Add a new leave
export const addLeave = async (req, res) => {
  try {
    const { leaveType, description, fromDate, toDate } = req.body;

    const newLeave = new Leave({
      userId: req.user._id,
      leaveType,
      description,
      fromDate,
      toDate,
    });

    await newLeave.save();
    return res.status(201).json({ success: true, message: "Leave applied successfully", leave: newLeave });
  } catch (error) {
    console.error("Error applying leave:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};




// // Get leave details by ID
// export const getLeaveById = async (req, res) => {
//   try {
//     const employeeId = req.params.id; // Extract employee ID from request parameters
//     console.log("Employee ID:", employeeId);

//     // Step 1: Find the userId from the Employee collection using the employeeId
//     const employee = await Employee.findById(employeeId);
//     if (!employee) {
//       return res.status(404).json({ success: false, error: "Employee not found" });
//     }
//     const userId = employee.userId; // Extract userId from the employee document
//     console.log("User ID:", userId);

//     // Step 2: Find the leave details using the userId
//     const leaves = await Leave.find({ userId }).populate("userId", "name email");
//     if (!leaves || leaves.length === 0) {
//       return res.status(404).json({ success: false, error: "No leave records found for this employee" });
//     }

//     // Step 3: Format the response
//     const formattedLeaves = leaves.map((leave) => ({
//       _id: leave._id,
//       leaveType: leave.leaveType,
//       description: leave.description,
//       fromDate: leave.fromDate,
//       toDate: leave.toDate,
//       status: leave.status,
//       appliedDate: leave.appliedDate,
//       employee: {
//         name: leave.userId.name,
//         email: leave.userId.email,
//       },
//     }));

//     return res.status(200).json({ success: true, leaves: formattedLeaves });
//   } catch (error) {
//     console.error("Error fetching leave details:", error);
//     return res.status(500).json({ success: false, error: error.message });
//   }
// };







// // Update leave status
// export const updateLeaveStatus = async (req, res) => {
//   try {
//     const { status } = req.body;
//     const leave = await Leave.findByIdAndUpdate(req.params.id, { status }, { new: true });
//     if (!leave) {
//       return res.status(404).json({ success: false, error: "Leave not found" });
//     }
//     return res.status(200).json({ success: true, message: `Leave ${status.toLowerCase()} successfully`, leave });
//   } catch (error) {
//     console.error("Error updating leave status:", error);
//     return res.status(500).json({ success: false, error: error.message });
//   }
// };






// this route for employee to get their own leave records
export const getLeavesByUserId = async (req, res) => {
 try {
    const userId = req.user._id; // ✅ Extract user ID from auth middleware
    console.log("User ID from auth middleware:", userId);
    
    const allLeaves = await Leave.find({ userId }).sort({ appliedDate: -1 });

    const formattedLeaves = allLeaves.map((leave) => ({
      _id: leave._id.toString(),
      employeeName: leave.employeeName, // optional if needed
      employeeId: leave.employeeId,
      leaveType: leave.leaveType,
      department: leave.departmentName, // if already populated; otherwise, populate first
      description: leave.description,
      fromDate: leave.fromDate.toISOString().split("T")[0],
      toDate: leave.toDate.toISOString().split("T")[0],
      status: leave.status,
      appliedDate: leave.appliedDate.toISOString().split("T")[0],
    }));

    res.status(200).json({ success: true, leaves: formattedLeaves });
  } catch (err) {
    console.error("Error fetching leave records:", err);
    res.status(500).json({
      success: false,
      message: "Server error while fetching leave records",
    });
  }
};
