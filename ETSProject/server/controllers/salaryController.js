import Salary from "../models/Salary.js";
import Employee from "../models/Employee.js";

export const addSalary = async (req, res) => {
  try {
    const { employee, basicSalary, allowance, deduction, payDate } = req.body;

    // Ensure the employee exists
    const employeeData = await Employee.findById(employee);
    if (!employeeData) {
      return res.status(404).json({ success: false, error: "Employee not found" });
    }

    // Create a new salary record
    const newSalary = new Salary({
      employeeId: employee,
      basicSalary: parseFloat(basicSalary),
      allowance: parseFloat(allowance),
      deduction: parseFloat(deduction),
      payDate: new Date(payDate),
    });

    await newSalary.save();

    return res.status(201).json({ success: true, message: "Salary added successfully", salary: newSalary });
  } catch (error) {
    console.error("Error adding salary:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};


export const getSalaryByEmployeeId = async (req, res) => {
  try {
    const { employeeId } = req.params;

    const salaryRecords = await Salary.find({ employeeId }).populate("employeeId", "userId");
    if (!salaryRecords || salaryRecords.length === 0) {
      return res.status(404).json({ success: false, error: "No salary records found for this employee" });
    }

    return res.status(200).json({ success: true, salaryRecords });
  } catch (error) {
    console.error("Error fetching salary records:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};



export const getSalaryHistoryByEmployeeId = async (req, res) => {
  try {
    const { employeeId } = req.params;

    // Fetch salary history for the employee
    const salaryHistory = await Salary.find({ employeeId }).sort({ payDate: -1 }); // Sort by payDate (most recent first)

    if (!salaryHistory || salaryHistory.length === 0) {
      return res.status(404).json({ success: false, error: "No salary records found for this employee" });
    }

    return res.status(200).json({ success: true, salaryHistory });
  } catch (error) {
    console.error("Error fetching salary history:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};
 
// Get salary history for the logged-in user
export const getSalaryHistoryByUserId = async (req, res) => {

  try {
    // Find the employee record using the logged-in user's userId
    const employee = await Employee.findOne({ userId: req.user._id });

    if (!employee) {
      return res.status(404).json({ success: false, error: "Employee not found" });
    }

    // Use the employeeId to fetch salary records
    const salaryHistory = await Salary.find({ employeeId: employee._id }).sort({ payDate: -1 });

    if (!salaryHistory || salaryHistory.length === 0) {
      return res.status(404).json({ success: false, error: "No salary records found" });
    }

    return res.status(200).json({ success: true, salaryHistory });
  } catch (error) {
    console.error("Error fetching salary history:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};