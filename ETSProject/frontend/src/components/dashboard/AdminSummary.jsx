import React, { useEffect, useState } from "react";
import SummaryCard from "./SummaryCard";
import { FaBuilding, FaUsers, FaMoneyBillWave, FaFileAlt, FaCheckCircle, FaHourglassHalf, FaTimesCircle } from "react-icons/fa";
import axios from "axios";

const AdminSummary = () => {
  const [summary, setSummary] = useState({
    totalDepartments: 0,
    totalEmployees: 0,
    totalSalary: 0,
    totalLeaves: 0,
    leavePending: 0,
    leaveApproved: 0,
    leaveRejected: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/adminSummary/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Pass the token for authentication
          },
        });

        if (response.data.success) {
          setSummary(response.data.summary);
        } else {
          
          
          console.error("Error fetching summary:", response.data.error);
        }
      } catch (error) {
        console.error("Error fetching summary:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl font-bold text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <h3 className="text-2xl font-bold">Dashboard Overview</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <SummaryCard icon={<FaUsers />} text="Total Employees" number={summary.totalEmployees} color="bg-teal-600" />
        <SummaryCard icon={<FaBuilding />} text="Total Departments" number={summary.totalDepartments} color="bg-yellow-600" />
        <SummaryCard icon={<FaMoneyBillWave />} text="Monthly Salary" number={`$${summary.totalSalary}`} color="bg-red-600" />
      </div>

      <div className="mt-12">
        <h4 className="text-center text-2xl font-bold">Leave Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <SummaryCard icon={<FaFileAlt />} text="Leave Applied" number={summary.totalLeaves} color="bg-teal-600" />
          <SummaryCard icon={<FaCheckCircle />} text="Leave Approved" number={summary.leaveApproved} color="bg-green-600" />
          <SummaryCard icon={<FaHourglassHalf />} text="Leave Pending" number={summary.leavePending} color="bg-yellow-600" />
          <SummaryCard icon={<FaTimesCircle />} text="Leave Rejected" number={summary.leaveRejected} color="bg-red-600" />
        </div>
      </div>
    </>
  );
};

export default AdminSummary;
