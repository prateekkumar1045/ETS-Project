import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddSalary = () => {
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    department: "",
    employee: "",
    basicSalary: "",
    allowance: "",
    deduction: "",
    payDate: "",
  });
  const navigate = useNavigate();

  // Fetch departments and employees
  useEffect(() => {
    const fetchDepartmentsAndEmployees = async () => {
      try {
        // Fetch departments
        const departmentResponse = await axios.get("http://localhost:5000/api/department", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (departmentResponse.data.success) {
          setDepartments(departmentResponse.data.departments);
        }

        // Fetch employees
        const employeeResponse = await axios.get("http://localhost:5000/api/employee", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (employeeResponse.data.success) {
          setEmployees(employeeResponse.data.employees);
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchDepartmentsAndEmployees();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `http://localhost:5000/api/salary/add`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        alert("Salary updated successfully!");
        navigate("/admin-dashboard/employees");
      } else {
        console.error("Error updating salary:", response.data.error);
      }
    } catch (error) {
      console.error("Error updating salary:", error.response?.data?.error || error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-teal-100 to-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white bg-opacity-80 backdrop-blur-md p-10 rounded-3xl shadow-2xl border border-gray-200">
        <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-8 drop-shadow-lg">
          💰 Add Salary
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Department */}
          <div className="flex flex-col gap-2">
            <label htmlFor="department" className="text-lg font-semibold text-gray-700">
              Department
            </label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="px-4 py-2 border border-gray-300 rounded"
              required
            >
              <option value="">Select Department</option>
              {departments.map((dep) => (
                <option key={dep._id} value={dep._id}>
                  {dep.dep_name}
                </option>
              ))}
            </select>
          </div>

          {/* Employee */}
          <div className="flex flex-col gap-2">
            <label htmlFor="employee" className="text-lg font-semibold text-gray-700">
              Employee
            </label>
            <select
              name="employee"
              value={formData.employee}
              onChange={handleChange}
              className="px-4 py-2 border border-gray-300 rounded"
              required
            >
              <option value="">Select Employee</option>
              {employees
                .filter((emp) => emp.department?._id === formData.department)
                .map((emp) => (
                  <option key={emp._id} value={emp._id}>
                    {emp.userId.name}
                  </option>
                ))}
            </select>
          </div>

          {/* Basic Salary */}
          <div className="flex flex-col gap-2">
            <label htmlFor="basicSalary" className="text-lg font-semibold text-gray-700">
              Basic Salary
            </label>
            <input
              type="number"
              name="basicSalary"
              value={formData.basicSalary}
              onChange={handleChange}
              placeholder="Enter Basic Salary"
              className="px-4 py-2 border border-gray-300 rounded"
              required
            />
          </div>

          {/* Allowance */}
          <div className="flex flex-col gap-2">
            <label htmlFor="allowance" className="text-lg font-semibold text-gray-700">
              Allowance
            </label>
            <input
              type="number"
              name="allowance"
              value={formData.allowance}
              onChange={handleChange}
              placeholder="Enter Allowance"
              className="px-4 py-2 border border-gray-300 rounded"
              required
            />
          </div>

          {/* Deduction */}
          <div className="flex flex-col gap-2">
            <label htmlFor="deduction" className="text-lg font-semibold text-gray-700">
              Deduction
            </label>
            <input
              type="number"
              name="deduction"
              value={formData.deduction}
              onChange={handleChange}
              placeholder="Enter Deduction"
              className="px-4 py-2 border border-gray-300 rounded"
              required
            />
          </div>

          {/* Pay Date */}
          <div className="flex flex-col gap-2">
            <label htmlFor="payDate" className="text-lg font-semibold text-gray-700">
              Pay Date
            </label>
            <input
              type="date"
              name="payDate"
              value={formData.payDate}
              onChange={handleChange}
              className="px-4 py-2 border border-gray-300 rounded"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="px-6 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 font-semibold"
            >
              Update Salary
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSalary;