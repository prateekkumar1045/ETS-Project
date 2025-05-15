import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const SalaryHistory = () => {
  const { employeeId } = useParams(); // Get employee ID from the URL
  const [salaryHistory, setSalaryHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSalaryHistory = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/salary/history/${employeeId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.data.success) {
          setSalaryHistory(response.data.salaryHistory);
        } else {
          console.error("Error fetching salary history:", response.data.error);
        }
      } catch (error) {
        console.error("Error fetching salary history:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSalaryHistory();
  }, [employeeId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl font-bold text-gray-600">Loading...</div>
      </div>
    );
  }

  if (salaryHistory.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl font-bold text-red-600">No salary records found for this employee</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-teal-100 to-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto bg-white bg-opacity-80 backdrop-blur-md p-10 rounded-3xl shadow-2xl border border-gray-200">
        <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-8 drop-shadow-lg">
          💰 Salary History
        </h2>

        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">S.No</th>
              <th className="border border-gray-300 px-4 py-2">Basic Salary</th>
              <th className="border border-gray-300 px-4 py-2">Allowance</th>
              <th className="border border-gray-300 px-4 py-2">Deduction</th>
              <th className="border border-gray-300 px-4 py-2">Total</th>
              <th className="border border-gray-300 px-4 py-2">Pay Date</th>
            </tr>
          </thead>
          <tbody>
            {salaryHistory.map((salary, index) => (
              <tr key={salary._id} className="hover:bg-gray-100">
                <td className="border border-gray-300 px-4 py-2 text-center">{index + 1}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">{salary.basicSalary}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">{salary.allowance}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">{salary.deduction}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {salary.basicSalary + salary.allowance - salary.deduction}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {new Date(salary.payDate).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="text-center mt-6">
          <button
            onClick={() => navigate("/admin-dashboard/employees")}
            className="px-6 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 font-semibold"
          >
            Back to Employees
          </button>
        </div>
      </div>
    </div>
  );
};

export default SalaryHistory;