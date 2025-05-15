import React, { useEffect, useState } from "react";
import axios from "axios";

const Salary = () => {
  const [salaryHistory, setSalaryHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSalaryHistory = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/salary", {
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
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-teal-100 to-blue-100">
        <div className="flex flex-col items-center">
          <svg className="animate-spin h-10 w-10 text-teal-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
          <div className="text-xl font-bold text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  if (salaryHistory.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-teal-100 to-blue-100">
        <div className="text-xl font-bold text-red-600">No salary records found</div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-teal-100 to-blue-100 min-h-screen p-6 flex items-center justify-center">
      <div className="w-full max-w-4xl bg-white shadow-2xl rounded-2xl p-10 animate-fade-in border border-slate-200">
        <h1 className="text-3xl font-extrabold text-black mb-8 text-center tracking-tight flex items-center justify-center gap-3">
          <span>💰</span> Salary History
        </h1>
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-teal-100 to-blue-100 text-teal-700 uppercase text-xs">
                <th className="px-4 py-3 text-left">S.No</th>
                <th className="px-4 py-3 text-left">Basic Salary</th>
                <th className="px-4 py-3 text-left">Allowance</th>
                <th className="px-4 py-3 text-left">Deduction</th>
                <th className="px-4 py-3 text-left">Total</th>
                <th className="px-4 py-3 text-left">Pay Date</th>
              </tr>
            </thead>
            <tbody>
              {salaryHistory.map((salary, index) => (
                <tr key={salary._id} className="hover:bg-teal-50 transition">
                  <td className="px-4 py-3 text-center font-semibold">{index + 1}</td>
                  <td className="px-4 py-3 text-center text-gray-800 font-medium">₹{salary.basicSalary.toLocaleString()}</td>
                  <td className="px-4 py-3 text-center text-green-700 font-semibold">+₹{salary.allowance.toLocaleString()}</td>
                  <td className="px-4 py-3 text-center text-red-600 font-semibold">-₹{salary.deduction.toLocaleString()}</td>
                  <td className="px-4 py-3 text-center font-bold text-teal-700">₹{(salary.basicSalary + salary.allowance - salary.deduction).toLocaleString()}</td>
                  <td className="px-4 py-3 text-center text-gray-600">{new Date(salary.payDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.7s cubic-bezier(.4,0,.2,1) both;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px);}
          to { opacity: 1; transform: translateY(0);}
        }
      `}</style>
    </div>
  );
};

export default Salary;
