import Leave from "../models/Leave.js";
import Employee from "../models/Employee.js";
import User from "../models/User.js";
import Salary from "../models/Salary.js";
import Department from "../models/Department.js";



//admin summary controller
export const getAdminSummary = async (req, res) => {
  try {
    // // Total Departments
     const totalDepartments = await Department.countDocuments();

    // // Total Employees
     const totalEmployees = await Employee.countDocuments();

    // Total Salary Paid This Month
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const totalSalaryPaid = await Salary.aggregate([
      {
        $match: {
          payDate: {
            $gte: new Date(currentYear, currentMonth, 1),
            $lt: new Date(currentYear, currentMonth + 1, 1),
          },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: { $add: ["$basicSalary", "$allowance", { $subtract: [0, "$deduction"] }] } },
        },
      },
    ]);
    const totalSalary = totalSalaryPaid.length > 0 ? totalSalaryPaid[0].total : 0;

    // Total Leave Statistics
    const totalLeaves = await Leave.countDocuments();
    const leavePending = await Leave.countDocuments({ status: "Pending" });
    const leaveApproved = await Leave.countDocuments({ status: "Approved" });
    const leaveRejected = await Leave.countDocuments({ status: "Rejected" });

    // Combine all data
    //const totalDepartments  = 10;
    //const totalEmployees = 100;
   // const totalSalary = 50000;
    // const totalLeaves = 50;
    // const leavePending = 20;
    // const leaveApproved = 25;
    // const leaveRejected = 5;
    
    const summary = {
      totalDepartments,
      totalEmployees,
      totalSalary,
      totalLeaves,
      leavePending,
      leaveApproved,
      leaveRejected,
    };

    res.status(200).json({ success: true, summary });
  } catch (error) {
    console.error("Error fetching admin summary:", error);
    res.status(500).json({ success: false, error: "Server error while fetching admin summary" });
  }
};