import mongoose from "mongoose";

const salarySchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee", // Reference to the Employee model
    required: true,
  },
  basicSalary: { type: Number, required: true },
  allowance: { type: Number, required: true },
  deduction: { type: Number, required: true },
  payDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Salary = mongoose.model("Salary", salarySchema);
export default Salary;